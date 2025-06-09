exports.handlePathNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.code !== 23503) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handleDataNotInDb = (err, req, res, next) => {
  res.status(404).send({ msg: "Data not found." });
};

exports.handleBadRequest = (err, req, res, next) => {
  res.status(400).send({ msg: "Bad request." });
};
