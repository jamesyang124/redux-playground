import { Provider, useSelector, useDispatch } from 'react-redux'
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useState } from 'react'
import { MOCK_SERVER_URL, generateMockUser, generateMockPost, type User, type Post } from '../../../mocks/server'

// Mock API functions
const mockApi = {
  fetchUser: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (id > 10) throw new Error('User not found')
    
    // Try to fetch from mock server first, fallback to generated data
    try {
      const response = await fetch(`${MOCK_SERVER_URL}/users/${id}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.log('Using generated mock data')
    }
    
    return generateMockUser(id)
  },
  
  fetchUserPosts: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Try to fetch from mock server first, fallback to generated data
    try {
      const response = await fetch(`${MOCK_SERVER_URL}/posts?userId=${userId}`)
      if (response.ok) {
        const posts = await response.json()
        if (posts.length > 0) return posts
      }
    } catch (error) {
      console.log('Using generated mock data')
    }
    
    // Generate mock posts if none found
    const posts = []
    const postCount = Math.floor(Math.random() * 5) + 1
    for (let i = 1; i <= postCount; i++) {
      posts.push(generateMockPost(userId, Date.now() + i))
    }
    return posts
  }
}

// Async thunks
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const user = await mockApi.fetchUser(userId)
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchUserPosts = createAsyncThunk(
  'users/fetchPosts',
  async (userId, { rejectWithValue }) => {
    try {
      const posts = await mockApi.fetchUserPosts(userId)
      return posts
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    currentUser: null,
    userPosts: [],
    loading: false,
    postsLoading: false,
    error: null,
    postsError: null,
  },
  reducers: {
    clearUser: (state) => {
      state.currentUser = null
      state.userPosts = []
      state.error = null
      state.postsError = null
    },
    clearErrors: (state) => {
      state.error = null
      state.postsError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user cases
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch posts cases
      .addCase(fetchUserPosts.pending, (state) => {
        state.postsLoading = true
        state.postsError = null
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.postsLoading = false
        state.userPosts = action.payload
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.postsLoading = false
        state.postsError = action.payload
      })
  },
})

export const { clearUser, clearErrors } = usersSlice.actions

const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
  },
})


function ThunkDemoContent() {
  const [userId, setUserId] = useState('')
  const dispatch = useDispatch()
  
  const { 
    currentUser, 
    userPosts, 
    loading, 
    postsLoading, 
    error, 
    postsError 
  } = useSelector((state) => state.users)

  const handleFetchUser = () => {
    if (!userId) return
    dispatch(fetchUserById(parseInt(userId)))
  }

  const handleFetchPosts = () => {
    if (!currentUser) return
    dispatch(fetchUserPosts(currentUser.id))
  }

  const handleFetchBoth = async () => {
    if (!userId) return
    
    try {
      // Fetch user first, then posts
      const userResult = await dispatch(fetchUserById(parseInt(userId))).unwrap()
      await dispatch(fetchUserPosts(userResult.id))
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleClear = () => {
    dispatch(clearUser())
    setUserId('')
  }

  const handleClearErrors = () => {
    dispatch(clearErrors())
  }

  return (
    <Container>
      <Title>Async Thunks Demo</Title>
      <p>This demo shows createAsyncThunk for handling async operations with loading states and error handling.</p>

      <Controls>
        <h3>Controls</h3>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            min="1"
            max="15"
            style={{ width: '100px', marginRight: '1rem' }}
          />
          <Button onClick={handleFetchUser} disabled={loading || !userId}>
            {loading ? 'Loading...' : 'Fetch User'}
          </Button>
          <Button onClick={handleFetchPosts} disabled={postsLoading || !currentUser}>
            {postsLoading ? 'Loading...' : 'Fetch Posts'}
          </Button>
          <Button onClick={handleFetchBoth} disabled={loading || postsLoading || !userId}>
            Fetch Both
          </Button>
        </div>
        <div>
          <Button onClick={handleClear}>Clear All</Button>
          <Button onClick={handleClearErrors}>Clear Errors</Button>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Try user IDs 1-10 for success, 11+ for error demo
        </div>
      </Controls>

      {error && (
        <ErrorState>
          <strong>User Error:</strong> {error}
        </ErrorState>
      )}

      {postsError && (
        <ErrorState>
          <strong>Posts Error:</strong> {postsError}
        </ErrorState>
      )}

      {loading && (
        <LoadingState>Loading user...</LoadingState>
      )}

      {currentUser && !loading && (
        <Card>
          <h3>Current User</h3>
          <p><strong>ID:</strong> {currentUser.id}</p>
          <p><strong>Name:</strong> {currentUser.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Post Count:</strong> {currentUser.posts}</p>
        </Card>
      )}

      {currentUser && (
        <div>
          <h3>User Posts</h3>
          {postsLoading && (
            <LoadingState>Loading posts...</LoadingState>
          )}
          
          {userPosts.length > 0 && !postsLoading && (
            <div>
              {userPosts.map((post) => (
                <ListItem key={post.id}>
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                </ListItem>
              ))}
            </div>
          )}
          
          {userPosts.length === 0 && !postsLoading && !postsError && currentUser && (
            <div>No posts loaded. Click "Fetch Posts" to load them.</div>
          )}
        </div>
      )}
    </Container>
  )
}

export default function ThunkDemo() {
  return (
    <Provider store={store}>
      <ThunkDemoContent />
    </Provider>
  )
}