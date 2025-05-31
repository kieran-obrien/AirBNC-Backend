const {
  selectReviewsById,
  insertReviewById,
} = require("../models/reviews.models");

exports.getReviewsById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [reviews, average_rating] = await selectReviewsById(id);
    res.status(200).send({ reviews, average_rating });
  } catch (error) {
    next(error);
  }
};

exports.postReviewById = async (req, res, next) => {
  return "hello";
};
