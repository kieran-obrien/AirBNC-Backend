const seedDatabase = require("./seed");
const seedTestData = require("./data/test/index");
const seedDevData = require("./data/dev/index");


console.log(process.env.PGDATABASE);
const seedSelection = process.env.PGDATABASE.split("_");
console.log(seedSelection);
if (seedSelection[1] === "test") {
  seedDatabase(seedTestData);
} else if (seedSelection[1] === "dev") {
  seedDatabase(seedDevData);
} else throw new Error("Invalid database for seeding, check .env files!");



