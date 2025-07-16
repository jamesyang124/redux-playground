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
- Use Styled Components for styling
- Keep components small and focused

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

## Common Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check code quality