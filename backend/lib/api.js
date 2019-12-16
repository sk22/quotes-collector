/**
 * Helper method to create the SQL code for the inner joins.
 */
const formulateLinks = links => links ? ` INNER JOIN ${links.join(', ')}` : ''

const createApi = (db) => ({
  /**
   * Select all rows from a table.
   * Includes joins defined in the table definition.
   */
  selectAllFromTable: ({ name, links }) => new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${name}${formulateLinks(links)}`, (err, rows) => {
      err ? reject(err) : resolve(rows)
    })
  }),

  /**
   * Select one specific row from a table based on the ID
   */
  selectOneFromTable: ({ name, key, links }, id) =>
    new Promise((resolve, reject) => {
      db.get(`SELECT * FROM ${name}${formulateLinks(links)} `
        + `WHERE ${key} = ?`, [id], (err, row) => {
          // return null if row returned is undefined
          // (to be more explicit about the 404 error)
          err ? reject(err) : resolve(row || null)
        })
    }),

  /**
   * Insert a new row into a table. Only fields defined in the table
   * definition are used.
   */
  insertIntoTable: (table, values) => new Promise((resolve, reject) => {
    const fieldsApplied = Object.keys(values)
      .filter(f => table.fields.includes(f))

    // create sql statement based on the table's applied fields
    const sql = `INSERT INTO ${table.name} (${fieldsApplied.join(', ')}) `
      + `VALUES (${Array(fieldsApplied.length).fill('?').join(', ')})`

    db.run(sql, fieldsApplied.map(f => values[f]), err => {
      err ? reject(err) : resolve()
    })
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
