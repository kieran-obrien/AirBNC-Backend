const express = require("express");
const app = express();
app.use(express.json());

// Controllers/Middleware
const {
  getProperties,
  getPropertyById,
} = require("./controllers/properties.controllers");

const {
  getReviewsById,
  postReviewById,
  deleteReviewById,
} = require("./controllers/reviews.controllers");

const {
  handlePathNotFound,
  handleBadRequest,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

const {
  getUserById,
  patchUserById,
} = require("./controllers/users.controllers");

app.get("/api/properties", getProperties);
app.get("/api/properties/:id", getPropertyById);

app.get("/api/properties/:id/reviews", getReviewsById);
app.post("/api/properties/:id/reviews", postReviewById);
app.delete("/api/reviews/:id", deleteReviewById);

app.get("/api/users/:id", getUserById);
app.patch("/api/users/:id", patchUserById);

app.all("/*allbadpaths", handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequest);

module.exports = app;

// TODO - Refactor error handling to utilise psql error codes