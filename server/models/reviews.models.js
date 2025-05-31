const db = require("../../db/connection");

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

  const isPropIdNumber = Number.isNaN(Number(id)) ? false : true;
  if (!isPropIdNumber)
    return Promise.reject({ status: 400, msg: "Bad request." });

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

exports.validateReviewPayload = async (payload) => {
  const payloadEntries = Object.entries(payload);
  const validPayloadKeys = ["guest_id", "rating", "comment"];
  if (Object.keys(payload).length !== 3) {
    return Promise.reject({ status: 400, msg: "Invalid payload." });
  } else if (
    !payloadEntries.every((prop) => validPayloadKeys.includes(prop[0]))
  )
    return Promise.reject({ status: 400, msg: "Invalid payload." });
  else if (
    typeof payload["guest_id"] !== "number" ||
    payload["guest_id"] === NaN ||
    !Number.isInteger(payload["rating"]) ||
    payload["rating"] === NaN ||
    typeof payload["comment"] !== "string"
  )
    return Promise.reject({
      status: 400,
      msg: "Invalid payload value data type.",
    });
};

exports.insertReviewById = async (id, payload) => {
  const { guest_id, rating, comment } = payload;

  const isPropIdNumber = Number.isNaN(Number(id)) ? false : true;
  if (!isPropIdNumber)
    return Promise.reject({ status: 400, msg: "Bad request, id must be number." });

  let {
    rows: [propIdInDb],
  } = await db.query("SELECT * FROM properties WHERE property_id = $1", [id]);

  propIdInDb = propIdInDb === undefined ? false : true;
  if (!propIdInDb)
    return Promise.reject({ status: 404, msg: "Data not found." });

  const {
    rows: [review],
  } = await db.query(
    `INSERT INTO reviews (property_id, guest_id, rating, comment)
   VALUES ($1, $2, $3, $4)
   RETURNING *`,
    [id, guest_id, rating, comment]
  );

  return review;
};
