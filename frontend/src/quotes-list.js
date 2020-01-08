import React, { useState, Fragment } from 'react'
import styled from 'styled-components'

import { Button } from './components/forms'

const QuoteStyle = styled.div`
  /* todo: style quotes */
  & blockquote {
    margin-top: 0;
    & p {
      margin-top: 0;
    }
  }

  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  border-radius: 0.5rem;
  border: var(--primary-border);
  padding: 1rem;
  margin: 1rem 0;
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
        <p>{q.q_text
          // line breaks don't have an effect in html
          .split('\n')
          // thus adding <br> elements after each line
          .map((line, i) => <Fragment key={i}>{line}<br /></Fragment>)
          }</p>
        <i>— {q.q_author}</i>
      </blockquote>
    </Flex>
    <small className="votes">
      {sum > 0 ? '+' : ''}{sum}
    </small>,{' '}
    <small className="user">posted by {q.u_username}</small>
    {showAdmin &&
      <>{' '}
        <Button onClick={() => onRemove(q.q_id)}>remove</Button>{' '}
        <Button onClick={() => onEdit(q)}>edit</Button>
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
  const hashSlice = window.location.hash.slice(1)
  const [sortBy, setSortBy] =
    useState(hashSlice in sortMethods ? hashSlice : 'latest')
  const defaultSortMethod = sortBy['latest']

  const onClickSortBy = by => {
    setSortBy(by)
    window.location.hash = `#${by}`
  }

  return <>
    <p>
      Sort by{' '}
      <Button
        active={sortBy === 'latest'}
        onClick={() => onClickSortBy('latest')}>latest</Button>{', '}
      <Button
        active={sortBy === 'votes'}
        onClick={() => onClickSortBy('votes')}>votes</Button>
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
            showAdmin={user && user.u_id === q.q_user /* only for the poster */}
            showVote={user !== null /* every user can vote on quotes */}
            quote={q} 
            currentVote={userVote /* used for the color and the api call */} />
        )
      })}
    </List>
    <i>{quotes.length} quotes</i>
  </>
}

export default QuotesList
