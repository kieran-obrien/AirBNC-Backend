const db = require("./connection.js");
const seedDatabase = require("./seed");
const seedTestData = require("./data/test/index");
const seedDevData = require("./data/dev/index");

const seedSelection = process.env.PGDATABASE.split("_");
if (seedSelection[1] === "test") {
  seedDatabase(seedTestData).then(() => {
    db.end();
  });
} else if (seedSelection[1] === "dev") {
  seedDatabase(seedDevData).then(() => {
    db.end();
  });;
} else throw new Error("Invalid database for seeding, check .env files!");
