const {
  selectProperties,
  selectReviewsById,
  selectPropertyById,
} = require("../models/properties.models");

exports.getProperties = async (req, res, next) => {
  const { maxprice, minprice, sort, order, host } = req.query;
  try {
    const properties = await selectProperties(
      maxprice,
      minprice,
      sort,
      order,
      host
    );
    res.status(200).send({ properties });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  const { user_id: userId } = req.query;
  try {
    const property = await selectPropertyById(id, userId);
    res.status(200).send({ property });
  } catch (error) {
    next(error);
  }
};
