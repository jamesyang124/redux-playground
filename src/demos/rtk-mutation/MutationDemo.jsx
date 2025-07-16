import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import styled from 'styled-components'

// Mock API
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
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

const Container = styled.div`
  padding: 2rem;
`

const Title = styled.h2`
  color: #764abc;
  margin-bottom: 1rem;
`

const Form = styled.form`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
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

const PostList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const PostItem = styled.div`
  padding: 1rem;
  border: 1px solid #eee;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const PostContent = styled.div`
  flex: 1;
`

const DeleteButton = styled(Button)`
  background: #dc3545;
  
  &:hover {
    background: #c82333;
  }
`

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

  if (isLoading) return <div>Loading posts...</div>
  if (error) return <div>Error: {error.message}</div>

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
      <PostList>
        {posts.slice(0, 10).map((post) => (
          <PostItem key={post.id}>
            <PostContent>
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </PostContent>
            <DeleteButton onClick={() => handleDelete(post.id)}>
              Delete
            </DeleteButton>
          </PostItem>
        ))}
      </PostList>
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