const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env.test"),
});

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured, have you setup .env.test?");
}

const { Pool } = require("pg");
const testDb = new Pool();

module.exports = testDb;
