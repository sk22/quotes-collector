const express = require('express')
const { json } = require('body-parser')
const tables = require('./lib/tables')
const createApi = require('./lib/api')

const { Database } = require('sqlite3').verbose()
const app = express()
// use a json parser to handle the json post requests
app.use(json())

const db = new Database('./data/quotes.db', err => {
  // output connection errors to the console
  if (err) console.error(err)
  
  const {
    selectAllFromTable,
    selectOneFromTable,
    insertIntoTable,
    deleteFromTable,
    updateOneInTable
  } = createApi(db)

  // for every table, generate the api endpoints
  tables.forEach(table => {
    // get endpoints for querying all rows in a table
    app.get(`/api/${table.name}`, (req, res, next) => {
      selectAllFromTable(table)
        .then(rows => res.send({ ok: true, data: rows }))
        .catch(next)
    })

    // get endpoints for querying specific rows of a table
    app.get(`/api/${table.name}/:id`, (req, res, next) => {
      selectOneFromTable(table, req.params.id)
        .then(row => {
          if (!row) res.status(404)
          res.send({ ok: true, data: row })
        })
        .catch(next)
    })

    // post endpoints for creating new rows in a table
    app.post(`/api/${table.name}`, (req, res, next) => {
      insertIntoTable(table, req.body)
        .then(() => res.status(201).send({ ok: true }))
        .catch(next)
    })

    // put endpoints for updating existing rows in a table
    app.put(`/api/${table.name}/:id`, (req, res, next) => {
      updateOneInTable(table, req.params.id, req.body)
        .then(() => res.send({ ok: true }))
        .catch(next)
    })

    // delete endpoints for deleting specific rows from a table
    app.delete(`/api/${table.name}/:id`, (req, res, next) => {
      deleteFromTable(table, req.params.id)
        .then(() => res.send({ ok: true }))
        .catch(next)
    })
  })

  // error handler to override the default html output
  app.use(function(err, req, res, next){
    console.error(err.stack || err);
    res.status(err.status || 500).send({ ok: false, error: err.message });
  })
  
    
  app.listen(3001)
  console.log('listening on http://localhost:3001')
})


