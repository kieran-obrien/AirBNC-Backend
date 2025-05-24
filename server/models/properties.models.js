const db = require("../../db/connection");

exports.selectProperties = async (
  //! NEED TO ADD DEFAULT FAV SORTING ONCE FAV SEED FUNC DONE
  maxprice = Infinity,
  minprice = 0,
  sort = "price_per_night",
  order = "ASC",
  host
) => {
  const orders = ["ASC", "DESC"];

  const sortColumn = sort === "price_per_night" ? sort : "location"; // Will default to popularity, not location when faves done
  const sortOrder = orders.includes(order.toUpperCase())
    ? order.toUpperCase()
    : "ASC";

  const hostClause = Number.isNaN(Number(host)) ? "" : `AND host_id = ${host}`;

  const { rows: properties } = await db.query(
    `SELECT property_id, name AS property_name, 
    location, price_per_night, host_id, 
    first_name, surname FROM properties 
    JOIN users ON properties.host_id = users.user_id
    WHERE price_per_night BETWEEN $1 AND $2
    ${hostClause}
    ORDER BY ${sortColumn} ${sortOrder};
 `,
    [minprice, maxprice]
  );
  for (const property of properties) {
    property.host = `${property.first_name} ${property.surname}`;
    delete property.first_name;
    delete property.surname;
    delete property.host_id;
  }

  return properties;
};
