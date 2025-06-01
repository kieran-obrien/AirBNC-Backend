const {
  selectUserById,
  updateUserById,
  validateUpdateUserPayload,
} = require("../models/users.models");

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await selectUserById(id);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

exports.patchUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    await validateUpdateUserPayload(req.body);
    const user = await updateUserById(id, req.body);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
