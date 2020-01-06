import styled, { css } from 'styled-components'

const Button = styled.button`
  --color: #277ae1;

  border: 0.15rem solid var(--color);
  background: transparent;
  font-weight: bold;
  text-transform: uppercase;

  ${props => props.active && css`
    background: var(--color);
    color: white;
  `}
`

export default Button
