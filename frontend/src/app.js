import React, { useState, useEffect } from 'react';
import LoggedIn from './logged-in'
import Login from './login'
import QuotesList from './quotes-list'
import Divider from './components/divider'
import Container from './components/container'

/** Function that fetches the quote data from the backend */
async function fetchQuotes() {
  // Fetches the quotes from the backend
  const res = await fetch(`/api/quotes`)
  return (await res.json()).data
}

async function fetchVotes() {
  const res = await fetch(`/api/votes/`)
  return (await res.json()).data
}

/** Root component that gets rendered onto the page */
const App = () => {
  // States for username and quotes.
  // Get changed by child components and/or the database
  const [user, setUser] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [votes, setVotes] = useState(null)
  const [editQuote, setEditQuote] = useState(null)
  const [passwordWrong, setPasswordWrong] = useState(false)
  const [register, setRegister] = useState(false)
  const loggedIn = user !== null;

  const handleLogin = async (username, password, register) => {
    setPasswordWrong(false)
    setRegister(false)
    const res = await fetch(`/api/${register ? 'register' : 'login'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.status === 401) {
      // password wrong
      setPasswordWrong(true)
    } else if (res.status === 404) {
      // user does not exist
      setRegister(true)
    } else {
      const data = (await res.json()).data
      console.log(data)
      setUser(data)
      fetchVotes().then(setVotes)
    }
  }

  const handleEdit = quote => {
    setEditQuote(quote)
  }

  useEffect(() => {
    // Run the async function
    fetchQuotes().then(setQuotes)
    fetchVotes().then(setVotes)
  }, [])

  const handleAddQuote = async (q) => {
    const res = await fetch(
      `/api/quotes${editQuote ? `/${editQuote.q_id}` : ''}`,
      {
        method: editQuote ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.u_token}`
        },
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

  const handleVote = async (q_id, value, voteRow) => {
    try {
      const del = voteRow && value === voteRow.v_vote
      const res = await fetch(`/api/votes/${voteRow ? voteRow.v_id : ''}`, {
        method: voteRow ? (del ? 'DELETE' : 'PUT') : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.u_token}`
        },
        body: JSON.stringify({
          v_quote: q_id,
          v_user: user.u_id,
          v_vote: value > 0 ? true : false
        })
      })

      if (del) {
        setVotes(votes.filter(v => v.v_id !== voteRow.v_id))
      } else {
        const data = (await res.json()).data
        setVotes([...votes.filter(v => v.v_id !== data.v_id), data])
      }
    } catch (e) {
      console.error(e)
    }
  }

  return <Container>
    {loggedIn
      // depending on if the user is logged in,
      // show different components
      ? <LoggedIn
          user={user}
          onAddQuote={handleAddQuote}
          onLogout={handleLogout}
          editQuote={editQuote} />
      : <Login
          onLogin={handleLogin}
          passwordWrong={passwordWrong}
          register={register} />}
    {/* In every case, the quotes list is shown */}
    <Divider />
    <QuotesList
      onRemove={handleRemoveQuote}
      onEdit={handleEdit}
      user={user}
      onVote={handleVote}
      quotes={quotes.map(q => ({
        votes: votes
          ? votes.filter(v => v.v_quote === q.q_id).map(({ v_vote, ...v }) =>
              ({ v_vote: v_vote === 0 ? -1 : 1, ...v }))
          : [],
        ...q
      }))}
    />
  </Container>
}

export default App;
