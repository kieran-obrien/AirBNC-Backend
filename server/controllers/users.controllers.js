const { selectUserById } = require("../models/users.models");

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await selectUserById(id);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
