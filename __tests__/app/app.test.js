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
    const { body } = await request(app).get("/").expect(404);
    expect(body.msg).toBe("Path not found.");
  });

  //! HOW TO HANDLE 400 AS BAD QUERIES ARE DEFAULTED

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
        "popularity", //! TO FIX
      ];
      const { body } = await request(app).get("/api/properties");

      expect(body.properties).toBeArray();
      body.properties.forEach((property) => {
        expect(property).toContainAllKeys(validKeys);
      });
    });

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
        test("should return properties sorted by price_per_night when passed as query", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
            descending: true,
          });
        });

        //! HOW DO I SORT BY POPULARITY WITHOUT RETURNING IT?
        test("should return properties sorted by popularity when passed as query or any other value (default)", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=popularity"
          );
          expect(body.properties).toBeSortedBy("popularity", {
            coerce: true,
            descending: true,
          });

          const { body: secondBody } = await request(app).get(
            "/api/properties?sort=faultyval"
          );
          expect(secondBody.properties).toBeSortedBy("popularity", {
            coerce: true,
            descending: true,
          });
        });
      });

      describe("order", () => {
        test("should return properties ordered DESC by default", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
            descending: true,
          });
        });

        test("should return properties ordered ASC when passed any casing of asc", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night&order=asc"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
          });

          const { body: secondBody } = await request(app).get(
            "/api/properties?sort=price_per_night&order=Asc"
          );
          expect(secondBody.properties).toBeSortedBy("price_per_night", {
            coerce: true,
          });

          const { body: thirdBody } = await request(app).get(
            "/api/properties?sort=price_per_night&order=aSc"
          );
          expect(thirdBody.properties).toBeSortedBy("price_per_night", {
            coerce: true,
          });
        });
      });

      describe("host", () => {
        test("should return properties filtered by host or empty array if id hosts no properties", async () => {
          const { body } = await request(app).get("/api/properties?host=1");
          // Alice Johnson - id 1, hosts properties
          expect(body.properties.length).toBeGreaterThanOrEqual(1);
          expect(
            body.properties.every(
              (property) => property.host === "Alice Johnson"
            )
          ).toBeTrue();

          const { body: secondBody } = await request(app).get(
            "/api/properties?host=2"
          );
          // Bob Smith - id 2, does not host properties
          expect(secondBody.properties).toBeArrayOfSize(0);
        });
      });

      describe("multi-query", () => {
        test("should return expected data for complex multi-query GET", async () => {
          const { body } = await request(app).get(
            `/api/properties?host=3&sort=price_per_night&order=asc&minprice=90`
          );

          // Emma Davis - id 3, hosts properties, one is less than 90
          expect(body.properties.length).toBeGreaterThanOrEqual(1);
          expect(
            body.properties.every((property) => property.host === "Emma Davis")
          ).toBeTrue();

          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
          });

          body.properties.forEach((property) => {
            expect(Number(property.price_per_night)).toBeGreaterThanOrEqual(90);
          });
        });
      });
    });
  });

  describe("GET - /api/properties/:id/reviews", () => {
    describe("status codes/errors", () => {
      test("should return status 200 for good request", async () => {
        await request(app).get("/api/properties/1/reviews").expect(200);
      });

      test(`returns with 404 and msg if path structure valid but id not in db`, async () => {
        const { body } = await request(app)
          .get("/api/properties/100/reviews")
          .expect(404);

        expect(body.msg).toBe("Data not found.");
      });

      //! NEED TO CLARIFY GLOBAL ERROR HANDLING WITH UPDATED EXPRESS
      /*
      test("should return status 400 for bad request", async () => {
        const { body } = await request(app)
          .get("/api/properties/1/rev")
          .expect(400);
        expect(body.msg).toBe("Path not found.");
      });
      */
    });

    describe("functionality", () => {
      test(`returns with an array of review objects with keys 
      - review_id, comment, rating, created_at, guest, guest_avatar`, async () => {
        const validKeys = [
          "review_id",
          "comment",
          "rating",
          "created_at",
          "guest",
          "guest_avatar",
        ];
        const { body } = await request(app).get("/api/properties/3/reviews");

        expect(body.reviews).toBeArray();

        body.reviews.forEach((review) => {
          expect(review).toContainAllKeys(validKeys);
        });
      });

      //! I want to test sorting by created_at here but seed is all created_at same time?

      test(`returns with an avg_rating key, with correct avg`, async () => {
        // I've chosen to round to 1 decimal place
        const { body } = await request(app).get("/api/properties/3/reviews");

        expect(body).toContainKey("average_rating");
        // Test seed data has two reviews for this property, averaging 3.5
        expect(body.average_rating).toBe(3.5);
      });
    });
  });

  describe("GET - /api/properties/:id", () => {
    describe("status codes/errors", () => {
      test("should return status 200 for good request without query", async () => {
        await request(app).get("/api/properties/1").expect(200);
      });

      test("should return status 200 for good request with query", async () => {
        await request(app).get("/api/properties/1?user_id=2").expect(200);
      });

      test(`returns with 404 and msg if property_id is not in db`, async () => {
        const { body } = await request(app)
          .get("/api/properties/1000?user_id=1")
          .expect(404);

        expect(body.msg).toBe("Data not found.");
      });

      test(`returns with 400 and msg if user_id query is not a number`, async () => {
        const { body } = await request(app)
          .get("/api/properties/1?user_id=imnotanumber")
          .expect(400);

        expect(body.msg).toBe("Bad request.");
      });

      test(`returns with 404 and msg if user_id is not in db`, async () => {
        const { body } = await request(app)
          .get("/api/properties/1?user_id=1000")
          .expect(404);

        expect(body.msg).toBe("Data not found.");
      });

      //! NEED TO CLARIFY GLOBAL ERROR HANDLING WITH UPDATED EXPRESS

      describe("functionality", () => {});
    });

    describe("functionality", () => {
      test(`returns with a single property object with expected keys 
        when no user_id query passed`, async () => {
        const validKeys = [
          "property_id",
          "property_name",
          "location",
          "description",
          "price_per_night",
          "host",
          "host_avatar",
          "favourite_count",
        ];
        const { body } = await request(app).get("/api/properties/1");

        expect(body.property).toBeObject();
        expect(body.property).toContainAllKeys(validKeys);
      });

      test(`returns with a single property object with expected keys 
        when user_id query passed`, async () => {
        const validKeys = [
          "property_id",
          "property_name",
          "location",
          "description",
          "price_per_night",
          "host",
          "host_avatar",
          "favourite_count",
          "favourited",
        ];
        const { body } = await request(app).get("/api/properties/1?user_id=1");

        expect(body.property).toBeObject();
        expect(body.property).toContainAllKeys(validKeys);
      });

      test("should have host key with value of full name of host", async () => {
        const { body } = await request(app).get("/api/properties/1?user_id=1");
        // Test data is first_name = "Alice", surname = "Johnson"
        expect(body.property.host).toBe("Alice Johnson");
      });

      test("should have favourited key reflect favourited status of property_id/user_id", async () => {
        const { body } = await request(app).get("/api/properties/1?user_id=1");
        // Alice Johnson is user_id 1 and in test data has not favourited property_id 1
        expect(body.property.favourited).toBeFalse();

        const { body: secondBody } = await request(app).get(
          "/api/properties/1?user_id=2"
        );
        // Bob Smith is user_id 2 and in test data has favourited property_id 1
        expect(secondBody.property.favourited).toBeTrue();
      });
    });
  });
});
