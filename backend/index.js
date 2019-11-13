const express = require('express')
const { readFileSync } = require('fs')

const app = express()

const quotes = JSON.parse(readFileSync('./quotes.json'))

app.get('/api/quotes', (req, res) => {
  res.json(quotes)
})

app.listen(3001)
