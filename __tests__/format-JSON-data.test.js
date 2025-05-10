const formatJSONdata = require("../db/data/utils/format-JSON-data");

describe("formatJSONdata", () => {
  const testJSON = [
    {
      property_type: "Apartment",
      description: "Description of Apartment.",
    },
    {
      property_type: "House",
      description: "Description of House.",
    },
    {
      property_type: "Studio",
      description: "Description of Studio.",
    },
  ];

  test("should return an array", () => {
    expect(formatJSONdata(testJSON)).toBeArray();
  });
  test("should return an array, length equal to num of objects in JSON data", () => {
    expect(formatJSONdata(testJSON).length).toBe(testJSON.length);
  });
  test("should return array of nested arrays, each length equal to num of properties in JSON objects", () => {
    expect(formatJSONdata(testJSON)[0]).toBeArray();
    expect(formatJSONdata(testJSON)[0].length).toBe(
      Object.keys(testJSON[0]).length
    );
  });
  test("should return expected values inside nested arrays (JSON objects values mapped in passed order)", () => {
    expect(formatJSONdata(testJSON)[0]).toEqual([
      "Apartment",
      "Description of Apartment.",
    ]);
  });
  test("should not mutate original JSON data", () => {
    const copyOfTestData = [
      {
        property_type: "Apartment",
        description: "Description of Apartment.",
      },
      {
        property_type: "House",
        description: "Description of House.",
      },
      {
        property_type: "Studio",
        description: "Description of Studio.",
      },
    ];
    formatJSONdata(testJSON);
    expect(testJSON).toEqual(copyOfTestData);
  });
});
