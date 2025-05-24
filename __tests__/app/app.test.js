const request = require("supertest");
const app = require("../../server/app");
const db = require("../../db/connection");

const seedDatabase = require("../../db/seed");
const seedTestData = require("../../db/data/test/index");

beforeEach(async () => {
  await seedDatabase(seedTestData).then(() => {});
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  test("non-existent endpoint responds with 404 and msg", async () => {
    const { body } = await request(app).get("/non-existent-path").expect(404);
    expect(body.msg).toBe("Path not found.");
  });

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

    //! ADD DEFAULT FAV SORTING TEST WHEN FAV SEED FUNC DONE

    describe("Queries", () => {
      describe("maxprice", () => {
        test("should return properties with price below maxprice", async () => {
          const { body } = await request(app).get(
            "/api/properties?maxprice=100"
          );
          body.properties.forEach((property) => {
            expect(Number(property.price_per_night)).toBeLessThanOrEqual(100);
          });
        });
      });

      describe("minprice", () => {
        test("should return properties with price above minprice", async () => {
          const { body } = await request(app).get(
            "/api/properties?minprice=90"
          );
          body.properties.forEach((property) => {
            expect(Number(property.price_per_night)).toBeGreaterThanOrEqual(90);
          });
        });
      });

      describe("sort", () => {
        test("should return properties sorted by price_per_night", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
          });
        });
      });
    });
  });
});
