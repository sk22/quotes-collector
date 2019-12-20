import React from 'react'
import styled from 'styled-components'

const QuoteStyle = styled.div`
  /* todo: style quotes */
`

const Quote = ({ quote: q, showRemove, onRemove, onEdit }) =>
  <QuoteStyle>
    <blockquote>
      <p>{q.q_text}</p>
      <i>— {q.q_author}</i>
    </blockquote>
    <span className="votes">{q.q_votes}</span>,{' '}
    <span className="user">posted by {q.u_username}</span>
    {showRemove &&
      <>{' '}
        <button onClick={() => onRemove(q.q_id)}>remove</button>{' '}
        <button onClick={() => onEdit(q)}>edit</button>
      </>}
      
  </QuoteStyle>

const QuotesList = ({ quotes, user, onRemove, onEdit }) => (
  <ul>
    {quotes.sort((q1, q2) => q2.q_id - q1.q_id).map(q => (
      <Quote
        key={q.q_id}
        onRemove={onRemove}
        onEdit={onEdit}
        showRemove={user && user.u_id === q.q_user}
        showEdit={user && user.u_id === q.q_user}
        quote={q} />
    ))}
  </ul>
)

export default QuotesList
