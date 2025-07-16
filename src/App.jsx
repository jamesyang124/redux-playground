import { Routes, Route, Link } from 'react-router-dom'
import styled from 'styled-components'
import MutationDemo from './demos/rtk-mutation/MutationDemo'
import QueryDemo from './demos/rtk-query/QueryDemo'
import ThunkDemo from './demos/async-thunks/ThunkDemo'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  color: #764abc;
  margin-bottom: 1rem;
`

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`

const NavLink = styled(Link)`
  padding: 0.5rem 1rem;
  background: #764abc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #5a3a94;
  }
`

const Home = () => (
  <div>
    <h2>Welcome to Redux Playground</h2>
    <p>Select a demo above to explore different Redux and RTK concepts:</p>
    <ul>
      <li><strong>RTK Mutation:</strong> Learn how to handle data mutations with RTK Query</li>
      <li><strong>RTK Query:</strong> Explore data fetching and caching with RTK Query</li>
      <li><strong>Async Thunks:</strong> Understand asynchronous actions with createAsyncThunk</li>
    </ul>
  </div>
)

function App() {
  return (
    <Container>
      <Header>
        <Title>Redux Playground</Title>
        <Subtitle>Learn Redux & RTK by building</Subtitle>
      </Header>

      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/rtk-mutation">RTK Mutation</NavLink>
        <NavLink to="/rtk-query">RTK Query</NavLink>
        <NavLink to="/async-thunks">Async Thunks</NavLink>
      </Nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rtk-mutation" element={<MutationDemo />} />
        <Route path="/rtk-query" element={<QueryDemo />} />
        <Route path="/async-thunks" element={<ThunkDemo />} />
      </Routes>
    </Container>
  )
}

export default App