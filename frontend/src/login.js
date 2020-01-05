import React, { createRef, useState } from 'react'

/** Component that is shown to users that are not yet logged in */
const Login = ({ onLogin, register, passwordWrong }) => {
  const usernameRef = createRef()
  const passwordRef = createRef()
  const passwordRepeatRef = createRef()
  const [matches, setMatches] = useState(true)

  // Handles the form submit to log in the user
  const handleSubmit = e => {
    e.preventDefault()
    // only check if password matches if used to register
    if (register) {
      setMatches(passwordRef.current.value === passwordRepeatRef.current.value)
      if (!matches) return
    }
    onLogin(usernameRef.current.value, passwordRef.current.value, register)
  }

  return <form onSubmit={handleSubmit}>
    <input ref={usernameRef} placeholder="Username..." />{' '}
    <input ref={passwordRef} placeholder="Password..." />{' '}
    {register && <>
      <input
        ref={passwordRepeatRef}
        placeholder="Repeat password..." />{' '}
    </>}
    <input type="submit" value={register ? 'Register' : 'Login'} />
    {register && !matches && <>
      <br />
      <span>Password does not match!</span>
    </>}
    {passwordWrong && <><br /><span>Wrong password!</span></>}
  </form>
}

export default Login
