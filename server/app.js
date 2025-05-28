const express = require("express");
const app = express();
app.use(express.json());

// Controllers/Middleware
const {
  getProperties,
  getReviewsById,
  getPropertyById,
} = require("./controllers/properties.controllers");

const {
  handlePathNotFound,
  handleBadRequest,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

app.get("/api/properties", getProperties);
app.get("/api/properties/:id/reviews", getReviewsById);
app.get("/api/properties/:id", getPropertyById);

app.all("/*allbadpaths", handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequest);

module.exports = app;
