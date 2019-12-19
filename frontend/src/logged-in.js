import React from 'react'
import PostQuoteForm from './post-quote-form'

const LoggedIn = ({ onAddQuote, onLogout, user }) => {
  const handlePost = (text, author) => {
    onAddQuote({ q_text: text, q_author: author, q_user: user.u_id })
  }

  return <>
    Logged in as {user.u_username}{' '}
    <button onClick={onLogout}>Logout</button><br /><br />
    <PostQuoteForm onPost={handlePost} />
  </>
}

export default LoggedIn
