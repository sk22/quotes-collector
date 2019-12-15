const express = require('express')

const { Database } = require('sqlite3').verbose()
const app = express()

const selectAllFromTable = (table, links) => new Promise((resolve, reject) => {
  db.all(`SELECT * FROM ${table}${links
      ? ` INNER JOIN ${links.join(', ')}` : ''};`, (err, rows) => {
    if (err) {
      reject(err)
    } else {
      resolve(rows)
    }
  })
})

const db = new Database('./data/quotes.db', err => {
  if (err) console.error(err)

  const tables = [
    { name: 'quotes',
      fields: ['q_id', 'q_text', 'q_user', 'q_author', 'q_votes' ],
      links: ['users on q_user = u_id'] },
    { name: 'users', fields: ['u_id', 'u_username' ]},
    { name: 'votes',
      fields: ['v_quote', 'v_user', 'v_vote' ],
      links: ['users on v_user = u_id', 'quotes on v_quote = q_id'] }
  ]

  tables.forEach(table => {
    app.get(`/api/${table.name}`, (_, res, next) => {
      rows = selectAllFromTable(table.name, table.links)
        .then(rows => res.send(rows))
        .catch(next)
    })
  })
    
  app.listen(3001)
  console.log('listening on http://localhost:3001')
})


