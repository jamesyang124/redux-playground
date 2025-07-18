# Async Thunks Demo - Comprehensive Guide

## Overview
This demo showcases **createAsyncThunk**, Redux Toolkit's solution for handling asynchronous operations. AsyncThunks provide a standardized way to manage async logic with automatic loading states, error handling, and lifecycle management.

## What is createAsyncThunk?

`createAsyncThunk` is a function that:
- ✅ **Generates async action creators** with standardized promise lifecycle
- ✅ **Automatically creates action types** (pending/fulfilled/rejected)
- ✅ **Handles loading states** and error management
- ✅ **Serializes errors** for Redux store compatibility
- ✅ **Supports cancellation** and conditional execution
- ✅ **Provides TypeScript support** with excellent type inference
- ✅ **Integrates seamlessly** with createSlice extraReducers

## Basic AsyncThunk Setup

### 1. Creating AsyncThunks
```typescript
import { createAsyncThunk } from '@reduxjs/toolkit'

// Basic async thunk
export const fetchUserById = createAsyncThunk(
  'users/fetchById',                    // Action type prefix
  async (userId: number, thunkAPI) => { // Payload creator
    const response = await api.fetchUser(userId)
    return response.data
  }
)

// With error handling
export const fetchUserWithErrorHandling = createAsyncThunk(
  'users/fetchWithErrorHandling',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.fetchUser(userId)
      return response.data
    } catch (error) {
      // Return custom error payload
      return rejectWithValue(error.message)
    }
  }
)

// With complex parameters
export const updateUserProfile = createAsyncThunk(
  'users/updateProfile',
  async (
    { userId, updates }: { userId: number; updates: Partial<User> },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token
      
      const response = await api.updateUser(userId, updates, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Update failed')
    }
  }
)
```

### 2. ThunkAPI Object - All Available Methods
```typescript
const thunkAPI = {
  dispatch,           // Store dispatch function
  getState,          // Current state getter
  extra,             // Extra argument from middleware
  requestId,         // Unique request identifier
  signal,            // AbortSignal for cancellation
  rejectWithValue,   // Return custom error payload
  fulfillWithValue,  // Return custom success payload (rarely needed)
}

// Example using all thunkAPI features
export const complexAsyncThunk = createAsyncThunk(
  'data/complexOperation',
  async (
    payload: { id: number; data: any },
    { dispatch, getState, signal, rejectWithValue, requestId }
  ) => {
    const state = getState() as RootState
    
    // Check if already loading
    if (state.data.loading) {
      return rejectWithValue('Already loading')
    }
    
    // Dispatch additional actions
    dispatch(setLoadingMessage('Starting complex operation...'))
    
    try {
      // Use AbortSignal for cancellation
      const response = await fetch(`/api/data/${payload.id}`, {
        method: 'POST',
        body: JSON.stringify(payload.data),
        signal, // Automatic cancellation support
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const result = await response.json()
      
      // Dispatch success action
      dispatch(setLoadingMessage('Operation completed!'))
      
      return result
    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue('Operation cancelled')
      }
      
      dispatch(setLoadingMessage(''))
      return rejectWithValue(error.message)
    }
  }
)
```

## Slice Integration with extraReducers

### Complete Lifecycle Handling
```typescript
interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  lastFetch: string | null
  requestId: string | null
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  lastFetch: null,
  requestId: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserById lifecycle
      .addCase(fetchUserById.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.lastFetch = new Date().toISOString()
        state.requestId = null
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || action.error.message || 'Failed to fetch user'
        state.requestId = null
      })
      
      // updateUserProfile lifecycle
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        
        // Update user in users array if it exists
        const index = state.users.findIndex(user => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to update profile'
      })
  },
})
```

## Advanced AsyncThunk Patterns

### 1. Conditional Execution
```typescript
// Only execute if condition is met
export const fetchUserConditionally = createAsyncThunk(
  'users/fetchConditionally',
  async (userId: number) => {
    const response = await api.fetchUser(userId)
    return response.data
  },
  {
    condition: (userId, { getState }) => {
      const state = getState() as RootState
      
      // Don't fetch if already loading
      if (state.users.loading) {
        return false
      }
      
      // Don't fetch if user already exists and was fetched recently
      const existingUser = state.users.users.find(user => user.id === userId)
      if (existingUser && state.users.lastFetch) {
        const lastFetch = new Date(state.users.lastFetch)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        return lastFetch < fiveMinutesAgo
      }
      
      return true
    },
    dispatchConditionRejection: true, // Dispatch rejected action when condition fails
  }
)
```

### 2. Cancellation Support
```typescript
// Thunk with cancellation
export const fetchDataWithCancellation = createAsyncThunk(
  'data/fetchWithCancellation',
  async (params: SearchParams, { signal }) => {
    // Pass AbortSignal to fetch
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify(params),
      signal, // Automatic cancellation
    })
    
    return response.json()
  }
)

// Usage with cancellation
const dispatch = useDispatch()

const handleSearch = (searchTerm: string) => {
  // Cancel previous search
  if (currentSearchRequest) {
    currentSearchRequest.abort()
  }
  
  // Start new search
  currentSearchRequest = dispatch(fetchDataWithCancellation({ term: searchTerm }))
}
```

### 3. Thunk Chaining and Dependencies
```typescript
// Sequential thunks
export const fetchUserAndPosts = createAsyncThunk(
  'users/fetchUserAndPosts',
  async (userId: number, { dispatch }) => {
    // Fetch user first
    const userResult = await dispatch(fetchUserById(userId)).unwrap()
    
    // Then fetch their posts
    const postsResult = await dispatch(fetchUserPosts(userId)).unwrap()
    
    // Return combined data
    return {
      user: userResult,
      posts: postsResult,
    }
  }
)

// Parallel thunks
export const fetchUserDataParallel = createAsyncThunk(
  'users/fetchUserDataParallel',
  async (userId: number, { dispatch }) => {
    // Fetch multiple things in parallel
    const [userResult, postsResult, commentsResult] = await Promise.all([
      dispatch(fetchUserById(userId)).unwrap(),
      dispatch(fetchUserPosts(userId)).unwrap(),
      dispatch(fetchUserComments(userId)).unwrap(),
    ])
    
    return {
      user: userResult,
      posts: postsResult,
      comments: commentsResult,
    }
  }
)
```

### 4. Retry Logic
```typescript
export const fetchWithRetry = createAsyncThunk(
  'data/fetchWithRetry',
  async (
    { url, maxRetries = 3 }: { url: string; maxRetries?: number },
    { rejectWithValue }
  ) => {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        return await response.json()
      } catch (error) {
        lastError = error as Error
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          )
        }
      }
    }
    
    return rejectWithValue(`Failed after ${maxRetries} attempts: ${lastError.message}`)
  }
)
```

## Using AsyncThunks in Components

### Basic Hook Patterns
```typescript
function UserProfile({ userId }: { userId: number }) {
  const dispatch = useDispatch()
  
  const { currentUser, loading, error } = useSelector((state: RootState) => state.users)
  
  // Basic dispatch
  useEffect(() => {
    dispatch(fetchUserById(userId))
  }, [dispatch, userId])
  
  // Handle loading and error states
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!currentUser) return <div>No user found</div>
  
  return <UserDetails user={currentUser} />
}
```

### Advanced Component Integration
```typescript
function UserManagement() {
  const dispatch = useDispatch()
  const [isUpdating, setIsUpdating] = useState(false)
  
  const { currentUser, loading, error } = useSelector((state: RootState) => state.users)
  
  // Handle async thunk with promise
  const handleUpdateProfile = async (updates: Partial<User>) => {
    setIsUpdating(true)
    
    try {
      const result = await dispatch(updateUserProfile({
        userId: currentUser!.id,
        updates
      })).unwrap()
      
      toast.success('Profile updated successfully!')
      return result
    } catch (error) {
      toast.error(`Update failed: ${error}`)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }
  
  // Conditional thunk execution
  const handleRefreshIfStale = () => {
    if (currentUser) {
      dispatch(fetchUserConditionally(currentUser.id))
    }
  }
  
  return (
    <div>
      <UserForm 
        user={currentUser}
        onSubmit={handleUpdateProfile}
        isSubmitting={isUpdating}
      />
      <Button onClick={handleRefreshIfStale}>
        Refresh User Data
      </Button>
    </div>
  )
}
```

## Error Handling Strategies

### Comprehensive Error Management
```typescript
// Enhanced error handling thunk
export const fetchUserWithDetailedErrors = createAsyncThunk(
  'users/fetchWithDetailedErrors',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.fetchUser(userId)
      return response.data
    } catch (error) {
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const message = error.response.data?.message || 'Server error'
        
        return rejectWithValue({
          status,
          message,
          type: 'server_error',
        })
      } else if (error.request) {
        // Network error
        return rejectWithValue({
          message: 'Network error - please check your connection',
          type: 'network_error',
        })
      } else {
        // Other error
        return rejectWithValue({
          message: error.message || 'An unexpected error occurred',
          type: 'unknown_error',
        })
      }
    }
  }
)

// Handle errors in slice
.addCase(fetchUserWithDetailedErrors.rejected, (state, action) => {
  state.loading = false
  
  const error = action.payload as any
  
  if (error?.type === 'network_error') {
    state.networkError = true
    state.error = 'Please check your internet connection'
  } else if (error?.status === 404) {
    state.error = 'User not found'
  } else if (error?.status === 403) {
    state.error = 'You don\'t have permission to view this user'
  } else {
    state.error = error?.message || 'Failed to fetch user'
  }
})
```

### Error Recovery Patterns
```typescript
// Component with error recovery
function UserProfileWithRecovery({ userId }: { userId: number }) {
  const dispatch = useDispatch()
  const [retryCount, setRetryCount] = useState(0)
  
  const { currentUser, loading, error, networkError } = useSelector(
    (state: RootState) => state.users
  )
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    dispatch(fetchUserById(userId))
  }
  
  const handleFallbackAction = () => {
    // Navigate to user list or show cached data
    router.push('/users')
  }
  
  if (loading) return <LoadingSpinner />
  
  if (error) {
    return (
      <ErrorBoundary
        error={error}
        onRetry={handleRetry}
        onFallback={handleFallbackAction}
        retryCount={retryCount}
        maxRetries={3}
      />
    )
  }
  
  return currentUser ? <UserDetails user={currentUser} /> : null
}
```

## TypeScript Best Practices

### Fully Typed AsyncThunks
```typescript
// Define types
interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface UserError {
  message: string
  status?: number
  type: 'server_error' | 'network_error' | 'validation_error'
}

interface FetchUserParams {
  userId: number
  includeProfile?: boolean
}

// Typed thunk
export const fetchUserTyped = createAsyncThunk<
  User,              // Return type
  FetchUserParams,   // Argument type
  {
    rejectValue: UserError // Reject value type
  }
>(
  'users/fetchTyped',
  async ({ userId, includeProfile = false }, { rejectWithValue }) => {
    try {
      const response = await api.fetchUser(userId, { includeProfile })
      return response.data
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        type: 'server_error',
      })
    }
  }
)

// Typed slice state
interface UsersState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: UserError | null
}
```

## Performance Optimizations

### Memoized Selectors
```typescript
import { createSelector } from '@reduxjs/toolkit'

// Memoized selectors for async thunk state
export const selectUsersState = (state: RootState) => state.users

export const selectCurrentUser = createSelector(
  [selectUsersState],
  (usersState) => usersState.currentUser
)

export const selectUserById = createSelector(
  [selectUsersState, (state: RootState, userId: number) => userId],
  (usersState, userId) => usersState.users.find(user => user.id === userId)
)

export const selectIsLoadingUser = createSelector(
  [selectUsersState],
  (usersState) => usersState.loading
)
```

### Optimistic Updates
```typescript
export const updateUserOptimistic = createAsyncThunk(
  'users/updateOptimistic',
  async (
    { userId, updates }: { userId: number; updates: Partial<User> },
    { dispatch, getState, rejectWithValue }
  ) => {
    // Get current state
    const state = getState() as RootState
    const currentUser = state.users.currentUser
    
    if (!currentUser || currentUser.id !== userId) {
      return rejectWithValue('User not found')
    }
    
    // Optimistically update local state
    dispatch(usersSlice.actions.updateUserOptimistically({ userId, updates }))
    
    try {
      const response = await api.updateUser(userId, updates)
      return response.data
    } catch (error) {
      // Revert optimistic update
      dispatch(usersSlice.actions.revertOptimisticUpdate({ userId }))
      return rejectWithValue(error.message)
    }
  }
)
```

## Testing AsyncThunks

### Unit Testing
```typescript
import { configureStore } from '@reduxjs/toolkit'
import { fetchUserById } from './userThunks'
import usersReducer from './usersSlice'

describe('fetchUserById', () => {
  it('should handle successful user fetch', async () => {
    const store = configureStore({
      reducer: { users: usersReducer }
    })
    
    // Mock API response
    jest.spyOn(api, 'fetchUser').mockResolvedValue({
      data: { id: 1, name: 'John Doe', email: 'john@example.com' }
    })
    
    // Dispatch thunk
    await store.dispatch(fetchUserById(1))
    
    // Assert state changes
    const state = store.getState()
    expect(state.users.loading).toBe(false)
    expect(state.users.currentUser).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    })
    expect(state.users.error).toBe(null)
  })
  
  it('should handle user fetch error', async () => {
    const store = configureStore({
      reducer: { users: usersReducer }
    })
    
    // Mock API error
    jest.spyOn(api, 'fetchUser').mockRejectedValue(new Error('User not found'))
    
    // Dispatch thunk
    await store.dispatch(fetchUserById(999))
    
    // Assert error state
    const state = store.getState()
    expect(state.users.loading).toBe(false)
    expect(state.users.currentUser).toBe(null)
    expect(state.users.error).toBe('User not found')
  })
})
```

## Best Practices Summary

1. **Use TypeScript** - Define proper types for arguments, return values, and errors
2. **Handle all states** - Always handle pending, fulfilled, and rejected cases
3. **Implement proper error handling** - Use rejectWithValue for custom error payloads
4. **Consider cancellation** - Use AbortSignal for long-running operations
5. **Optimize with conditions** - Prevent unnecessary API calls
6. **Test thoroughly** - Include success, error, and edge cases
7. **Document your thunks** - Clear naming and comments for complex async logic
8. **Implement retry logic** - For better reliability in network operations
9. **Use memoized selectors** - Prevent unnecessary re-renders

This comprehensive guide covers all aspects of createAsyncThunk for building robust async state management in Redux applications.

## Technical Features

### Lifecycle States
- **Pending** - Thunk is executing
- **Fulfilled** - Thunk completed successfully  
- **Rejected** - Thunk failed with error

### Error Handling
- **`rejectWithValue()`** - Custom error payloads
- **Try/catch blocks** - Proper error boundaries
- **Error state management** - Store and display errors
- **`.unwrap()`** - Extract resolved/rejected values

### Loading Management
- **Multiple loading states** - Track different operations independently
- **Loading indicators** - Visual feedback during async operations
- **Disabled controls** - Prevent multiple simultaneous requests

### Thunk Chaining
- **Sequential execution** - Wait for one thunk before starting another
- **Error propagation** - Handle failures in thunk chains
- **Conditional execution** - Skip thunks based on current state

## Code Structure

```
async-thunks/
├── ThunkDemo.jsx             # Main component with thunks and slice
└── README.md                 # This file
```

### Component Architecture
- **Form controls** - Input for user ID selection
- **Action buttons** - Individual and combined operations
- **State displays** - Show current user and posts
- **Error handling** - Display errors with clear messages

## Learning Objectives

After exploring this demo, you should understand:

1. **createAsyncThunk syntax** and parameters
2. **Thunk lifecycle states** (pending/fulfilled/rejected)
3. **extraReducers usage** for handling async actions
4. **Error handling patterns** with rejectWithValue
5. **Loading state management** for better UX
6. **Thunk chaining** and sequential operations

## Mock API Integration

### Fallback Strategy
```javascript
// Try mocks server first, fallback to generated data
try {
  const response = await fetch(`${MOCK_SERVER_URL}/users/${id}`)
  if (response.ok) {
    return await response.json()
  }
} catch (error) {
  console.log('Using generated mock data')
}
return generateMockUser(id)
```

### Error Simulation
- **User IDs 1-10** - Success responses
- **User IDs 11+** - Error responses (User not found)
- **Network delays** - Realistic 500-1000ms delays

## State Management Patterns

### Initial State
```javascript
initialState: {
  currentUser: null,
  userPosts: [],
  loading: false,        // User loading
  postsLoading: false,   // Posts loading  
  error: null,           // User error
  postsError: null,      // Posts error
}
```

### State Updates
- **Optimistic updates** - Clear errors when starting new requests
- **Granular loading** - Separate loading states for different operations
- **Error isolation** - Independent error states

## Advanced Patterns

### Conditional Thunk Execution
```javascript
// Only fetch posts if user exists
const handleFetchPosts = () => {
  if (!currentUser) return
  dispatch(fetchUserPosts(currentUser.id))
}
```

### Error Recovery
```javascript
const handleClearErrors = () => {
  dispatch(clearErrors())
}
```

### Combined Operations
```javascript
const handleFetchBoth = async () => {
  try {
    const userResult = await dispatch(fetchUserById(userId)).unwrap()
    await dispatch(fetchUserPosts(userResult.id))
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
}
```


## Next Steps

- Try modifying thunk logic for different scenarios
- Experiment with thunk middleware configuration
- Add more complex error handling and retry logic
- Implement optimistic updates manually