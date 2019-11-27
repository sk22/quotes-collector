import React, { createRef } from 'react'

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

export default Login
