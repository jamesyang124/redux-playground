import styled, { createGlobalStyle } from 'styled-components'

// Global font styles
export const GlobalFonts = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    background-color: #fafafa;
    color: #333;
    line-height: 1.6;
  }

  code {
    font-family: 'Roboto Mono', 'Fira Code', Consolas, 'Courier New', monospace;
  }
`

export const Text = styled.p`
  font-family: 'Roboto', sans-serif;
  font-weight: ${props => props.weight || 400};
  font-size: ${props => props.size || '1rem'};
  color: ${props => props.color || '#333'};
  margin: ${props => props.margin || '0 0 1rem 0'};
  line-height: ${props => props.lineHeight || '1.6'};
`

export const Heading = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-weight: ${props => props.weight || 500};
  font-size: ${props => {
    switch(props.level) {
      case 1: return '2.5rem'
      case 2: return '2rem' 
      case 3: return '1.5rem'
      case 4: return '1.25rem'
      case 5: return '1.125rem'
      case 6: return '1rem'
      default: return '2rem'
    }
  }};
  color: ${props => props.color || '#333'};
  margin: ${props => props.margin || '0 0 1rem 0'};
  line-height: 1.3;
`

export const Caption = styled.span`
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  color: ${props => props.color || '#666'};
  line-height: 1.4;
`

export const Code = styled.code`
  font-family: 'Roboto Mono', 'Fira Code', Consolas, 'Courier New', monospace;
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
`