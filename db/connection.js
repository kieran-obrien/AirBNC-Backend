const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "dev";
const pathToCorrectEnvFile = `${__dirname}/../.env.${ENV}`;
console.log(pathToCorrectEnvFile);
require("dotenv").config({
  path: pathToCorrectEnvFile,
});

console.log(process.env.PGDATABASE);

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured!");
}

const db = new Pool();

module.exports = db;
