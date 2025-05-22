const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "dev";
const pathToCorrectEnvFile = `${__dirname}/../.env.${ENV}`;

require("dotenv").config({
  path: pathToCorrectEnvFile,
});

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured!");
}

const db = new Pool();

module.exports = db;
