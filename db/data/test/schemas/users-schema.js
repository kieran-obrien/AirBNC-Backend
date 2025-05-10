const usersSchema = `CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  surname VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone_number VARCHAR,
  is_host BOOLEAN NOT NULL,
  avatar VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`;

exports.usersSchema = usersSchema;
