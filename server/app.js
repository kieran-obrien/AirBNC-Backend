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
} = require("./controllers/reviews.controllers");

const {
  handlePathNotFound,
  handleBadRequest,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

const { getUserById } = require("./controllers/users.controllers");

app.get("/api/properties", getProperties);
app.get("/api/properties/:id", getPropertyById);

app.get("/api/properties/:id/reviews", getReviewsById);
app.post("/api/properties/:id/reviews", postReviewById);

app.get("/api/users/:id", getUserById);

app.all("/*allbadpaths", handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequest);

module.exports = app;
