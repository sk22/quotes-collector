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
  // states for user and quotes and votes.
  // get changed by child components and/or the database
  const [user, setUser] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [votes, setVotes] = useState(null)

  // contains the quote that is currently being edited, if any
  const [editQuote, setEditQuote] = useState(null)

  // tells the login component whether a wrong password has been entered
  const [passwordWrong, setPasswordWrong] = useState(false)

  // tells the login component whether the account doen't exist and thus
  // has to be registered. also causes the handler to use another endpoint
  const [register, setRegister] = useState(false)

  const loggedIn = user !== null

  const handleLogin = async (username, password, register) => {
    // contact the login or register endpoint, sending it username and password
    const res = await fetch(`/api/${register ? 'register' : 'login'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    // reset the two states to their default states
    setPasswordWrong(false)
    setRegister(false)

    if (res.status === 401) {
      // password wrong
      setPasswordWrong(true)
    } else if (res.status === 404) {
      // user does not exist
      setRegister(true)
    } else {
      // user exists, password correct
      const data = (await res.json()).data
      // use the fetched data for the user state
      setUser(data)
    }
  }

  /**
   * Handles the click of a quote's "edit" button.
   * The state will be passed down into the post-quote-form editor.
   */
  const handleEdit = quote => {
    setEditQuote(quote)
  }

  // Used to initially load the data (quotes + votes)
  useEffect(() => {
    fetchQuotes().then(setQuotes)
    fetchVotes().then(setVotes)
  }, [])

  /**
   * Handles adding a quote. Depending on the context, an existing quote can
   * also be edited. 
   */
  const handleAddQuote = async q => {
    const res = await fetch(
      `/api/quotes${editQuote ? `/${editQuote.q_id}` : ''}`,
      {
        // using PUT instead of POST if the quote does already exist
        method: editQuote ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Using the user's token for authorizing
          'Authorization': `Bearer ${user.u_token}`
        },
        body: JSON.stringify(q)
      })

    const row = (await res.json()).data
    // add the received quote data to the local quotes state
    // (or replace the existing quote with the edited one)
    setQuotes([
      row,
      ...quotes.filter(q => editQuote ? q.q_id !== editQuote.q_id : true)
    ])
    setEditQuote(null)
  }

  /**
   * Handles the removal of a single quote, identified by its id.
   */
  const handleRemoveQuote = async id => {
    try { 
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.u_token}`
        }
      })
      if (res.ok) {
        setQuotes(quotes.filter(q => q.q_id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Logs out by nulling the local user state.
   */
  const handleLogout = () => {
    setUser(null)
  }

  /**
   * 
   * @param q_id Quote ID
   * @param value The clicked vote button's value, so either -1 or 1
   * @param voteRow The current row containing the user's vote on a quote
   */
  const handleVote = async (q_id, value, voteRow) => {
    try {
      // If the vote row exists and the desired value equals the current one,
      // the vote will be deleted. (In the UI, that is clicking an active
      // button to make it inactive.)
      const del = voteRow && value === voteRow.v_vote

      // Calling the endpoint, using either DELETE, PUT or POST
      const res = await fetch(`/api/votes/${voteRow ? voteRow.v_id : ''}`, {
        method: voteRow ? (del ? 'DELETE' : 'PUT') : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.u_token}`
        },
        body: JSON.stringify({
          v_quote: q_id,
          v_user: user.u_id,
          // the database saves the vote as either true (upvote) or
          // false (downvote)
          v_vote: value > 0 ? true : false
        })
      })

      if (del) {
        // if deleted, just filter the deleted row out
        setVotes(votes.filter(v => v.v_id !== voteRow.v_id))
      } else {
        // else, add it to the array (and filter out the vote with the same id)
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
