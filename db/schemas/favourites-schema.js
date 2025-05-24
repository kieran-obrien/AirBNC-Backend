const favouritesSchema = `CREATE TABLE favourites(
  favourite_id SERIAL PRIMARY KEY,
  guest_id INT NOT NULL, FOREIGN KEY (guest_id) REFERENCES users(user_id),
  property_id INT NOT NULL REFERENCES properties)`;

exports.favouritesSchema = favouritesSchema;
