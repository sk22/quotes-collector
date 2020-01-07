import styled, { css } from 'styled-components'

export const inputStyle = css`
  border: var(--primary-border);
  background: white;
  border-radius: 0.3rem;
  padding: 0.3rem 0.5rem;
`
  
export const Button = styled.button`
  ${inputStyle}
  font-weight: bold;
  text-transform: uppercase;
  ${props => props.active && css`
    background: var(--primary-color);
    color: white;
  `}

  transition: all 0.3s cubic-bezier(.25,.8,.25,1);

  &:hover {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }
`

export const TextArea = styled.textarea`
  ${inputStyle}
  font-family: inherit;
  font-size: inherit;
`

export const Input = styled.input`
  ${inputStyle}
`
