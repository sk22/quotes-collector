import React, { createRef, useState } from 'react'
import { Input, Button } from './components/forms'

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
      const m = passwordRef.current.value === passwordRepeatRef.current.value
      setMatches(m)
      if (!m) return
    }
    onLogin(usernameRef.current.value, passwordRef.current.value, register)
  }

  return <form>
    <Input ref={usernameRef} placeholder="Username..." />{' '}
    <Input type="password"ref={passwordRef} placeholder="Password..." />{' '}
    {register && <>
      <Input
        ref={passwordRepeatRef} type="password"
        placeholder="Repeat password..." />{' '}
    </>}
    <Button onClick={handleSubmit}>{register ? 'Register' : 'Login'}</Button>
    {register && !matches && <>
      <br />
      <span>Password does not match!</span>
    </>}
    {passwordWrong && <><br /><span>Wrong password!</span></>}
  </form>
}

export default Login
