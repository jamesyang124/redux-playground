import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { useState } from 'react'
import styled from 'styled-components'

// API slice
const api = createApi({
  reducerPath: 'queryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
      providesTags: ['User'],
    }),
    getUserPosts: builder.query({
      query: (userId) => `users/${userId}/posts`,
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

const Container = styled.div`
  padding: 2rem;
`

const Title = styled.h2`
  color: #764abc;
  margin-bottom: 1rem;
`

const Controls = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const Button = styled.button`
  background: #764abc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background: #5a3a94;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const Select = styled.select`
  padding: 0.5rem;
  margin-right: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`

const Panel = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
`

const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`

const UserItem = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
  
  ${props => props.selected && `
    background: #e3f2fd;
    border-left: 3px solid #764abc;
  `}
`

const PostItem = styled.div`
  padding: 1rem;
  border: 1px solid #eee;
  margin-bottom: 0.5rem;
  border-radius: 4px;
`

const LoadingState = styled.div`
  padding: 1rem;
  color: #666;
  font-style: italic;
`

const ErrorState = styled.div`
  padding: 1rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 4px;
`

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
          <UserList>
            {users.map((user) => (
              <UserItem
                key={user.id}
                selected={selectedUserId === user.id}
                onClick={() => setSelectedUserId(user.id)}
              >
                <strong>{user.name}</strong>
                <div>{user.email}</div>
                <div>{user.company.name}</div>
              </UserItem>
            ))}
          </UserList>
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
                <PostItem key={post.id}>
                  <h5>{post.title}</h5>
                  <p>{post.body}</p>
                </PostItem>
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