const express = require('express')
const { readFileSync } = require('fs')

const { Database } = require('sqlite3').verbose()

const db = new Database('./data/quotes.db', err => {
  if (err) console.error(err)
})

const app = express()

const quotes = JSON.parse(readFileSync('./quotes.json'))

app.get('/api/quotes', (req, res) => {
  res.json(quotes)
})

app.listen(3001)
