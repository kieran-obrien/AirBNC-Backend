const { selectProperties } = require("../models/properties.models");

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
