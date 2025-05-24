const db = require("../../db/connection");

exports.selectProperties = async (
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
     users.first_name, 
     users.surname
   ORDER BY ${sortColumn} ${sortOrder};`,
    [minprice, maxprice]
  );

  for (const property of properties) {
    property.host = `${property.first_name} ${property.surname}`;
    delete property.first_name;
    delete property.surname;
  }

  return properties;
};

exports.selectReviewsById = async (id) => {
  const { rows: reviews } = await db.query(
    `
    SELECT reviews.review_id, reviews.comment, 
    reviews.rating, reviews.created_at,
    users.first_name, users.surname,
    users.avatar AS guest_avatar
    FROM reviews
    JOIN users ON reviews.guest_id = users.user_id
    WHERE reviews.property_id = $1
    ORDER BY reviews.created_at DESC`,
    [id]
  );

  if (Array.isArray(reviews) && reviews.length === 0)
    return Promise.reject({ status: 404, msg: "Data not found." });

  let avgRating = 0;
  for (const review of reviews) {
    review.guest = `${review.first_name} ${review.surname}`;
    delete review.first_name;
    delete review.surname;
    avgRating += review.rating;
  }
  avgRating = Number((avgRating / reviews.length).toFixed(1));

  return [reviews, avgRating];
};
