const {
  selectReviewsById,
  insertReviewById,
  deleteReview,
  validateReviewPayload,
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
  try {
    await validateReviewPayload(req.body);
    const review = await insertReviewById(req.params.id, req.body);
    res.status(201).send(review);
  } catch (error) {
    next(error);
  }
};

exports.deleteReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteReview(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
