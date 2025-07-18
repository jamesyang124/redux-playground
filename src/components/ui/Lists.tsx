import styled from 'styled-components'

export const ListContainer = styled.div`
  max-height: ${props => props.maxHeight || '400px'};
  overflow-y: auto;
`

export const ListItem = styled.div`
  padding: 1rem;
  border: 1px solid #eee;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

export const SelectableItem = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
  
  ${props => props.selected && `
    background: #e3f2fd;
    border-left: 3px solid #764abc;
  `}
`

export const ItemContent = styled.div`
  flex: 1;
`

export const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`