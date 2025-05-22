const seedDatabase = require("../../db/seed");
const seedTestData = require("../../db/data/test/index");

beforeEach(async () => {
  await seedDatabase(seedTestData);
});

describe("first", () => {
  test("should first", () => {
    const test = 1;
    expect(test).toBe(1);
  });
});
