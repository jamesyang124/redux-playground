# Project Setup

## Prerequisites
- Node.js 18+ 
- npm or yarn

## Installation
```bash
npm install
```

## Development
```bash
npm run dev          # Start both mocks server and Vite dev server
npm run dev:client   # Start only Vite dev server
npm run mock-server  # Start only mocks server (port 3001)
```

## Build
```bash
npm run build
```

## Lint
```bash
npm run lint
```

## Mocks Server
The project includes a JSON Server mocks API running on port 3001:
- **Data**: `mocks/db.json` contains users, posts, and todos
- **Endpoints**: `/users`, `/posts`, `/todos`, `/posts?userId=1`, etc.
- **Features**: Realistic network delays, full CRUD operations
- **Utilities**: `mocks/server.js` provides helpers and configuration

## Tech Stack
- **Vite**: Build tool and dev server
- **React 18**: UI library
- **Redux Toolkit**: State management
- **React Redux**: React bindings for Redux
- **React Router**: Client-side routing
- **Styled Components**: CSS-in-JS styling

## Project Structure
- `src/demos/`: Individual Redux concept demonstrations
- `instructions/`: Claude guidance and documentation
- Each demo is self-contained with its own store and components