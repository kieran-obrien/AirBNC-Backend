const testDb = require("./create-testDb-connection.js");

async function seedTestDatabase(testDb) {
  const testConnectionResult = await testDb.query("SELECT current_database();");
  console.log(testConnectionResult);
}

seedTestDatabase(testDb);
