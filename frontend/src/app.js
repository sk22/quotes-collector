import React, { useState, useEffect, createRef } from 'react';
import LoggedIn from './logged-in'
import Login from './login'
import QuotesList from './quotes-list'

/** Function that fetches the quote data from the backend */
async function fetchQuotes() {
  // Fetches the quotes from the backend
  const res = await fetch(`/api/quotes`)
  return (await res.json()).data
}

/** Root component that gets rendered onto the page */
const App = () => {
  // States for username and quotes.
  // Get changed by child components and/or the database
  const [username, setUsername] = useState('')
  const [quotes, setQuotes] = useState([])
  const loggedIn = username.length > 0;

  useEffect(() => {
    // Run the async function
    fetchQuotes().then(setQuotes)
  }, [])

  const handleAddQuote = (q_text, q_author, q_user) => {
    setQuotes([{ id: quotes.length + 1, q_text, q_author, q_user, q_votes: 0 }, ...quotes])
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
