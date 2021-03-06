const express = require('express')
const { json } = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tables = require('./lib/tables')
const createApi = require('./lib/api')

const { Database } = require('sqlite3').verbose()
const app = express()
// use a json parser to handle the json post requests
app.use(json())

const createToken = id => jwt.sign({ id }, 'geheimnis oida', {
  expiresIn: '24h'
})

const createHttpError = (status, text) => {
  const error = new Error(text)
  error.status = status
  return error
}

const db = new Database('./data/quotes.db', err => {
  // output connection errors to the console
  if (err) console.error(err)
  
  // import the api functions
  const {
    selectAllFromTable,
    selectOneFromTable,
    selectFilteredFromTable,
    insertIntoTable,
    deleteFromTable,
    updateOneInTable,
    selectFullUserByUsername
  } = createApi(db)

  // the users table to be used by the authentication endpoints
  const usersTable = tables.find(t => t.name === 'users')

  /**
   * Returns a function that finishes the login by generating a token and
   * sending the username and token as the HTTP response. After that, it
   * updates the token in the database.
   */
  const makeLoginFinisher = (res, created) => ({ u_id, u_username }) => {
    const u_token = createToken(u_id)
    res.status(created ? 201 : 200)
      .send({ ok: true, data: { u_id, u_username, u_token } })
    updateOneInTable(usersTable, u_id, { u_token })
  }

  // register endpoint: creates a user and generates a token
  app.post('/api/register', (req, res, next) => {
    // request body has username and password
    const { username: u_username, password } = req.body
    // create the hashed password to be stored in the database (salt value: 8)
    const u_password = bcrypt.hashSync(password, 8)

    // save the user to the table
    insertIntoTable(usersTable, { u_username, u_password })
      // use the returned row's id and let the login finisher function
      // generate the token, return and save it
      .then(makeLoginFinisher(res, true))
      .catch(next)
  })

  // login endpoint: generates a token for an existing user
  app.post('/api/login', (req, res, next) => {
    // initialize generalized function that will return using the res object
    const finishLogin = makeLoginFinisher(res)
    // request body has username and password
    const { username, password } = req.body

    // select the user row based on the given username
    selectFullUserByUsername(username)
      .then(row => {
        // return 404 if no row has been found
        if (row === null) {
          throw createHttpError(404, 'Not Found')
        }
        // get the user data from the returned user row
        const { u_id, u_username, u_password } = row
        // compare the given password to the stored password hash
        const valid = bcrypt.compareSync(password, u_password);
        // return 401 (unauthorized) if the passwords do not match
        if (!valid) throw createHttpError(401, 'Unauthorized')
        // call the function that generates, returns and saves the token
        finishLogin({ u_id, u_username, u_password })
      })
      .catch(next)
  })

  const auth = (req, res, next) => {
    if (!req.headers['authorization']) {
      throw createHttpError(403, 'Forbidden')
    }
    const token = req.headers['authorization'].slice(7)
    // decoded jwt has user id
    const { id } = jwt.verify(token, 'geheimnis oida')
    req.auth = id
    next()
  }

  // for every table, generate the api endpoints
  tables.forEach(table => {
    // get endpoints for querying all rows in a table
    // also: get endpoints for querying filtered rows based on query values
    app.get(`/api/${table.name}`, (req, res, next) => {
      // detect if there are query values (?field=value)
      const withQuery = Object.entries(req.query).length > 0

      // determine the function to use based on if there are queries
      const func = withQuery ? selectFilteredFromTable : selectAllFromTable
      func(table, req.query)
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
    app.post(`/api/${table.name}`, auth, (req, res, next) => {
      insertIntoTable(table, { ...req.body, [table.auth]: req.auth })
        .then(row => res.status(201).send({ ok: true, data: row }))
        .catch(next)
    })

    // put endpoints for updating existing rows in a table
    app.put(`/api/${table.name}/:id`, (req, res, next) => {
      updateOneInTable(table, req.params.id, req.body)
        .then(row => res.send({ ok: true, data: row }))
        .catch(next)
    })

    // delete endpoints for deleting specific rows from a table
    app.delete(`/api/${table.name}/:id`, auth, (req, res, next) => {
      selectOneFromTable(table, req.params.id)
        .then(row => {
          if (!row) {
            // row is null -> 404
            throw createHttpError(404, 'Not Found')
          } else if (row[table.auth] !== req.auth) {
            // if the row's user does not match the authorized user,
            // return an error 401
            throw createHttpError(401, 'Unauthorized')
          } else {
            // else, delete the row
            deleteFromTable(table, req.params.id)
              .then(() => res.send({ ok: true }))
              .catch(next)
          }
        })
        .catch(next)
    })
  })

  // error handler to override the default html output
  app.use(function(err, req, res, next){
    console.error(err.stack || err);
    res.status(err.status || 500).send({ ok: false, error: err.message });
  })
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../frontend/build'))
    app.get('/', function(_, res) {
      res.sendFile('../frontend/build', 'index.html')
    })
  }

  const port = process.env.NODE_ENV === 'production'
    ? process.env.PORT || 3000 : 3001
  
  app.listen(port)
  console.log('listening on http://localhost:' + port)
})


