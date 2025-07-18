import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
`

export const Title = styled.h2`
  color: #764abc;
  margin-bottom: 1rem;
`

export const Controls = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 2rem;
`

export const Panel = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
`

export const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`