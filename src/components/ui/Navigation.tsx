import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`

export const AppTitle = styled.h1`
  color: #764abc;
  margin-bottom: 1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 2.5rem;
`

export const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
`

export const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`

export const NavLink = styled(Link)`
  padding: 0.5rem 1rem;
  background: #764abc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;

  &:hover {
    background: #5a3a94;
  }
`

export const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`