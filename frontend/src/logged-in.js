import React from 'react'
import PostQuoteForm from './post-quote-form'
import { Button } from './components/forms'

const LoggedIn = ({ onAddQuote, onLogout, user, editQuote }) => {
  const handlePost = (text, author) => {
    onAddQuote({ q_text: text, q_author: author, q_user: user.u_id })
  }

  return <>
    Logged in as {user.u_username}{' '}
    <Button onClick={onLogout}>Logout</Button><br /><br />
    <PostQuoteForm onPost={handlePost} editQuote={editQuote} />
  </>
}

export default LoggedIn
