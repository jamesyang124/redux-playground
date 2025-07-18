import styled from 'styled-components'

export const Button = styled.button`
  background: #764abc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background: #5a3a94;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

export const DeleteButton = styled(Button)`
  background: #dc3545;
  
  &:hover {
    background: #c82333;
  }
`

export const SecondaryButton = styled(Button)`
  background: #6c757d;
  
  &:hover {
    background: #5a6268;
  }
`