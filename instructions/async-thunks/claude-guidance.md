# Async Thunks Demo - Claude Guidance

## Purpose
Demonstrate createAsyncThunk for handling asynchronous actions with Redux Toolkit, including loading states and error handling.

## Key Concepts to Show
- createAsyncThunk syntax
- Pending/fulfilled/rejected states
- extraReducers in createSlice
- Thunk payloads and meta
- Error handling patterns

## Implementation Focus
- Use createAsyncThunk for async operations
- Show pending/fulfilled/rejected handling
- Demonstrate error and loading state management
- Include conditional thunk execution
- Show thunk chaining patterns

## Code Patterns
```javascript
// Async thunk
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.fetchUser(userId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice with extraReducers
extraReducers: (builder) => {
  builder
    .addCase(fetchUserById.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
    })
    .addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
}
```

## Demo Should Include
- Buttons to trigger async actions
- Loading indicators
- Error display
- Success/failure handling
- Sequential thunk execution