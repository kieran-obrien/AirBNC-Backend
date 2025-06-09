const {
  insertFavouriteById,
  validateFavouritePayload,
  deleteFavourite,
} = require("../models/favourites.models");

exports.postFavouriteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateFavouritePayload(req.body);
    const favourite = await insertFavouriteById(req.body, id);
    res.status(201).send(favourite);
  } catch (error) {
    next(error);
  }
};

exports.deleteFavouriteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteFavourite(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
