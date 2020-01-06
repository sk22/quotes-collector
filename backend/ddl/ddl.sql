create table users (
  u_id integer primary key autoincrement,
  u_username text not null unique,
  u_password text not null,
  u_token text
);

create table quotes (
  q_id integer primary key autoincrement,
  q_text text not null,
  q_user integer not null,
  q_author text not null,
  foreign key (q_user) references users (u_id)
);

create table votes (
  v_id integer primary key autoincrement,
  v_quote integer not null,
  v_user integer not null,
  v_vote boolean not null,
  UNIQUE(v_quote, v_user),
  foreign key (v_user) references users (u_id)
);
