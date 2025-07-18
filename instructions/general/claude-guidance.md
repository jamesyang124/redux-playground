# General Claude Guidance

## Project Purpose
This is a Redux learning playground focused on demonstrating Redux Toolkit and Redux concepts through hands-on demos. Each demo is self-contained and teaches specific Redux patterns.

## Development Approach
- **Learn by building**: Each demo should be interactive and modifiable
- **Self-contained demos**: Each demo has its own store and components
- **Clear examples**: Prefer simple, focused examples over complex implementations
- **Educational focus**: Code should be readable and well-commented for learning

## Code Standards
- Use Redux Toolkit for all Redux code (no plain Redux)
- Prefer RTK Query for data fetching when applicable
- Use createSlice for state management
- Follow React hooks patterns (useSelector, useDispatch)
- Use shared UI components from `src/components/ui` instead of creating new styled components
- Keep components small and focused

## Shared UI Components
All styled components are centralized in `src/components/ui/`:
- **Layout**: Container, Title, Controls, Grid, Panel, Card
- **Buttons**: Button, DeleteButton, SecondaryButton  
- **Forms**: Form, Input, Select, Label
- **States**: LoadingState, ErrorState, SuccessState, InfoState
- **Lists**: ListContainer, ListItem, SelectableItem, ItemContent, ItemActions
- **Navigation**: Header, AppTitle, Subtitle, Nav, NavLink, AppContainer

Import from: `import { Button, Container, Title } from '../../components/ui'`

## Adding New Demos
1. Create folder in `src/demos/[concept-name]/`
2. Create corresponding instruction folder in `instructions/[concept-name]/`
3. Add route to App.jsx
4. Create self-contained store for the demo
5. Write clear README and Claude guidance

## Testing Approach
- Focus on demonstrating concepts over comprehensive testing
- Add tests when they help explain Redux patterns
- Use simple test cases that illustrate state changes

## Mocks Server Usage
- All demos use the local JSON Server at `http://localhost:3001`
- Import mocks utilities from `../../../mocks/server.js`
- Mocks data is in `mocks/db.json` (users, posts, todos)
- Server includes realistic delays and full CRUD operations
- Fallback to generated data if server unavailable

## Common Commands
- `npm run dev` - Start both mocks server and Vite dev server
- `npm run dev:client` - Start only Vite dev server  
- `npm run mock-server` - Start only mocks server
- `npm run build` - Build for production
- `npm run lint` - Check code quality