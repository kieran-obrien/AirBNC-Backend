const express = require("express");
const app = express();
app.use(express.json());

// Controllers/Middleware
const { getProperties } = require("./controllers/properties.controllers");
const {
  handlePathNotFound,
  handleBadRequest,
} = require("./controllers/errors.controllers");

app.get("/api/properties", getProperties);

app.all("/*invalid-path", handlePathNotFound);

app.use(handleBadRequest);

module.exports = app;
