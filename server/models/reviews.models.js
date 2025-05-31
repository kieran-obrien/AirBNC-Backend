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
