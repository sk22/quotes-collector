import React, { useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [editQuote, setEditQuote] = useState(null)
  const loggedIn = user !== null;

  const handleSetUsername = async username => {
    const res = await fetch(`/api/users/?u_username=${username}`)
    const data = (await res.json()).data
    if (data.length > 0) {
      setUser(data[0])
    } else {
      const res = await fetch(`/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ u_username: username })
      })
      const data = (await res.json()).data
      setUser(data)
    }
  }

  const handleEdit = quote => {
    setEditQuote(quote)
  }

  useEffect(() => {
    // Run the async function
    fetchQuotes().then(setQuotes)
  }, [])

  const handleAddQuote = async (q) => {
    const res = await fetch(
      `/api/quotes${editQuote ? `/${editQuote.q_id}` : ''}`,
      {
        method: editQuote ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(q)
      })

    const row = (await res.json()).data
    setQuotes([
      row,
      ...quotes.filter(q => editQuote ? q.q_id !== editQuote.q_id : true)
    ])
    setEditQuote(null)
  }

  const handleRemoveQuote = async id => {
    // todo: api call
    try {
      await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
      setQuotes(quotes.filter(q => q.q_id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = () => {
    setUser(null)
  }

  return <>
    {loggedIn
      // depending on if the user is logged in,
      // show different components
      ? <LoggedIn
          user={user}
          onAddQuote={handleAddQuote}
          onLogout={handleLogout}
          editQuote={editQuote} />
      : <Login setUsername={handleSetUsername} />}
    {/* In every case, the quotes list is shown */}
    <QuotesList
      onRemove={handleRemoveQuote}
      onEdit={handleEdit}
      user={user}
      quotes={quotes} />
  </>
}

export default App;
