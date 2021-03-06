/**
 * Helper method to create the SQL code for the inner joins.
 */
const formulateLinks = links => links ? Object.keys(links)
  .flatMap(type => ` ${type} join ` + links[type].join(', ')).join(' ')
  : ''

const formulatePublicFields = table => (table.public || table.fields).join(', ')

/**
 * Filter given fields to only return fields that are part of the table.
 */
const filterInputFields = (table, values, keepKey) =>
  Object.keys(values)
    // only keep the fields that are defined by the table
    .filter(f => table.fields.includes(f))
    .filter(f => !table.hidden || !table.hidden.includes(f))
    // if the keepKey argument is set, keep the field.
    // otherwise, only keep the field if it is not the key.
    .filter(f => keepKey || f !== table.key)

const makeGetCallback = (db, table, resolve, reject, key) => function(err) {
  if (err) return reject(err)
  
  db.get(`SELECT ${formulatePublicFields(table)} `
    + `FROM ${table.name}${formulateLinks(table.links)} `
    + `WHERE ${table.key} = ?`, key || this.lastID,
    (err, row) => err ? reject(err) : resolve(row))
}

/**
 * Creates an API providing functions that interact with the database
 */
const createApi = (db) => ({
  /**
   * Select all rows from a table.
   * Includes joins defined in the table definition.
   */
  selectAllFromTable: table => new Promise((resolve, reject) => {
    const { name, links, key } = table
    const sql = `SELECT ${formulatePublicFields(table)} `
    + `FROM ${name}${formulateLinks(links)}`
    db.all(sql, (err, rows) => {
      err ? reject(err) : resolve(rows.filter(r => r[key] !== null))
    })
  }),

  /**
   * Select one specific row from a table based on the ID
   */
  selectOneFromTable: (table, id) =>
    new Promise((resolve, reject) => {
      const { name, key, links } = table
      db.get(`SELECT ${formulatePublicFields(table)} `
        + `FROM ${name}${formulateLinks(links)} `
        + `WHERE ${key} = ?`, [id], (err, row) => {
          // return null if row returned is undefined
          // (to be more explicit about the 404 error)
          err ? reject(err) : resolve(row || null)
        })
    }),

  selectFullUserByUsername: (username) =>
    new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE u_username = ?`, [username],
        (err, row) => err ? reject(err) : resolve(row || null))
    }),

  /**
   * Select rows from table based on query strings
   */
  selectFilteredFromTable: (table, query) => 
    new Promise((resolve, reject) => {
      const filteredFields = filterInputFields(table, query, true)

      const sql = `SELECT ${formulatePublicFields(table)} `
        + `FROM ${table.name}${formulateLinks(table.links)} `
        + `WHERE ${filteredFields
          // if the query values is an array, use its array length, else 1 
          .map(f => Array(Array.isArray(query[f]) ? query[f].length : 1)
            // join number of values with sql ors
            .fill(`${f} = ?`).join(' OR '))
          // join the different queries with sql ands
          .join(' AND ')}`

      // use flatMap to flatten the inner arrays of queries with multiple values
      db.all(sql, filteredFields.flatMap(f => query[f]), function (err, rows) {
        err ? reject(err) : resolve(rows)
      })
    }),

  /**
   * Insert a new row into a table. Only fields defined in the table
   * definition are used.
   */
  insertIntoTable: (table, values) => new Promise((resolve, reject) => {
    const filteredFields = filterInputFields(table, values)

    // create sql statement based on the given fields
    const sql = `INSERT INTO ${table.name} (${filteredFields.join(', ')}) `
      + `VALUES (${Array(filteredFields.length).fill('?').join(', ')})`

    db.run(sql, filteredFields.map(f => values[f]),
      makeGetCallback(db, table, resolve, reject))
  }),

  updateOneInTable: (table, id, values) => new Promise((resolve, reject) => {
    const filteredFields = filterInputFields(table, values)
    if (filteredFields.length === 0) return resolve()

    // create sql statement based on the given fields
    const sql = `UPDATE ${table.name} SET ${filteredFields
      .map(field => `${field} = ?`) // generates: field = value, ...
      .join(', ')} WHERE ${table.key} = ?`

    // run the sql statement with the field values and the key
    db.run(sql, [...filteredFields.map(f => values[f]), id],
      makeGetCallback(db, table, resolve, reject, id))
  }),

  /**
   * Delete a specific row from a table.
   */
  deleteFromTable: (table, id) => new Promise((resolve, reject) => {
    db.run(`DELETE FROM ${table.name} WHERE ${table.key} = ?`, [id], err => {
      err ? reject(err) : resolve()
    })
  })
})

module.exports = createApi
