const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "dev";
const pathToCorrectEnvFile = `${__dirname}/../.env.${ENV}`;

require("dotenv").config({
  path: pathToCorrectEnvFile,
});

const config = {};

if (ENV === "prod") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (ENV !== "prod" && !process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured!");
}

const db = new Pool(config);

module.exports = db;
