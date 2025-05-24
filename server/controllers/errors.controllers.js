exports.handlePathNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
};

exports.handleBadRequest = (err, req, res, next) => {
  res.status(400).send({ msg: "Bad request." });
};
