# RTK Mutation Demo - Comprehensive Guide

## Overview
This demo showcases **RTK Query mutations**, the powerful way to handle data creation, updates, and deletion in Redux Toolkit. Mutations provide automatic cache management, optimistic updates, and seamless integration with your application state.

## What Are RTK Query Mutations?

RTK Query mutations are used to:
- ✅ **Send data updates** to servers (POST, PUT, PATCH, DELETE)
- ✅ **Update local cache** automatically after successful requests
- ✅ **Invalidate related data** to trigger refetches
- ✅ **Provide loading states** and error handling
- ✅ **Enable optimistic updates** for better UX
- ✅ **Share mutation state** across components

## Basic Mutation Setup

### 1. Define Mutation Endpoints
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add authentication, content-type, etc.
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Post', 'User', 'Comment'],
  endpoints: (builder) => ({
    // Mutations defined here
  })
})
```

### 2. All Mutation Patterns

#### Create Operations (POST)
```typescript
// Basic create mutation
addPost: builder.mutation<Post, CreatePostRequest>({
  query: (newPost) => ({
    url: 'posts',
    method: 'POST',
    body: newPost,
  }),
  invalidatesTags: [{ type: 'Post', id: 'LIST' }],
}),

// Create with file upload
uploadImage: builder.mutation<ImageResponse, FormData>({
  query: (formData) => ({
    url: 'images',
    method: 'POST',
    body: formData,
    formData: true, // For file uploads
  }),
}),

// Create with custom headers
addPostWithMetadata: builder.mutation<Post, CreatePostRequest>({
  query: (newPost) => ({
    url: 'posts',
    method: 'POST',
    body: newPost,
    headers: {
      'X-Custom-Header': 'value',
    },
  }),
  invalidatesTags: ['Post'],
}),
```

#### Update Operations (PUT/PATCH)
```typescript
// Full update (PUT)
updatePost: builder.mutation<Post, { id: number; post: UpdatePostRequest }>({
  query: ({ id, post }) => ({
    url: `posts/${id}`,
    method: 'PUT',
    body: post,
  }),
  invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
}),

// Partial update (PATCH)
patchPost: builder.mutation<Post, { id: number; updates: Partial<Post> }>({
  query: ({ id, updates }) => ({
    url: `posts/${id}`,
    method: 'PATCH',
    body: updates,
  }),
  invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
}),

// Bulk update
bulkUpdatePosts: builder.mutation<Post[], { ids: number[]; updates: Partial<Post> }>({
  query: ({ ids, updates }) => ({
    url: 'posts/bulk',
    method: 'PATCH',
    body: { ids, updates },
  }),
  invalidatesTags: (result, error, { ids }) => 
    ids.map(id => ({ type: 'Post' as const, id })),
}),
```

#### Delete Operations (DELETE)
```typescript
// Simple delete
deletePost: builder.mutation<{ success: boolean; id: number }, number>({
  query: (id) => ({
    url: `posts/${id}`,
    method: 'DELETE',
  }),
  invalidatesTags: (result, error, id) => [
    { type: 'Post', id },
    { type: 'Post', id: 'LIST' },
  ],
}),

// Soft delete
softDeletePost: builder.mutation<Post, number>({
  query: (id) => ({
    url: `posts/${id}/soft-delete`,
    method: 'PATCH',
    body: { deleted: true },
  }),
  invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
}),

// Bulk delete
bulkDeletePosts: builder.mutation<{ success: boolean; count: number }, number[]>({
  query: (ids) => ({
    url: 'posts/bulk-delete',
    method: 'DELETE',
    body: { ids },
  }),
  invalidatesTags: (result, error, ids) => [
    ...ids.map(id => ({ type: 'Post' as const, id })),
    { type: 'Post', id: 'LIST' },
  ],
}),
```

## Using Mutation Hooks - All Patterns

### Basic Hook Usage
```typescript
const [addPost, {
  data,           // Response data from successful mutation
  error,          // Error object if mutation failed
  isLoading,      // True while mutation is in progress
  isSuccess,      // True when mutation completed successfully
  isError,        // True when mutation resulted in an error
  isUninitialized, // True when mutation hasn't been triggered yet
  reset,          // Function to reset mutation state
}] = useAddPostMutation()
```

### Triggering Mutations
```typescript
// Basic trigger
const handleAddPost = async () => {
  try {
    const result = await addPost({
      title: 'New Post',
      content: 'Post content',
      authorId: 1,
    }).unwrap()
    
    console.log('Post created:', result)
  } catch (error) {
    console.error('Failed to create post:', error)
  }
}

// Trigger with original promise
const handleAddPostWithPromise = () => {
  addPost({ title: 'New Post', content: 'Content' })
    .then((result) => {
      if ('data' in result) {
        console.log('Success:', result.data)
      } else {
        console.error('Error:', result.error)
      }
    })
}

// Conditional triggering
const handleConditionalAdd = () => {
  if (postTitle && postContent) {
    addPost({ title: postTitle, content: postContent })
  }
}
```

### Advanced Mutation Handling
```typescript
// With optimistic updates
const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()

const handleOptimisticUpdate = async (id: number, updates: Partial<Post>) => {
  // Optimistically update UI
  const optimisticPost = { ...currentPost, ...updates }
  setCurrentPost(optimisticPost)
  
  try {
    await updatePost({ id, updates }).unwrap()
    // Success - optimistic update was correct
  } catch (error) {
    // Revert optimistic update
    setCurrentPost(currentPost)
    console.error('Update failed:', error)
  }
}

// Sequential mutations
const handleSequentialMutations = async () => {
  try {
    const newPost = await addPost(postData).unwrap()
    await addComment({ postId: newPost.id, content: 'First!' }).unwrap()
    await notifyFollowers({ postId: newPost.id }).unwrap()
  } catch (error) {
    console.error('Sequential mutation failed:', error)
  }
}
```

## Advanced Mutation Patterns

### Optimistic Updates with Manual Cache Management
```typescript
updatePost: builder.mutation<Post, { id: number; updates: Partial<Post> }>({
  query: ({ id, updates }) => ({
    url: `posts/${id}`,
    method: 'PATCH',
    body: updates,
  }),
  
  // Advanced optimistic update
  async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
    // Optimistically update individual post
    const patchResult = dispatch(
      api.util.updateQueryData('getPost', id, (draft) => {
        Object.assign(draft, updates)
      })
    )
    
    // Optimistically update posts list
    const listPatchResult = dispatch(
      api.util.updateQueryData('getPosts', undefined, (draft) => {
        const post = draft.find(p => p.id === id)
        if (post) {
          Object.assign(post, updates)
        }
      })
    )
    
    try {
      await queryFulfilled
    } catch {
      // Revert both optimistic updates
      patchResult.undo()
      listPatchResult.undo()
    }
  },
}),
```

### Custom Response Transformation
```typescript
addPost: builder.mutation<Post, CreatePostRequest>({
  query: (newPost) => ({
    url: 'posts',
    method: 'POST',
    body: newPost,
  }),
  
  // Transform response
  transformResponse: (response: ApiResponse<Post>) => response.data,
  
  // Transform error response
  transformErrorResponse: (response: FetchBaseQueryError) => {
    return response.data || 'An error occurred'
  },
  
  invalidatesTags: ['Post'],
}),
```

### Mutation with Side Effects
```typescript
deletePost: builder.mutation<{ success: boolean }, number>({
  query: (id) => ({
    url: `posts/${id}`,
    method: 'DELETE',
  }),
  
  async onQueryStarted(id, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled
      
      // Side effects after successful deletion
      dispatch(showNotification('Post deleted successfully'))
      dispatch(analyticsApi.endpoints.trackEvent.initiate({
        event: 'post_deleted',
        postId: id
      }))
      
    } catch (error) {
      dispatch(showNotification('Failed to delete post'))
    }
  },
  
  invalidatesTags: (result, error, id) => [
    { type: 'Post', id },
    { type: 'Post', id: 'LIST' },
  ],
}),
```

## Cache Invalidation Strategies

### Smart Tag Invalidation
```typescript
// Provide granular tags
getPosts: builder.query<Post[], PostsFilter>({
  query: (filter) => ({ url: 'posts', params: filter }),
  providesTags: (result, error, filter) =>
    result
      ? [
          ...result.map(({ id }) => ({ type: 'Post' as const, id })),
          { type: 'Post', id: 'LIST' },
          { type: 'Post', id: `LIST-${JSON.stringify(filter)}` },
        ]
      : [{ type: 'Post', id: 'LIST' }],
}),

// Invalidate specific tags
addPost: builder.mutation<Post, CreatePostRequest>({
  query: (newPost) => ({ url: 'posts', method: 'POST', body: newPost }),
  invalidatesTags: (result, error, newPost) => [
    { type: 'Post', id: 'LIST' },
    // Invalidate filtered lists that might include this post
    { type: 'Post', id: `LIST-${JSON.stringify({ category: newPost.category })}` },
  ],
}),
```

### Conditional Invalidation
```typescript
updatePost: builder.mutation<Post, { id: number; updates: Partial<Post> }>({
  query: ({ id, updates }) => ({
    url: `posts/${id}`,
    method: 'PATCH',
    body: updates,
  }),
  
  invalidatesTags: (result, error, { id, updates }) => {
    const tags = [{ type: 'Post' as const, id }]
    
    // Conditionally invalidate based on what was updated
    if (updates.published !== undefined) {
      tags.push({ type: 'Post', id: 'PUBLISHED_LIST' })
    }
    
    if (updates.category) {
      tags.push({ type: 'Post', id: `CATEGORY-${updates.category}` })
    }
    
    return tags
  },
}),
```

## Error Handling Patterns

### Comprehensive Error Handling
```typescript
const [addPost, { error, isError }] = useAddPostMutation()

const handleAddPost = async (postData: CreatePostRequest) => {
  try {
    await addPost(postData).unwrap()
    toast.success('Post created successfully!')
  } catch (err) {
    // Handle different error types
    if ('status' in err) {
      // RTK Query error
      if (err.status === 400) {
        toast.error('Invalid post data')
      } else if (err.status === 401) {
        toast.error('Please log in to create posts')
        router.push('/login')
      } else if (err.status === 403) {
        toast.error('You don\'t have permission to create posts')
      } else {
        toast.error('Server error occurred')
      }
    } else {
      // Network error
      toast.error('Network error - please check your connection')
    }
  }
}

// React to error state changes
useEffect(() => {
  if (isError && error) {
    if ('status' in error && error.status === 422) {
      // Handle validation errors
      const validationErrors = error.data as ValidationError[]
      setFormErrors(validationErrors)
    }
  }
}, [isError, error])
```

### Retry Logic
```typescript
const [addPost] = useAddPostMutation()

const handleAddPostWithRetry = async (postData: CreatePostRequest, maxRetries = 3) => {
  let attempt = 0
  
  while (attempt < maxRetries) {
    try {
      await addPost(postData).unwrap()
      return // Success
    } catch (error) {
      attempt++
      
      if (attempt >= maxRetries) {
        throw error // Final attempt failed
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}
```

## TypeScript Integration

### Fully Typed Mutations
```typescript
interface CreatePostRequest {
  title: string
  content: string
  authorId: number
  tags?: string[]
  published?: boolean
}

interface Post {
  id: number
  title: string
  content: string
  authorId: number
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

interface ApiError {
  message: string
  code: string
  details?: Record<string, string[]>
}

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    addPost: builder.mutation<Post, CreatePostRequest>({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'],
    }),
    
    updatePost: builder.mutation<Post, { id: number; updates: Partial<CreatePostRequest> }>({
      query: ({ id, updates }) => ({
        url: `posts/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),
  }),
})

// Hooks are automatically typed
const [addPost, { 
  data,        // Post | undefined
  error,       // FetchBaseQueryError | SerializedError | undefined
  isLoading,   // boolean
}] = useAddPostMutation()
```

## Performance Considerations

### Mutation Batching
```typescript
// Batch multiple mutations
const handleBulkOperations = async () => {
  const mutations = posts.map(post => 
    updatePost({ id: post.id, updates: { published: true } })
  )
  
  try {
    await Promise.all(mutations.map(mutation => mutation.unwrap()))
    toast.success('All posts published!')
  } catch (error) {
    toast.error('Some posts failed to update')
  }
}
```

### Selective Cache Updates
```typescript
// Update cache without invalidation for better performance
const handleLikePost = async (postId: number) => {
  // Optimistically update like count
  dispatch(api.util.updateQueryData('getPost', postId, (draft) => {
    draft.likes++
    draft.likedByUser = true
  }))
  
  try {
    await likePost(postId).unwrap()
  } catch {
    // Revert on error
    dispatch(api.util.updateQueryData('getPost', postId, (draft) => {
      draft.likes--
      draft.likedByUser = false
    }))
  }
}
```

## Best Practices

1. **Design cache invalidation strategy upfront** - Plan your tag structure
2. **Use optimistic updates judiciously** - Only for quick, likely-to-succeed operations
3. **Handle all error cases** - Network, validation, authorization, server errors
4. **Leverage TypeScript** - Define proper interfaces for requests and responses
5. **Test mutation flows** - Include success, error, and edge cases
6. **Monitor performance** - Watch for excessive re-renders and cache invalidations
7. **Use descriptive tag names** - Make cache invalidation patterns clear

This comprehensive guide covers all aspects of RTK Query mutations for building robust, performant applications with excellent user experience.

## Technical Features

### Cache Invalidation
- **`invalidatesTags: ['Post']`** - Automatically refetches posts after mutations
- **Automatic UI updates** - List refreshes without manual intervention
- **Optimistic updates** - UI updates immediately, rolls back on error

### Error Handling
- **`.unwrap()`** - Unwraps the promise to handle success/error
- **Try/catch blocks** - Proper error handling in components
- **Loading states** - `isLoading` from mutation hooks

### Network Behavior
- **Realistic delays** - 500ms delay from mocks server
- **Full CRUD operations** - Create, Read, Update, Delete
- **HTTP methods** - POST for create, DELETE for remove

## Code Structure

```
rtk-mutation/
├── MutationDemo.jsx          # Main component
└── README.md                 # This file
```

### Component Architecture
- **Self-contained store** - Each demo has its own Redux store
- **Provider wrapper** - Isolates state from other demos
- **Form handling** - Native FormData for mutations
- **Loading indicators** - Visual feedback during operations

## Learning Objectives

After exploring this demo, you should understand:

1. **How to define mutation endpoints** in RTK Query
2. **Cache invalidation strategies** for keeping data fresh
3. **Error handling patterns** for mutations
4. **Loading state management** during async operations
5. **Component integration** with mutation hooks

## API Endpoints Used

- **POST /posts** - Create new post (mutation)  
- **DELETE /posts/:id** - Delete post (mutation)

## Next Steps

- Explore the **RTK Query demo** for data fetching patterns
- Explore **Async Thunks demo** for alternative async handling
- Modify the mutation logic to add update functionality
- Experiment with different cache invalidation strategies