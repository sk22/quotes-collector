create table quotes (
  q_id integer primary key autoincrement,
  q_text text not null,
  q_user integer not null,
  q_author text not null,
  q_votes integer not null default 0
);

create table users (
  u_id integer primary key autoincrement,
  u_username text not null
);

create table votes (
  v_id integer primary key autoincrement,
  v_quote integer not null,
  v_user integer not null,
  v_vote boolean not null,
  UNIQUE(v_quote, v_user)
);
