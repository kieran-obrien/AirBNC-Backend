const { selectProperties } = require("../models/properties.models");

exports.getProperties = async (req, res, next) => {
  const properties = await selectProperties();
  res.status(200).send({ properties });
};
