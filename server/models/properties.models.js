const db = require("../../db/connection");

exports.selectProperties = async () => {
  const { rows: properties } = await db.query(
    `SELECT property_id, name AS property_name, 
    location, price_per_night, host_id, 
    first_name, surname FROM properties 
    JOIN users ON properties.host_id = users.user_id;
 `
  );
  for (const property of properties) {
    property.host = `${property.first_name} ${property.surname}`;
    delete property.first_name;
    delete property.surname;
    delete property.host_id;
  }

  return properties;
};
