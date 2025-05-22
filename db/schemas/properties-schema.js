const propertiesSchema = `CREATE TABLE properties(
  property_id SERIAL PRIMARY KEY,
  host_id INT NOT NULL, FOREIGN KEY (host_id) REFERENCES users(user_id),
  name VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  property_type VARCHAR NOT NULL REFERENCES property_types,
  price_per_night DECIMAL NOT NULL,
  description TEXT
);`;

exports.propertiesSchema = propertiesSchema;
