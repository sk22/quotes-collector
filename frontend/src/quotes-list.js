import React from 'react'
import styled from 'styled-components'

const QuoteStyle = styled.div`
  /* todo: style quotes */
`

const Quote = ({ quote: q, showRemove, onRemove }) =>
  <QuoteStyle>
    <blockquote>
      <p>{q.q_text}</p>
      <i>— {q.q_author}</i>
    </blockquote>
    <span className="votes">{q.q_votes}</span>,{' '}
    <span className="user">posted by {q.u_username}</span>
    {showRemove &&
      <>{' '}<button onClick={() => onRemove(q.q_id)}>remove</button></>}
  </QuoteStyle>

const QuotesList = ({quotes, user, onRemove}) => (
  <ul>
    {quotes.map(q => (
      <Quote onRemove={onRemove} showRemove={user === q.u_username} quote={q} />
    ))}
  </ul>
)

export default QuotesList
