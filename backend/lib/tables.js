/**
 * Table definitions used for generating the SQL statements
 */
const tables = [
  { name: 'quotes', key: 'q_id', auth: 'q_user',
    fields: ['q_id', 'q_text', 'q_user', 'q_author', 'q_votes' ],
    public: [
      'q_id', 'q_text', 'q_user', 'q_author', 'q_votes', 'u_id', 'u_username'
    ],
    links: ['users on q_user = u_id'] },
  { name: 'users', key: 'u_id',
    fields: ['u_id', 'u_username', 'u_password', 'u_token' ] },
  { name: 'votes', key: 'v_id', auth: 'v_user',
    fields: ['v_id', 'v_quote', 'v_user', 'v_vote' ],
    public: ['v_id', 'v_quote', 'v_user', 'v_vote', 'u_id', 'u_username' ],
    links: ['users on v_user = u_id', 'quotes on v_quote = q_id'] }
]

module.exports = tables
