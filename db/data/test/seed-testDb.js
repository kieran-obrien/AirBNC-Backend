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
    await testDb.query(
      format(
        `INSERT INTO 
      property_types(property_type, description)
      VALUES %L`,
        formatJSONdata(propertyTypesData)
      )
    );

    const hostFormattedUsersData = formatHosts(usersData);
    await testDb.query(
      format(
        `INSERT INTO
        users(first_name, surname, email, phone_number, is_host, avatar)
        VALUES %L`,
        formatJSONdata(hostFormattedUsersData)
      )
    );
  } catch (error) {
    console.log("Error seeding the database:", error);
  }
}

seedTestDatabase();
