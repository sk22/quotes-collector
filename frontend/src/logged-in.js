import React from 'react'
import PostQuoteForm from './post-quote-form'

const LoggedIn = ({ onAddQuote, onLogout, username }) => {
  const handlePost = (text, author) => {
    onAddQuote(text, author, username)
  }

  return <>
    Logged in as {username} <button onClick={onLogout}>Logout</button><br /><br />
    <PostQuoteForm onPost={handlePost} />
  </>
}

export default LoggedIn
