const formatFavsData = require("../../db/utils/format-favs.js");

describe("formatFavsData", () => {
  const testUsersRef = {
    "Frank White": 1,
    "Bob Smith": 2,
    "Rachel Cummings": 3,
  };

  const testPropertiesRef = {
    "Modern Apartment in City Center": 1,
    "Cosy Family House": 2,
    "Chic Studio Near the Beach": 3,
    "Elegant City Apartment": 4,
    "Charming Studio Retreat": 5,
    "Luxury Penthouse with View": 6,
  };

  const testFavsData = [
    {
      guest_name: "Bob Smith",
      property_name: "Modern Apartment in City Center",
    },
    {
      guest_name: "Rachel Cummings",
      property_name: "Cosy Family House",
    },
    {
      guest_name: "Frank White",
      property_name: "Chic Studio Near the Beach",
    },
    {
      guest_name: "Rachel Cummings",
      property_name: "Elegant City Apartment",
    },
    {
      guest_name: "Rachel Cummings",
      property_name: "Charming Studio Retreat",
    },
    {
      guest_name: "Bob Smith",
      property_name: "Luxury Penthouse with View",
    },
  ];

  let returnedArray = [];
  beforeEach(() => {
    returnedArray = formatFavsData(
      testFavsData,
      testUsersRef,
      testPropertiesRef
    );
  });

  test("should return an array", () => {
    expect(returnedArray).toBeArray();
  });
  test("should return an array of nested objects", () => {
    for (let elem of returnedArray) {
      expect(elem).toBeObject();
    }
  });
  test("should return array of objects without property_name/guest_name keys", () => {
    for (let elem of returnedArray) {
      expect(elem).not.toContainKey("property_name");
      expect(elem).not.toContainKey("guest_name");
    }
  });
  test("should return array of objects with guest_id/property_id keys", () => {
    for (let elem of returnedArray) {
      expect(elem).toContainKey("guest_id");
      expect(elem).toContainKey("property_id");
    }
  });
  test("guest_id keys should be mapped to corresponding values from passed users ref obj", () => {
    // Test data should add 2, 3, 1, 3, 3, 2
    expect(returnedArray[0].guest_id).toBe(2);
    expect(returnedArray[1].guest_id).toBe(3);
    expect(returnedArray[2].guest_id).toBe(1);
    expect(returnedArray[3].guest_id).toBe(3);
    expect(returnedArray[4].guest_id).toBe(3);
    expect(returnedArray[5].guest_id).toBe(2);
  });
  test("property_id keys should be mapped to corresponding values from passed properties ref obj", () => {
    // Test data should add 1, 2, 3, 4, 5, 6
    expect(returnedArray[0].property_id).toBe(1);
    expect(returnedArray[1].property_id).toBe(2);
    expect(returnedArray[2].property_id).toBe(3);
    expect(returnedArray[3].property_id).toBe(4);
    expect(returnedArray[4].property_id).toBe(5);
    expect(returnedArray[5].property_id).toBe(6);
  });
  test("should not mutate original JSON data", () => {
    const copyOfTestFavsData = [
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
      },
      {
        guest_name: "Rachel Cummings",
        property_name: "Cosy Family House",
      },
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
      },
      {
        guest_name: "Rachel Cummings",
        property_name: "Elegant City Apartment",
      },
      {
        guest_name: "Rachel Cummings",
        property_name: "Charming Studio Retreat",
      },
      {
        guest_name: "Bob Smith",
        property_name: "Luxury Penthouse with View",
      },
    ];
    expect(testFavsData).toEqual(copyOfTestFavsData);
  });
});
