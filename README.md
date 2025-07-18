# Redux Playground

Learn Redux & RTK by building interactive demos.

## Quick Start

```bash
npm install
npm run dev
```

- **Vite dev server**: http://localhost:3000
- **Mocks API server**: http://localhost:3001

## Demos

Each demo includes detailed technical documentation:

- **[RTK Mutation](src/demos/rtk-mutation/README.md)**: Create, update, delete with RTK Query
  - Mutation endpoints, cache invalidation, optimistic updates
- **[RTK Query](src/demos/rtk-query/README.md)**: Data fetching, caching, background updates  
  - Automatic caching, conditional queries, loading states
- **[Async Thunks](src/demos/async-thunks/README.md)**: Async actions with createAsyncThunk
  - Thunk lifecycle, error handling, sequential operations

## Development

```bash
npm run dev          # Start both servers
npm run dev:client   # Vite only
npm run mock-server  # Mocks API only
npm run type-check   # TypeScript type checking
npm run lint         # ESLint with TypeScript support
```

## Tech Stack

- **TypeScript** - Type safety and better developer experience
- **React 18** - UI library with TypeScript support
- **Redux Toolkit** - Fully typed state management
- **Vite** - Fast build tool with TypeScript support
- **Roboto Font** - Clean, modern typography
