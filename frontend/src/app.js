import React, { useState, useEffect, createRef } from 'react';
import LoggedIn from './logged-in'
import QuotesList from './quotes-list'

/** Function that fetches the quote data from the backend */
async function fetchQuotes() {
  // Fetches the quotes from the backend
  const res = await fetch(`/api/quotes`)
  return await res.json()
}

/** Component that is shown to users that are not yet logged in */
const Login = ({ setUsername }) => {
  const inputRef = createRef()
  // Handles the form submit to log in the user
  const handleSubmit = e => {
    setUsername(inputRef.current.value)
    e.preventDefault()
  }
  return <form onSubmit={handleSubmit}>
    <input ref={inputRef} placeholder="Username..." />{' '}
    <input type="submit" />
  </form>
}

const App = () => {
  // State for the username
  const [username, setUsername] = useState('')
  // State for the quotes
  const [quotes, setQuotes] = useState([])
  const loggedIn = username.length > 0;

  useEffect(() => {
    // Run the async function
    fetchQuotes().then(setQuotes)
  }, [])

  const handleAddQuote = (text, author, user) => {
    setQuotes([{ id: quotes.length + 1, text, author, user, votes: 0 }, ...quotes])
  }

  const handleRemoveQuote = id => {
    // todo: api call
    setQuotes(quotes.filter(q => q.id !== id))
  }

  const handleLogout = () => {
    setUsername('')
  }

  return <>
    {loggedIn
      // depending on if the user is logged in,
      // show different components
      ? <LoggedIn username={username} onAddQuote={handleAddQuote} onLogout={handleLogout} />
      : <Login setUsername={setUsername} />}
    {/* In every case, the quotes list is shown */}
    <QuotesList onRemove={handleRemoveQuote} user={username} quotes={quotes} />
  </>
}

export default App;
