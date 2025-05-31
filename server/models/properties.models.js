const db = require("../../db/connection");

exports.selectProperties = async (
  maxprice = Infinity,
  minprice = 0,
  sort = "popularity",
  order = "DESC",
  host
) => {
  if (
    (Number.isNaN(Number(maxprice)) && maxprice !== Infinity) ||
    Number.isNaN(Number(minprice)) ||
    (Number.isNaN(Number(host)) && host !== undefined)
  )
    return Promise.reject({
      status: 400,
      msg: "Bad request, query data type invalid.",
    });

  if (sort !== "price_per_night" && sort !== "popularity")
    return Promise.reject({
      status: 400,
      msg: "Bad request, query column invalid.",
    });

  const orders = ["ASC", "DESC"];
  if (!orders.includes(order.toUpperCase()))
    return Promise.reject({
      status: 400,
      msg: "Bad request, invalid sort order.",
    });

  const hostClause = host === undefined ? "" : `AND host_id = ${host}`;

  const { rows: properties } = await db.query(
    `SELECT 
     properties.property_id, 
     properties.name AS property_name, 
     properties.location, 
     properties.price_per_night, 
     CONCAT(users.first_name, ' ', users.surname) AS host,
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
   ORDER BY ${sort} ${order};`,
    [minprice, maxprice]
  );

  if (host) {
    let {
      rows: [hostIdInDb],
    } = await db.query("SELECT * FROM properties WHERE host_id = $1", [host]);
    hostIdInDb = hostIdInDb === undefined ? false : true;
    if (!hostIdInDb)
      return Promise.reject({ status: 404, msg: "Data not found." });
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

exports.selectPropertyById = async (id, userId) => {
  const {
    rows: [property],
  } = await db.query(
    `SELECT 
     properties.property_id, 
     properties.name AS property_name, 
     properties.location, 
     properties.price_per_night,
     properties.description,
     users.first_name,
     users.surname,
     users.avatar AS host_avatar,
     COUNT(favourites.property_id) AS favourite_count
     FROM properties
     JOIN users ON properties.host_id = users.user_id
     LEFT JOIN favourites ON favourites.property_id = properties.property_id
     WHERE properties.property_id = $1
     GROUP BY 
     properties.property_id, 
     properties.name, 
     properties.location, 
     properties.price_per_night, 
     users.first_name, 
     users.surname,
     users.avatar;`,
    [id]
  );

  if (property === undefined)
    return Promise.reject({ status: 404, msg: "Data not found." });

  property.host = `${property.first_name} ${property.surname}`;
  delete property.first_name;
  delete property.surname;

  if (userId) {
    const isUserIdNumber = Number.isNaN(Number(userId)) ? false : true;
    if (!isUserIdNumber)
      return Promise.reject({ status: 400, msg: "Bad request." });
    let {
      rows: [userIdInDb],
    } = await db.query("SELECT * FROM users WHERE user_id = $1", [userId]);

    userIdInDb = userIdInDb === undefined ? false : true;
    if (!userIdInDb)
      return Promise.reject({ status: 404, msg: "Data not found." });

    let {
      rows: [hasFaved],
    } = await db.query(
      `SELECT favourite_id
      FROM favourites
      WHERE property_id = $1
      AND guest_id = $2;`,
      [id, userId]
    );
    property.favourited = hasFaved === undefined ? false : true;
    return property;
  } else return property;
};
