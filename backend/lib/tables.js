/**
 * Table definitions used for generating the SQL statements
 */
const tables = [
  { name: 'quotes', key: 'q_id', auth: 'q_user',
    fields: ['q_id', 'q_text', 'q_user', 'q_author'],
    public: ['q_id', 'q_text', 'q_user', 'q_author', 'u_id', 'u_username'],
    links: { inner: ['users on q_user = u_id'] } },
  { name: 'users', key: 'u_id', auth: 'u_id',
    fields: ['u_id', 'u_username', 'u_password', 'u_token'],
    public: ['u_id', 'u_username'] },
  { name: 'votes', key: 'v_id', auth: 'v_user',
    fields: ['v_id', 'v_quote', 'v_user', 'v_vote' ],
    public: ['v_id', 'v_quote', 'v_user', 'v_vote', 'u_id', 'u_username'],
    links: { inner: ['users on v_user = u_id', 'quotes on v_quote = q_id'] } }
]

module.exports = tables
