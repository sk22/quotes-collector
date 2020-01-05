/**
 * Table definitions used for generating the SQL statements
 */
const tables = [
  { name: 'quotes', key: 'q_id',
    fields: ['q_id', 'q_text', 'q_user', 'q_author', 'q_votes' ],
    links: ['users on q_user = u_id'] },
  { name: 'users', key: 'u_id',
    fields: ['u_id', 'u_username', 'u_password', 'u_token' ],
    hidden: ['u_password'] },
  { name: 'votes', key: 'v_id',
    fields: ['v_id', 'v_quote', 'v_user', 'v_vote' ],
    links: ['users on v_user = u_id', 'quotes on v_quote = q_id'] }
]

module.exports = tables
