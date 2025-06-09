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

describe("Express App Tests", () => {
  describe("General ------------>", () => {
    test("non-existent endpoint responds with 404 and msg", async () => {
      const { body } = await request(app).get("/imnot/avalidpath").expect(404);
      expect(body.msg).toBe("Path not found.");
    });
  });

  describe("Properties Endpoints ------------>", () => {
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
          "popularity",
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

          test(`returns with 400 and msg if maxprice query is not a number`, async () => {
            const { body } = await request(app)
              .get("/api/properties?maxprice=imnotanumber")
              .expect(400);

            expect(body.msg).toBe("Bad request, query data type invalid.");
          });
        });

        describe("minprice", () => {
          test("should return properties with price above minprice", async () => {
            const { body } = await request(app).get(
              "/api/properties?minprice=90"
            );
            body.properties.forEach((property) => {
              expect(Number(property.price_per_night)).toBeGreaterThanOrEqual(
                90
              );
            });
          });

          test(`returns with 400 and msg if minprice query is not a number`, async () => {
            const { body } = await request(app)
              .get("/api/properties?minprice=imnotanumber")
              .expect(400);

            expect(body.msg).toBe("Bad request, query data type invalid.");
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

          test("should return properties sorted by popularity when passed as query or as default", async () => {
            const { body } = await request(app).get(
              "/api/properties?sort=popularity"
            );
            expect(body.properties).toBeSortedBy("popularity", {
              coerce: true,
              descending: true,
            });

            const { body: secondBody } = await request(app).get(
              "/api/properties"
            );
            expect(secondBody.properties).toBeSortedBy("popularity", {
              coerce: true,
              descending: true,
            });
          });

          test(`returns with 400 and msg if sort query is not a valid option`, async () => {
            const { body } = await request(app)
              .get("/api/properties?sort=imnotavalidoption")
              .expect(400);

            expect(body.msg).toBe("Bad request, query column invalid.");
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

          test(`returns with 400 and msg if sort query is not a valid option`, async () => {
            const { body } = await request(app)
              .get(
                "/api/properties?sort=price_per_night&order=imnotavalidoption"
              )
              .expect(400);

            expect(body.msg).toBe("Bad request, invalid sort order.");
          });
        });

        describe("host", () => {
          test("should return properties filtered by host", async () => {
            const { body } = await request(app).get("/api/properties?host=1");
            // Alice Johnson - id 1, hosts properties
            expect(body.properties.length).toBeGreaterThanOrEqual(1);
            expect(
              body.properties.every(
                (property) => property.host === "Alice Johnson"
              )
            ).toBeTrue();
          });

          test(`returns with 400 and msg if host query is not a valid host_id`, async () => {
            const { body } = await request(app)
              .get("/api/properties?host=2")
              .expect(404);
            // Bob Smith, does not host properties
            expect(body.msg).toBe("Data not found.");
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
              body.properties.every(
                (property) => property.host === "Emma Davis"
              )
            ).toBeTrue();

            expect(body.properties).toBeSortedBy("price_per_night", {
              coerce: true,
            });

            body.properties.forEach((property) => {
              expect(Number(property.price_per_night)).toBeGreaterThanOrEqual(
                90
              );
            });
          });
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
          const { body } = await request(app).get(
            "/api/properties/1?user_id=1"
          );

          expect(body.property).toBeObject();
          expect(body.property).toContainAllKeys(validKeys);
        });

        test("should have host key with value of full name of host", async () => {
          const { body } = await request(app).get(
            "/api/properties/1?user_id=1"
          );
          // Test data is first_name = "Alice", surname = "Johnson"
          expect(body.property.host).toBe("Alice Johnson");
        });

        test("should have favourited key reflect favourited status of property_id/user_id", async () => {
          const { body } = await request(app).get(
            "/api/properties/1?user_id=1"
          );
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

  describe("Reviews Endpoints ------------>", () => {
    describe("GET - /api/properties/:id/reviews", () => {
      describe("status codes/errors", () => {
        test("should return status 200 for good request", async () => {
          await request(app).get("/api/properties/1/reviews").expect(200);
        });

        test(`returns with 400 and msg if property_id query is not a number`, async () => {
          const { body } = await request(app)
            .get("/api/properties/notanumber/reviews")
            .expect(400);

          expect(body.msg).toBe("Bad request.");
        });

        test(`returns with 404 and msg if path structure valid but id not in db`, async () => {
          const { body } = await request(app)
            .get("/api/properties/100/reviews")
            .expect(404);

          expect(body.msg).toBe("Data not found.");
        });
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

    describe("POST - /api/properties/:id/reviews", () => {
      describe("status codes/errors", () => {
        test("should return status 201 when passed correct payload structure/content", async () => {
          await request(app)
            .post("/api/properties/1/reviews")
            .send({ guest_id: 1, rating: 3, comment: "Blah blah" })
            .expect(201);
        });

        test(`returns with 404 and msg if property_id is not in db`, async () => {
          const { body } = await request(app)
            .post("/api/properties/1000/reviews")
            .send({ guest_id: 1, rating: 3, comment: "Blah blah" })
            .expect(404);

          expect(body.msg).toBe("Data not found.");
        });

        test(`returns with 400 and msg if payload key structure incorrect`, async () => {
          const { body } = await request(app)
            .post("/api/properties/1000/reviews")
            .send({ guest: 1, rating: 3, comment: "Blah blah" })
            .expect(400);

          expect(body.msg).toBe("Invalid payload.");
        });

        test(`returns with 400 and msg if payload key structure correct, but vals of wrong type`, async () => {
          const { body } = await request(app)
            .post("/api/properties/1/reviews")
            .send({ guest_id: 1, rating: 3, comment: 100 })
            .expect(400);

          expect(body.msg).toBe("Invalid payload value data type.");
        });

        test(`returns with 400 and msg if property_id is not valid data type`, async () => {
          const { body } = await request(app)
            .post("/api/properties/number/reviews")
            .send({ guest_id: 1, rating: 3, comment: "Blah blah" })
            .expect(400);

          expect(body.msg).toBe("Bad request, id must be number.");
        });
      });

      describe("functionality", () => {
        test("returns with a single posted review object, with correct keys/values", async () => {
          const validKeys = [
            "review_id",
            "property_id",
            "guest_id",
            "rating",
            "comment",
            "created_at",
          ];

          const { body } = await request(app)
            .post("/api/properties/1/reviews")
            .send({ guest_id: 1, rating: 3, comment: "Blah blah" });

          expect(body).toBeObject();
          for (const key in body) {
            expect(validKeys.includes(key)).toBeTrue();
          }

          expect(body.review_id).toBe(12);
          expect(body.property_id).toBe(1);
          expect(body.guest_id).toBe(1);
          expect(body.rating).toBe(3);
          expect(body.comment).toBe("Blah blah");
        });
      });

      describe("DELETE - /api/reviews/:id", () => {
        describe("status codes/errors", () => {
          test("should return status 204 for good request", async () => {
            await request(app).delete("/api/reviews/1").expect(204);
          });

          test(`returns with 400 and msg if review_id param is not a number`, async () => {
            const { body } = await request(app)
              .delete("/api/reviews/notanumber")
              .expect(400);

            expect(body.msg).toBe("Bad request.");
          });

          test(`returns with 404 and msg if path structure valid but review_id not in db`, async () => {
            const { body } = await request(app)
              .delete("/api/reviews/1000")
              .expect(404);

            expect(body.msg).toBe("Data not found.");
          });
        });

        describe("functionality", () => {
          test(`successfully deletes review from database`, async () => {
            await request(app).delete("/api/reviews/1");
            const { rowCount } = await db.query("SELECT * FROM reviews;");
            expect(rowCount).toBe(10);
          });
        });
      });
    });
  });

  describe("Favourites Endpoints ------------>", () => {
    describe("POST - /api/properties/:id/favourite", () => {
      describe("status codes/errors", () => {
        test("should return status 201 and msg/favourite_id when passed correct payload structure/id", async () => {
          const { body } = await request(app)
            .post("/api/properties/1/favourite")
            .send({ guest_id: 5 })
            .expect(201);

          expect(body).toEqual({
            msg: "Property favourited successfully.",
            favourite_id: 13,
          });
        });

        test(`returns with 404 and msg if property_id is not in db`, async () => {
          const { body } = await request(app)
            .post("/api/properties/1000/favourite")
            .send({ guest_id: 1 })
            .expect(404);

          expect(body.msg).toBe("Data not found.");
        });

        test(`returns with 400 and msg if property_id is not valid data type`, async () => {
          const { body } = await request(app)
            .post("/api/properties/number/favourite")
            .send({ guest_id: 1 })
            .expect(400);

          expect(body.msg).toBe("Bad request, id must be number.");
        });

        test(`returns with 400 and msg if invalid payload key or value`, async () => {
          const { body } = await request(app)
            .post("/api/properties/1/favourite")
            .send({ guest: 1 })
            .expect(400);

          expect(body.msg).toBe("Invalid payload.");
        });
      });

      describe("functionality", () => {
        test("returns with a single posted favourite object, with correct keys/values", async () => {
          const validKeys = ["msg", "favourite_id"];

          const { body } = await request(app)
            .post("/api/properties/1/favourite")
            .send({ guest_id: 1 });

          expect(body).toBeObject();
          for (const key in body) {
            expect(validKeys.includes(key)).toBeTrue();
          }

          expect(body.msg).toBe("Property favourited successfully.");
          expect(body.favourite_id).toBe(13);
        });

        test(`successfully posts favourite to database`, async () => {
          await request(app)
            .post("/api/properties/1/favourite")
            .send({ guest_id: 5 });
          const { rowCount, rows } = await db.query(
            "SELECT * FROM favourites;"
          );
          expect(rowCount).toBe(13);
          expect(rows[12]).toEqual({
            favourite_id: 13,
            guest_id: 5,
            property_id: 1,
          });
        });
      });
    });

    describe("DELETE - /api/properties/:propertyId/users/:guestId/favourite", () => {
      describe("status codes/errors", () => {
        test("should return status 204 for good request", async () => {
          await request(app)
            .delete("/api/properties/1/users/2/favourite")
            .expect(204);
        });

        test(`returns with 400 and msg if property_id param is not a number`, async () => {
          const { body } = await request(app)
            .delete("/api/properties/notanumber/users/1/favourite")
            .expect(400);

          expect(body.msg).toBe("Bad request.");
        });

        test(`returns with 400 and msg if guest_id param is not a number`, async () => {
          const { body } = await request(app)
            .delete("/api/properties/1/users/notanumber/favourite")
            .expect(400);

          expect(body.msg).toBe("Bad request.");
        });

        test(`returns with 404 and msg if path structure valid but favourite with property_id/guest_id not in db`, async () => {
          const { body } = await request(app)
            .delete("/api/properties/1/users/1/favourite")
            .expect(404);

          expect(body.msg).toBe("Data not found.");
        });
      });

      describe("functionality", () => {
        test(`successfully deletes favourite from database`, async () => {
          await request(app).delete("/api/properties/1/users/2/favourite");
          const { rowCount } = await db.query("SELECT * FROM reviews;");
          expect(rowCount).toBe(11);

          const { rowCount: favCheck } = await db.query(`
            SELECT * FROM favourites
            WHERE property_id = 1
            AND guest_id = 2;
            `);
          expect(favCheck).toBe(0);
        });
      });
    });
  });

  describe("Users Endpoints ------------>", () => {
    describe("GET - /api/users/:id", () => {
      describe("status codes/errors", () => {
        test("should return status 200 when passed correct id", async () => {
          await request(app).get("/api/users/1/").expect(200);
        });

        test(`returns with 404 and msg if user_id is not in db`, async () => {
          const { body } = await request(app)
            .get("/api/users/1000")
            .expect(404);

          expect(body.msg).toBe("Data not found.");
        });

        test(`returns with 400 and msg if id is invalid data type`, async () => {
          const { body } = await request(app)
            .get("/api/users/notanumber")
            .expect(400);

          expect(body.msg).toBe("Invalid id data type.");
        });
      });

      describe("functionality", () => {
        test("returns with a single user object, with correct keys/values", async () => {
          const validKeys = [
            "user_id",
            "first_name",
            "surname",
            "email",
            "phone_number",
            "is_host",
            "avatar",
            "created_at",
          ];

          const { body } = await request(app).get("/api/users/1");
          const user = body.user;

          expect(user).toBeObject();
          for (const key in user) {
            expect(validKeys.includes(key)).toBeTrue();
          }

          // Alice Johnson - User 1
          expect(user.user_id).toBe(1);
          expect(user.first_name).toBe("Alice");
          expect(user.surname).toBe("Johnson");
          expect(user.email).toBe("alice@example.com");
          expect(user.phone_number).toBe("+44 7000 111111");
          expect(user.is_host).toBe(true);
          expect(user.avatar).toBe("https://example.com/images/alice.jpg");
        });
      });
    });

    describe("PATCH - /api/users/:id", () => {
      describe("status codes/errors", () => {
        test("should return status 200 when passed valid id/payload", async () => {
          await request(app)
            .patch("/api/users/1")
            .send({ first_name: "John" })
            .expect(200);
        });

        test(`returns with 400 and msg if payload not provided`, async () => {
          const { body } = await request(app).patch("/api/users/1").expect(400);

          expect(body.msg).toBe("Must provide payload.");
        });

        test(`returns with 400 and msg if payload is empty object`, async () => {
          const { body } = await request(app)
            .patch("/api/users/1")
            .send({})
            .expect(400);

          expect(body.msg).toBe("Invalid payload.");
        });

        test(`returns with 400 and msg if payload key not valid`, async () => {
          const { body } = await request(app)
            .patch("/api/users/1")
            .send({
              wrong_key: "John",
              email: "new@email.com",
              phone_number: "123456789",
            })
            .expect(400);

          expect(body.msg).toBe("Invalid payload.");
        });

        test(`returns with 400 and msg if payload value is invalid data type`, async () => {
          const { body } = await request(app)
            .patch("/api/users/1")
            .send({
              first_name: 1234,
              email: "new@email.com",
              phone_number: "123456789",
            })
            .expect(400);

          expect(body.msg).toBe("Invalid payload value data type.");
        });

        test(`returns with 404 and msg if user_id is not in db`, async () => {
          const { body } = await request(app)
            .patch("/api/users/1000")
            .send({ first_name: "John" })
            .expect(404);

          expect(body.msg).toBe("Data not found.");
        });

        test(`returns with 400 and msg if id is invalid data type`, async () => {
          const { body } = await request(app)
            .patch("/api/users/notanumber")
            .send({ first_name: "John" })
            .expect(400);

          expect(body.msg).toBe("Invalid id data type.");
        });
      });

      describe("functionality", () => {
        test("returns with a single user object, with correct keys/values", async () => {
          const validKeys = [
            "user_id",
            "first_name",
            "surname",
            "email",
            "phone_number",
            "is_host",
            "avatar",
            "created_at",
          ];

          const { body } = await request(app).patch("/api/users/1").send({
            first_name: "John",
            email: "new@email.com",
            phone_number: "123456789",
          });
          const user = body.user;

          expect(user).toBeObject();
          for (const key in user) {
            expect(validKeys.includes(key)).toBeTrue();
          }

          // Alice Johnson - User 1
          expect(user.user_id).toBe(1);
          expect(user.first_name).toBe("John");
          expect(user.surname).toBe("Johnson");
          expect(user.email).toBe("new@email.com");
          expect(user.phone_number).toBe("123456789");
          expect(user.is_host).toBeTrue();
          expect(user.avatar).toBe("https://example.com/images/alice.jpg");
        });
      });
    });
  });
});
