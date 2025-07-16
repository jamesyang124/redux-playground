# RTK Query Demo - Claude Guidance

## Purpose
Demonstrate RTK Query for data fetching, caching, background updates, and cache management.

## Key Concepts to Show
- Query endpoints with RTK Query
- Automatic caching and background refetching
- Cache tags and invalidation
- Loading and error states
- Polling and conditional fetching

## Implementation Focus
- Use RTK Query's `createApi` and `fetchBaseQuery`
- Show query hooks (useQuery)
- Demonstrate cache behavior
- Include conditional queries
- Show polling/refetching

## Code Patterns
```javascript
// Query endpoint
getPosts: builder.query({
  query: () => '/posts',
  providesTags: ['Post'],
})

// Component usage
const { data: posts, isLoading, error, refetch } = useGetPostsQuery()
```

## Demo Should Include
- List of data with loading states
- Manual refetch button
- Conditional queries based on user input
- Error boundaries
- Cache inspection tools