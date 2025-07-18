# RTK Query Demo - Comprehensive Guide

## Overview
This demo demonstrates **RTK Query**, Redux Toolkit's powerful data fetching and caching solution. RTK Query eliminates the need to write data fetching logic by hand and provides automatic caching, background updates, and optimistic UI patterns.

## Core Features of RTK Query

### What RTK Query Provides
- ✅ **Automatic caching** with intelligent cache management
- ✅ **Request deduplication** - multiple components share same requests
- ✅ **Background refetching** - keeps data fresh automatically
- ✅ **Loading state management** - built-in loading/error states
- ✅ **Cache invalidation** - smart cache updates on mutations
- ✅ **TypeScript support** - fully typed with excellent inference
- ✅ **DevTools integration** - debug cache state and network requests

## Basic Setup

### 1. Create API Slice
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
  reducerPath: 'api',              // Slice name in store
  baseQuery: fetchBaseQuery({      // Base configuration
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth tokens, content-type, etc.
      headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['User', 'Post'],      // Cache invalidation tags
  endpoints: (builder) => ({       // Define endpoints
    // Queries and mutations go here
  })
})
```

### 2. Configure Store
```typescript
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

// Enable background refetching, polling, etc.
setupListeners(store.dispatch)
```

## Query Endpoints - All Usage Patterns

### Basic Queries
```typescript
// Simple GET request
getUsers: builder.query<User[], void>({
  query: () => 'users',
  providesTags: ['User'],
}),

// Parameterized query
getUser: builder.query<User, number>({
  query: (id) => `users/${id}`,
  providesTags: (result, error, id) => [{ type: 'User', id }],
}),

// Complex query with options
searchUsers: builder.query<User[], { name: string; limit: number }>({
  query: ({ name, limit }) => ({
    url: 'users/search',
    params: { q: name, limit },
  }),
}),
```

### Advanced Query Configuration
```typescript
getPosts: builder.query<Post[], void>({
  query: () => 'posts',
  
  // Transform response data
  transformResponse: (response: ApiResponse<Post[]>) => response.data,
  
  // Transform error response
  transformErrorResponse: (response: FetchBaseQueryError) => response.data,
  
  // Provide cache tags for invalidation
  providesTags: (result) =>
    result
      ? [
          ...result.map(({ id }) => ({ type: 'Post' as const, id })),
          { type: 'Post', id: 'LIST' },
        ]
      : [{ type: 'Post', id: 'LIST' }],
  
  // Keep unused data in cache
  keepUnusedDataFor: 60, // seconds
  
  // Override global settings
  serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
    return `${endpointName}(${JSON.stringify(queryArgs)})`
  },
})
```

## Using Query Hooks - All Options

### Basic Hook Usage
```typescript
const {
  data,           // Transformed response data
  error,          // Error object if request failed
  isLoading,      // True on first request
  isFetching,     // True during any request
  isSuccess,      // True when data exists
  isError,        // True when error exists
  refetch,        // Function to manually refetch
} = useGetUsersQuery()
```

### Hook Options
```typescript
const result = useGetUsersQuery(undefined, {
  // Polling - refetch every N milliseconds
  pollingInterval: 3000,
  
  // Skip this query
  skip: !isAuthenticated,
  
  // Refetch on mount or arg change
  refetchOnMountOrArgChange: true,
  
  // Refetch on window focus
  refetchOnFocus: true,
  
  // Refetch on network reconnect
  refetchOnReconnect: true,
  
  // Select subset of data
  selectFromResult: ({ data, ...other }) => ({
    ...other,
    userCount: data?.length ?? 0,
  }),
  
  // Subscribe to cache updates
  subscribe: true,
})
```

### Conditional Queries
```typescript
// Skip query when condition not met
const { data: user } = useGetUserQuery(userId, {
  skip: !userId, // Don't fetch if no userId
})

// Lazy queries - trigger manually
const [trigger, result] = useLazyGetUserQuery()

const handleClick = () => {
  trigger(userId) // Manually trigger the query
}
```


## Cache Management

### Cache Tags Strategy
```typescript
// Define tag types
tagTypes: ['User', 'Post', 'Comment'],

// Provide tags (what this endpoint contributes to cache)
getUsers: builder.query({
  query: () => 'users',
  providesTags: (result) =>
    result
      ? [
          ...result.map(({ id }) => ({ type: 'User', id })),
          { type: 'User', id: 'LIST' },
        ]
      : [{ type: 'User', id: 'LIST' }],
}),

```

### Manual Cache Updates
```typescript
// Update specific cache entry
dispatch(api.util.updateQueryData('getUsers', undefined, (draft) => {
  draft.push(newUser)
}))

// Invalidate and refetch
dispatch(api.util.invalidateTags(['User']))

// Prefetch data
dispatch(api.util.prefetch('getUser', userId, { force: true }))
```

## Advanced Patterns

### Custom Base Query
```typescript
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  
  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
    
    if (refreshResult.data) {
      // Store the new token
      api.dispatch(tokenReceived(refreshResult.data))
      // Retry the initial query
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(loggedOut())
    }
  }
  
  return result
}
```

### Code Splitting
```typescript
// Define base API
const baseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: () => ({}),
})

// Inject endpoints in different files
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
    }),
  }),
})

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
    }),
  }),
})
```

## TypeScript Integration

### Fully Typed API
```typescript
interface User {
  id: number
  name: string
  email: string
}

interface CreateUserRequest {
  name: string
  email: string
}

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
    }),
  }),
})

// Hooks are automatically typed
const { data: users } = useGetUsersQuery() // data is User[] | undefined
```

## Performance Optimizations

### Selective Subscriptions
```typescript
const { userCount } = useGetUsersQuery(undefined, {
  selectFromResult: ({ data }) => ({
    userCount: data?.length ?? 0,
  }),
})
```

### Background Sync
```typescript
// Enable automatic background sync
import { setupListeners } from '@reduxjs/toolkit/query'

setupListeners(store.dispatch, {
  onFocus: refetchOnFocus,
  onReconnect: refetchOnReconnect,
  onOnline: refetchOnOnline,
})
```

## Debugging and DevTools

### RTK Query DevTools
- **Network tab**: See all RTK Query requests
- **State inspection**: View cache contents
- **Time-travel debugging**: Replay cache changes
- **Performance monitoring**: Track cache hits/misses

### Debug Configuration
```typescript
const api = createApi({
  // ... other config
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  
  // Add tags for better debugging
  tagTypes: ['User', 'Post', 'Comment'],
})
```

## Best Practices

1. **Use cache tags effectively** - Design invalidation strategy upfront
2. **Transform responses** - Keep cache data normalized
3. **Handle errors gracefully** - Provide fallbacks and retry logic
4. **Optimize subscriptions** - Use `selectFromResult` to prevent unnecessary re-renders
5. **Code splitting** - Inject endpoints to reduce bundle size
6. **Type everything** - Leverage TypeScript for better DX

## Migration from Other Solutions

### From React Query
- Similar concepts but tighter Redux integration
- Cache is part of Redux store
- Built-in optimistic updates

### From Apollo Client
- HTTP-focused instead of GraphQL
- More explicit cache management
- Better TypeScript experience

## Bundle Size Impact
- **With existing RTK**: ~9kb for RTK Query
- **Without RTK**: ~17-19kb total
- **Per endpoint**: Minimal overhead

This comprehensive guide covers all major RTK Query patterns and usage scenarios for building robust data fetching solutions.

## Technical Features

### Automatic Caching
- **Smart caching** - Queries are cached automatically by endpoint + parameters
- **Background refetching** - Data updates in background when cache expires
- **Shared cache** - Multiple components using same query share cached data
- **Cache tags** - `providesTags` enables targeted cache invalidation

### Conditional Queries
- **`skip` option** - Prevents query execution when conditions aren't met
- **Dependent queries** - User posts only fetch when user is selected
- **Performance optimization** - Avoids unnecessary network requests

### Loading States
- **Per-query loading** - Each query has its own loading state
- **Parallel loading** - Multiple queries can load simultaneously
- **Granular control** - Individual loading states for different UI sections

### Error Handling
- **Query-specific errors** - Each query maintains its own error state
- **Error boundaries** - Graceful error display in UI
- **Retry logic** - Automatic retry on network failures

## Code Structure

```
rtk-query/
├── QueryDemo.jsx             # Main component
└── README.md                 # This file
```

### Component Architecture
- **Master-detail pattern** - User list + selected user details
- **Conditional rendering** - UI adapts based on selection state
- **Grid layout** - Side-by-side panels for better UX
- **Selectable items** - Click to select user and load details

## Learning Objectives

After exploring this demo, you should understand:

1. **Query endpoint definition** and configuration
2. **Automatic caching behavior** and cache management
3. **Conditional query execution** with the `skip` option
4. **Loading state handling** for multiple simultaneous queries
5. **Error handling patterns** for query failures
6. **Manual refetching** and cache control

## API Endpoints Used

- **GET /users** - Fetch all users
- **GET /users/:id** - Fetch specific user details
- **GET /posts?userId=:id** - Fetch posts by user ID

## Cache Behavior

### Cache Keys
- `/users` - All users list
- `/users/1` - User with ID 1  
- `/posts?userId=1` - Posts for user 1

### Cache Invalidation
- **Manual refetch** - "Refresh Users" button
- **Time-based** - Cache expires based on RTK Query defaults
- **Tag-based** - Cache updates based on tags

## Performance Features

### Network Optimization
- **Request deduplication** - Multiple components requesting same data share one request
- **Background updates** - Data refreshes without blocking UI
- **Efficient re-renders** - Only components using changed data re-render

### Memory Management
- **Automatic cleanup** - Unused cache entries are garbage collected
- **Subscription model** - Cache entries stay alive while components are subscribed

## Next Steps

- Try the **RTK Mutation demo** to see data modification patterns
- Explore **Async Thunks demo** for alternative async patterns
- Experiment with polling by adding `pollingInterval` option
- Try implementing search/filtering on the user list
- Add pagination for large datasets