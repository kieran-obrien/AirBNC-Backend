const db = require("../../db/connection");

exports.selectProperties = async (
  //! NEED TO ADD DEFAULT FAV SORTING ONCE FAV SEED FUNC DONE
  maxprice = Infinity,
  minprice = 0,
  sort,
  order = "DESC",
  host
) => {
  const orders = ["ASC", "DESC"];

  const sortColumn = sort === "price_per_night" ? sort : "popularity"; // Will default to popularity, not location when faves done
  const sortOrder = orders.includes(order.toUpperCase())
    ? order.toUpperCase()
    : "DESC";

  const hostClause = Number.isNaN(Number(host)) ? "" : `AND host_id = ${host}`;

  const { rows: properties } = await db.query(
    `SELECT 
     properties.property_id, 
     properties.name AS property_name, 
     properties.location, 
     properties.price_per_night, 
     properties.host_id, 
     users.first_name, 
     users.surname,
     COUNT(favourites.property_id) AS popularity
   FROM properties
   JOIN users ON properties.host_id = users.user_id
   LEFT JOIN favourites ON favourites.property_id = properties.property_id
   WHERE properties.price_per_night BETWEEN $1 AND $2
   ${hostClause}
   GROUP BY 
     properties.property_id, 
     properties.name, 
     properties.location, 
     properties.price_per_night, 
     properties.host_id, 
     users.first_name, 
     users.surname
   ORDER BY ${sortColumn} ${sortOrder};`,
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
