import React, { createRef, useState, useEffect } from 'react'
import { Input, Button, TextArea } from './components/forms'
import styled from 'styled-components'

const PostQuoteFormStyle = styled.form`
  display: flex;
  align-items: stretch;
  > * + * {
    margin-left: 0.3rem;
  }

  & ${TextArea} {
    flex: 1;
    min-height: 3rem;
    height: 5rem;
  }
`

const VerticalFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & ${Input} {
    flex: 1;
    margin-bottom: 0.3rem;
  }
`

const PostQuoteForm = ({ onPost, editQuote }) => {
  const textRef = createRef()
  const authorRef = createRef()
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')

  // set text and author if a quote to edit is passed
  useEffect(() => {
    if (editQuote) {
      setText(editQuote.q_text)
      setAuthor(editQuote.q_author)
    }
  }, [editQuote])

  /** Clears the form and moves the focus. Executed after hitting the submit button. */
  const clearForm = () => {
    setText('')
    // setAuthor('')
    // Not clearing the author because one might want to save mutliple quotes by
    // one author. Pressing tab selects all text, so clearing the input has no benefit anyway.
    textRef.current.focus()
  }

  /** Handles the press of the submit button by passing the data to parent component */
  const handleSubmit = e => {
    e.preventDefault()
    if (editQuote) setAuthor('')
    onPost(textRef.current.value, authorRef.current.value)
    clearForm()
  }

  /** Utility to generalize the onChange event handlers for the input elements */
  const set = (setter, ref) => () => {
    setter(ref.current.value)
  }

  // todo: figure out how to do this probably.
  // should only focus the text input once when mounted
  // useLayoutEffect(() => {
  //   textRef.current.focus()
  // }, [textRef])

  /**
   * Variable that determines if the button should be disabled.
   * That is, if both inputs contain text.
   */
  const disabled = [text, author].some(t => t.trim().length === 0)
  
  return (
    <PostQuoteFormStyle onSubmit={handleSubmit}>
      <TextArea ref={textRef} placeholder="Text"
        onChange={set(setText, textRef)} value={text} />
      <VerticalFlex>
        <Input ref={authorRef} placeholder="Author"
          onChange={set(setAuthor, authorRef)} value={author} />
        <Button
          type="submit"
          disabled={disabled}>{
          /* input button value based on whether editing a quote or not */
          editQuote ? 'Edit' : 'Add'
        }</Button>
      </VerticalFlex>
    </PostQuoteFormStyle>
  )
}

export default PostQuoteForm