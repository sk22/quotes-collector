import React from 'react'
import styled from 'styled-components'

const QuoteStyle = styled.div`
  /* todo: style quotes */
`

const Quote = ({ id, votes, user, text, author, showRemove, onRemove }) =>
  <QuoteStyle>
    <blockquote>
      <p>{text}</p>
      <i>— {author}</i>
    </blockquote>
    <span className="votes">{votes}</span>,{' '}
    <span className="user">posted by {user}</span>
    {showRemove && <>{' '}<button onClick={() => onRemove(id)}>remove</button></>}
  </QuoteStyle>

const QuotesList = ({quotes, user, onRemove}) => (
  <ul>
    {quotes.map(quote => <Quote onRemove={onRemove} showRemove={user === quote.user} {...quote} />)}
  </ul>
)

export default QuotesList
