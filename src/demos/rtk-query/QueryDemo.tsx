import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { useState } from 'react'
import { MOCK_SERVER_URL, type User, type Post } from '../../../mocks/server'
import { 
  Container, 
  Title, 
  Controls, 
  Button, 
  Grid, 
  Panel, 
  ListContainer, 
  SelectableItem,
  ListItem,
  LoadingState,
  ErrorState
} from '../../components/ui'

// API slice
const api = createApi({
  reducerPath: 'queryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: MOCK_SERVER_URL,
  }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
      providesTags: ['User'],
    }),
    getUserPosts: builder.query({
      query: (userId) => `posts?userId=${userId}`,
      providesTags: ['Post'],
    }),
    getUser: builder.query({
      query: (id) => `users/${id}`,
      providesTags: ['User'],
    }),
  }),
})

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

const { useGetUsersQuery, useGetUserPostsQuery, useGetUserQuery } = api


function QueryDemoContent() {
  const [selectedUserId, setSelectedUserId] = useState(null)
  
  const { data: users = [], isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useGetUsersQuery()
  
  const { data: selectedUser, isLoading: userLoading } = useGetUserQuery(selectedUserId, {
    skip: !selectedUserId
  })
  
  const { data: userPosts = [], isLoading: postsLoading, error: postsError } = useGetUserPostsQuery(selectedUserId, {
    skip: !selectedUserId
  })

  if (usersLoading) return <LoadingState>Loading users...</LoadingState>
  if (usersError) return <ErrorState>Error loading users: {usersError.message}</ErrorState>

  return (
    <Container>
      <Title>RTK Query Demo</Title>
      <p>This demo shows RTK Query for data fetching, caching, and conditional queries.</p>

      <Controls>
        <h3>Controls</h3>
        <Button onClick={refetchUsers}>
          Refresh Users
        </Button>
        <Button onClick={() => setSelectedUserId(null)}>
          Clear Selection
        </Button>
      </Controls>

      <Grid>
        <Panel>
          <h3>Users ({users.length})</h3>
          <ListContainer maxHeight="300px">
            {users.map((user) => (
              <SelectableItem
                key={user.id}
                selected={selectedUserId === user.id}
                onClick={() => setSelectedUserId(user.id)}
              >
                <strong>{user.name}</strong>
                <div>{user.email}</div>
                <div>{user.company.name}</div>
              </SelectableItem>
            ))}
          </ListContainer>
        </Panel>

        <Panel>
          <h3>User Details & Posts</h3>
          {!selectedUserId && (
            <div>Select a user to see their details and posts</div>
          )}
          
          {selectedUserId && userLoading && (
            <LoadingState>Loading user details...</LoadingState>
          )}
          
          {selectedUser && (
            <div style={{ marginBottom: '1rem' }}>
              <h4>{selectedUser.name}</h4>
              <p>Email: {selectedUser.email}</p>
              <p>Phone: {selectedUser.phone}</p>
              <p>Website: {selectedUser.website}</p>
            </div>
          )}

          {selectedUserId && (
            <>
              <h4>Posts</h4>
              {postsLoading && <LoadingState>Loading posts...</LoadingState>}
              {postsError && <ErrorState>Error loading posts: {postsError.message}</ErrorState>}
              {userPosts.map((post) => (
                <ListItem key={post.id}>
                  <h5>{post.title}</h5>
                  <p>{post.body}</p>
                </ListItem>
              ))}
            </>
          )}
        </Panel>
      </Grid>
    </Container>
  )
}

export default function QueryDemo() {
  return (
    <Provider store={store}>
      <QueryDemoContent />
    </Provider>
  )
}