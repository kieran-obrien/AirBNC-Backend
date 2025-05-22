const express = require("express");
const app = express();
app.use(express.json());

// Controllers/Middleware
const { getProperties } = require("./controllers/properties.controllers");

app.get("/api/properties", getProperties);

module.exports = app;
