import React, { useState } from 'react'
import styled from 'styled-components'

import Button from './components/button'

const QuoteStyle = styled.div`
  /* todo: style quotes */
  & blockquote {
    margin-top: 0;
    & p {
      margin-top: 0;
    }
  }
  
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  padding: 1rem;
  margin: 1rem;
  `
  
const List = styled.ul`
  padding: 0;
`

const VoteButtons = styled.div`
  display: inline-flex;
  flex-direction: column;
  & > * + * {
    margin-top: 0.3rem;
  }
`

const Flex = styled.div`
  display: flex;
`

const voteSumReducer = (acc, v) => acc + v.v_vote

const Quote = ({
  quote: q,
  showAdmin,
  showVote,
  currentVote,
  onUpvote,
  onDownvote,
  onRemove,
  onEdit
}) => {
  const sum = q.votes.reduce(voteSumReducer, 0)

  return <QuoteStyle>
    <Flex>
      {showVote &&
        <VoteButtons>
          <Button
            active={currentVote && currentVote.v_vote > 0}
            onClick={() => onUpvote(currentVote)}>+</Button>{' '}
          <Button
            active={currentVote && currentVote.v_vote < 0}
            onClick={() => onDownvote(currentVote)}>–</Button>{' '}
        </VoteButtons>}
      <blockquote>
        <p>{q.q_text.split('\n').map(line => <>{line}<br /></>)}</p>
        <i>— {q.q_author}</i>
      </blockquote>
    </Flex>
    <small className="votes">
      {sum > 0 ? '+' : ''}{sum}
    </small>,{' '}
    <small className="user">posted by {q.u_username}</small>
    {showAdmin &&
      <>{' '}
        <button onClick={() => onRemove(q.q_id)}>remove</button>{' '}
        <button onClick={() => onEdit(q)}>edit</button>
      </>}
  </QuoteStyle>
}

const sortMethods = {
  latest: (q1, q2) => q2.q_id - q1.q_id,
  votes: (q1, q2) => {
    const [c1, c2] = [q1, q2].map(q => q.votes.reduce(voteSumReducer, 0))
    return c2 - c1
  }
}

const QuotesList = ({ quotes, user, onRemove, onEdit, onVote }) => {
  const [sortBy, setSortBy] =
    useState(window.location.hash.slice(1) || 'latest')
  const defaultSortMethod = sortBy['latest']

  const onClickSortBy = by => {
    setSortBy(by)
    window.location.hash = `#${by}`
  }

  return <>
    <p>
      Sort by{' '}
      <button onClick={() => onClickSortBy('latest')}>latest</button>{', '}
      <button onClick={() => onClickSortBy('votes')}>votes</button>
    </p>
    <List>
      {quotes.sort(sortMethods[sortBy] || defaultSortMethod).map(q => {
        const userVote = user ? q.votes.find(v => v.v_user === user.u_id) : null
        return (
          <Quote
            key={q.q_id}
            onRemove={onRemove}
            onEdit={onEdit}
            onUpvote={id => onVote(q.q_id, +1, id)}
            onDownvote={id => onVote(q.q_id, -1, id)}
            showAdmin={user && user.u_id === q.q_user}
            showVote={user !== null}
            quote={q} 
            currentVote={userVote} />
        )
      })}
    </List>
  </>
}

export default QuotesList
