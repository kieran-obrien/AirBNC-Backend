const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cors());

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
  postFavouriteById,
  deleteFavouriteById,
} = require("./controllers/favourites.controllers");

const {
  getUserById,
  patchUserById,
} = require("./controllers/users.controllers");

const {
  handlePathNotFound,
  handleBadRequest,
  handleDataNotInDb,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

app.get("/api/properties", getProperties);
app.get("/api/properties/:id", getPropertyById);

app.get("/api/properties/:id/reviews", getReviewsById);
app.post("/api/properties/:id/reviews", postReviewById);
app.delete("/api/reviews/:id", deleteReviewById);

app.get("/api/users/:id", getUserById);
app.patch("/api/users/:id", patchUserById);

app.post("/api/properties/:id/favourite", postFavouriteById);
app.delete(
  "/api/properties/:propertyId/users/:guestId/favourite",
  deleteFavouriteById
);

app.all("/*allbadpaths", handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleDataNotInDb);
app.use(handleBadRequest);

module.exports = app;

// TODO - Refactor error handling to utilise psql error codes
// TODO - Ask about DELETE favourite for potential duplicates
