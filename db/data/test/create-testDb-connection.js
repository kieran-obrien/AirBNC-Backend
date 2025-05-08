const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env.test"),
});

const { Pool } = require("pg");
const testDb = new Pool();

module.exports = testDb;
