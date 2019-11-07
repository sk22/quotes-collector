import React, { useState, createRef } from 'react';
import Home from './home'

const Login = ({ setUsername }) => {
  const inputRef = createRef()
  const submit = () => setUsername(inputRef.current.value)
  return <form onSubmit={e => e.preventDefault()}>
    <input ref={inputRef} placeholder="Username..." />{' '}
    <input type="submit" onClick={submit} />
  </form>
}

const App = () => {
  const [username, setUsername] = useState('')
  const loggedIn = username.length > 0;
  return <>
    {loggedIn
      ? <Home username={username} />
      : <Login setUsername={setUsername} />}
  </>
}

export default App;
