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

      describe("order", () => {
        test("should return properties ordered ASC by default", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
          });
        });

        test("should return properties ordered DESC when passed any casing of desc", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night&order=desc"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
            descending: true,
          });

          const { body: secondBody } = await request(app).get(
            "/api/properties?sort=price_per_night&order=Desc"
          );
          expect(secondBody.properties).toBeSortedBy("price_per_night", {
            coerce: true,
            descending: true,
          });

          const { body: thirdBody } = await request(app).get(
            "/api/properties?sort=price_per_night&order=dESc"
          );
          expect(thirdBody.properties).toBeSortedBy("price_per_night", {
            coerce: true,
            descending: true,
          });
        });
      });

      describe("host", () => {
        test("should return properties filtered by host or empty array if id hosts no properties", async () => {
          const { body } = await request(app).get("/api/properties?host=1");
          // Alice Johnson - id 1, hosts properties
          if (body.properties.length > 0) {
            expect(
              body.properties.every(
                (property) => property.host === "Alice Johnson"
              )
            ).toBeTrue();
          } else expect(body.properties).toBeArrayOfSize(0);

          const { body: secondBody } = await request(app).get(
            "/api/properties?host=2"
          );
          // Bob Smith - id 2, does not host properties
          if (secondBody.properties.length > 0) {
            expect(
              secondBody.properties.every(
                (property) => property.host === undefined
              )
            ).toBeTrue();
          } else expect(secondBody.properties).toBeArrayOfSize(0);
        });
      });
    });
  });
});
