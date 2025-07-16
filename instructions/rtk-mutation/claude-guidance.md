# RTK Mutation Demo - Claude Guidance

## Purpose
Demonstrate RTK Query mutations for creating, updating, and deleting data with optimistic updates and cache management.

## Key Concepts to Show
- Mutation endpoints with RTK Query
- Optimistic updates
- Cache invalidation
- Error handling
- Loading states

## Implementation Focus
- Use RTK Query's `createApi` and `fetchBaseQuery`
- Show mutation hooks (useMutation)
- Demonstrate cache tag invalidation
- Include optimistic update examples
- Handle success/error states

## Code Patterns
```javascript
// Mutation endpoint
addPost: builder.mutation({
  query: (newPost) => ({
    url: '/posts',
    method: 'POST',
    body: newPost,
  }),
  invalidatesTags: ['Post'],
})

// Component usage
const [addPost, { isLoading, error }] = useAddPostMutation()
```

## Demo Should Include
- Form for creating/updating data
- Delete functionality
- Loading indicators
- Error display
- Optimistic UI updates