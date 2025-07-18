import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

export const DemoCard = styled(Link)`
  display: block;
  padding: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  background: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(118, 74, 188, 0.15);
    border-color: #764abc;
  }
`

export const DemoTitle = styled.h3`
  color: #764abc;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
`

export const DemoDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
`

export const DemoFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const DemoFeature = styled.li`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1rem;
  
  &:before {
    content: '•';
    color: #764abc;
    position: absolute;
    left: 0;
  }
`

export const DemoStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 1rem;
  
  ${props => props.status === 'ready' && `
    background: #d4edda;
    color: #155724;
  `}
  
  ${props => props.status === 'beta' && `
    background: #d1ecf1;
    color: #0c5460;
  `}
  
  ${props => props.status === 'coming-soon' && `
    background: #f8d7da;
    color: #721c24;
  `}
`