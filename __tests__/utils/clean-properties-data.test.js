const cleanPropertiesData = require("../../db/utils/clean-properties-data");

describe("cleanPropertiesData", () => {
  const testUserRef = { "Alice Johnson": 1, "Bob Smith": 2, "Emma Davis": 3 };
  const testPropertiesData = [
    {
      name: "Modern Apartment in City Center",
      property_type: "Apartment",
      location: "London, UK",
      price_per_night: 120.0,
      description: "Description of Modern Apartment in City Center.",
      host_name: "Alice Johnson",
      amenities: ["WiFi", "TV", "Kitchen"],
    },
    {
      name: "Cosy Family House",
      property_type: "House",
      location: "Manchester, UK",
      price_per_night: 150.0,
      description: "Description of Cosy Family House.",
      host_name: "Bob Smith",
      amenities: ["WiFi", "Parking", "Kitchen"],
    },
    {
      name: "Chic Studio Near the Beach",
      property_type: "Studio",
      location: "Brighton, UK",
      price_per_night: 90.0,
      description: "Description of Chic Studio Near the Beach.",
      host_name: "Alice Johnson",
      amenities: ["WiFi"],
    },
  ];

  let returnedArray = [];
  beforeEach(() => {
    returnedArray = cleanPropertiesData(testPropertiesData, testUserRef);
  });

  test("should return an array", () => {
    expect(returnedArray).toBeArray();
  });
  test("should return an array of nested objects", () => {
    for (let elem of returnedArray) {
      expect(elem).toBeObject();
    }
  });
  test("should return array of objects without amenities key", () => {
    for (let elem of returnedArray) {
      expect(elem).not.toContainKey("amenities");
    }
  });
  test("should return array of objects with host_id key", () => {
    for (let elem of returnedArray) {
      expect(elem).toContainKey("host_id");
    }
  });
  test("host_id keys should be mapped to corresponding values from passed users array", () => {
    // Test data should add 1, 2, 1
    expect(returnedArray[0].host_id).toBe(1);
    expect(returnedArray[1].host_id).toBe(2);
    expect(returnedArray[2].host_id).toBe(1);
  });
  test("should not mutate original JSON data", () => {
    const copyOfTestData = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
        amenities: ["WiFi", "TV", "Kitchen"],
      },
      {
        name: "Cosy Family House",
        property_type: "House",
        location: "Manchester, UK",
        price_per_night: 150.0,
        description: "Description of Cosy Family House.",
        host_name: "Bob Smith",
        amenities: ["WiFi", "Parking", "Kitchen"],
      },
      {
        name: "Chic Studio Near the Beach",
        property_type: "Studio",
        location: "Brighton, UK",
        price_per_night: 90.0,
        description: "Description of Chic Studio Near the Beach.",
        host_name: "Alice Johnson",
        amenities: ["WiFi"],
      },
    ];
    expect(testPropertiesData).toEqual(copyOfTestData);
  });
});
