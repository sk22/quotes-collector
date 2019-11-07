import React from 'react'

const PostQuoteForm = () => (
  <form onSubmit={e => e.preventDefault()}>
    <input type="text" />{' '}
    <input type="submit" />
  </form>
)

const Home = ({ username }) => {
  const handlePost = quote => {
    
  }

  return <>
    Logged in as {username}
    <PostQuoteForm onPost={handlePost} />
  </>
}

export default Home
