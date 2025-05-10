const testDb = require("./testDb-connection.js");

const format = require("pg-format");

// Database Data
const {
  usersData,
  reviewsData,
  propertyTypesData,
  propertiesData,
  imagesData,
  favouritesData,
  bookingsData,
} = require("./index.js");

// Database Schemas
const { propertyTypesSchema } = require("./schemas/property-types-schema");
const { usersSchema } = require("./schemas/users-schema");
const { reviewsSchema } = require("./schemas/reviews-schema.js");
const { propertiesSchema } = require("./schemas/properties-schema.js");

// Utils
const formatJSONdata = require("../utils/format-JSON-data.js");
const formatHosts = require("../utils/format-hosts.js");
const cleanPropertiesData = require("../utils/clean-properties-data.js");
const cleanReviewsData = require("../utils/clean-reviews-data.js");

async function seedTestDatabase() {
  try {
    // Delete all tables
    await testDb.query("DROP OWNED BY current_user;");

    // Add tables
    await testDb.query(propertyTypesSchema);
    await testDb.query(usersSchema);
    await testDb.query(propertiesSchema);
    await testDb.query(reviewsSchema);

    // Seed tables
    // Property_types
    await testDb.query(
      format(
        `INSERT INTO 
      property_types(property_type, description)
      VALUES %L`,
        formatJSONdata(propertyTypesData)
      )
    );

    // Users
    const hostFormattedUsersData = formatHosts(usersData);
    const { rows: insertedUsers } = await testDb.query(
      format(
        `INSERT INTO
        users(first_name, surname, email, phone_number, is_host, avatar)
        VALUES %L
        RETURNING user_id, first_name, surname`,
        formatJSONdata(hostFormattedUsersData)
      )
    );

    // Quick format insertedUsers
    for (const user of insertedUsers) {
      user.full_name = user.first_name + " " + user.surname;
      delete user.first_name;
      delete user.surname;
    }

    // Properties
    const cleanedPropertiesData = cleanPropertiesData(
      propertiesData,
      insertedUsers
    );
    const { rows: insertedProperties } = await testDb.query(
      format(
        `INSERT INTO
        properties(host_id, name, location, property_type, price_per_night, description)
        VALUES %L
        RETURNING property_id, name`,
        formatJSONdata(cleanedPropertiesData, [
          "host_id",
          "name",
          "location",
          "property_type",
          "price_per_night",
          "description",
        ])
      )
    );

    // Reviews
    const cleanedReviewsData = cleanReviewsData(
      reviewsData,
      insertedUsers,
      insertedProperties
    );
    await testDb.query(
      format(
        `INSERT INTO
        reviews(property_id, guest_id, rating, comment)
        VALUES %L`,
        formatJSONdata(cleanedReviewsData, [
          "property_id",
          "guest_id",
          "rating",
          "comment",
        ])
      )
    );

    testDb.end();
  } catch (error) {
    console.log("Error seeding the database:", error);
  }
}

seedTestDatabase();
