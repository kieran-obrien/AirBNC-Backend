const request = require("supertest");
const app = require("../../server/app");
const db = require("../../db/connection");

const seedDatabase = require("../../db/seed");
const seedTestData = require("../../db/data/test/index");

beforeEach(async () => {
  await seedDatabase(seedTestData).then(() => {});
});

afterAll(async () => {
  await db.end();
});

describe("app", () => {
  describe("GET - /api/properties", () => {
    test("should return status 200", async () => {
      await request(app).get("/api/properties").expect(200);
    });
    test(`returns with an array of property objects with keys 
      - property_id, property_name, location, price_per_night, host`, async () => {
      const validKeys = [
        "property_id",
        "property_name",
        "location",
        "price_per_night",
        "host",
      ];
      const { body } = await request(app).get("/api/properties");

      expect(body.properties).toBeArray();
      body.properties.forEach((property) => {
        expect(property).toContainAllKeys(validKeys);
      });
    });
  });
});
