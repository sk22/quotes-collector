import React, { createRef, useLayoutEffect, useState } from 'react'

const PostQuoteForm = ({ onPost }) => {
  const textRef = createRef()
  const authorRef = createRef()
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')

  /** Clears the form and moves the focus. Executed after hitting the submit button. */
  const clearForm = () => {
    textRef.current.value = ''
    // authorRef.current.value = ''
    // Not clearing the author because one might want to save mutlipel quotes by
    // one author. Pressing tab selects all text, so clearing the input has no benefit anyway.
    textRef.current.focus()
  }

  /** Handles the press of the submit button by passing the data to parent component */
  const handleSubmit = e => {
    e.preventDefault()
    onPost(textRef.current.value, authorRef.current.value)
    clearForm()
  }

  const set = (setter, ref) => () => {
    setter(ref.current.value)
  }

  useLayoutEffect(() => {
    textRef.current.focus()
  }, [textRef])

  const disabled = [text, author].some(t => t.trim().length === 0)
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={textRef} placeholder="Text"
        onChange={set(setText, textRef)} value={text} />{' '}
      <input type="text" ref={authorRef} placeholder="Author"
        onChange={set(setAuthor, authorRef)} value={author} />{' '}
      <input type="submit" disabled={disabled} />
    </form>
  )
}

export default PostQuoteForm