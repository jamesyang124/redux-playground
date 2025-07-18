import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { MOCK_SERVER_URL, type Post } from '../../../mocks/server'
import { 
  Container, 
  Title, 
  Form, 
  Input, 
  Button, 
  DeleteButton, 
  ListContainer, 
  ListItem, 
  ItemContent,
  LoadingState,
  ErrorState
} from '../../components/ui'

// Mock API
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: MOCK_SERVER_URL,
  }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts',
      providesTags: ['Post'],
    }),
    addPost: builder.mutation({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
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

const { useGetPostsQuery, useAddPostMutation, useDeletePostMutation } = api


function MutationDemoContent() {
  const { data: posts = [], isLoading, error } = useGetPostsQuery()
  const [addPost, { isLoading: isAdding }] = useAddPostMutation()
  const [deletePost] = useDeletePostMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newPost = {
      title: formData.get('title'),
      body: formData.get('body'),
      userId: 1,
    }
    
    try {
      await addPost(newPost).unwrap()
      e.target.reset()
    } catch (error) {
      console.error('Failed to add post:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePost(id).unwrap()
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  if (isLoading) return <LoadingState>Loading posts...</LoadingState>
  if (error) return <ErrorState>Error: {error.message}</ErrorState>

  return (
    <Container>
      <Title>RTK Mutation Demo</Title>
      <p>This demo shows RTK Query mutations for creating and deleting posts.</p>

      <Form onSubmit={handleSubmit}>
        <h3>Add New Post</h3>
        <Input
          name="title"
          placeholder="Post title"
          required
        />
        <Input
          name="body"
          placeholder="Post body"
          required
        />
        <Button type="submit" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add Post'}
        </Button>
      </Form>

      <h3>Posts ({posts.length})</h3>
      <ListContainer>
        {posts.slice(0, 10).map((post) => (
          <ListItem key={post.id}>
            <ItemContent>
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </ItemContent>
            <DeleteButton onClick={() => handleDelete(post.id)}>
              Delete
            </DeleteButton>
          </ListItem>
        ))}
      </ListContainer>
    </Container>
  )
}

export default function MutationDemo() {
  return (
    <Provider store={store}>
      <MutationDemoContent />
    </Provider>
  )
}