const formatImagesData = require("../../db/utils/format-images.js");

describe("formatImagesData", () => {
  const testPropertiesRef = {
    "Modern Apartment in City Center": 1,
    "Cosy Family House": 2,
    "Chic Studio Near the Beach": 3,
    "Elegant City Apartment": 4,
    "Charming Studio Retreat": 5,
    "Luxury Penthouse with View": 6,
  };
  const testImagesData = [
    {
      property_name: "Modern Apartment in City Center",
      image_url: "https://example.com/images/modern_apartment_1.jpg",
      alt_tag: "Alt tag for Modern Apartment in City Center",
    },
    {
      property_name: "Modern Apartment in City Center",
      image_url: "https://example.com/images/modern_apartment_3.jpg",
      alt_tag: "Alt tag for Modern Apartment in City Center 2",
    },
    {
      property_name: "Modern Apartment in City Center",
      image_url: "https://example.com/images/modern_apartment_3.jpg",
      alt_tag: "Alt tag for Modern Apartment in City Center 3",
    },
    {
      property_name: "Cosy Family House",
      image_url: "https://example.com/images/cosy_family_house_1.jpg",
      alt_tag: "Alt tag for Cosy Family House",
    },
    {
      property_name: "Chic Studio Near the Beach",
      image_url: "https://example.com/images/chic_studio_1.jpg",
      alt_tag: "Alt tag for Chic Studio Near the Beach",
    },
  ];

  let returnedArray = [];
  beforeEach(() => {
    returnedArray = formatImagesData(testImagesData, testPropertiesRef);
  });

  test("should return an array", () => {
    expect(returnedArray).toBeArray();
  });
  test("should return an array of nested objects", () => {
    for (let elem of returnedArray) {
      expect(elem).toBeObject();
    }
  });
  test("should return array of objects without alt_tag key", () => {
    for (let elem of returnedArray) {
      expect(elem).not.toContainKey("alt_tag");
    }
  });
  test("should return array of objects with alt_text key", () => {
    for (let elem of returnedArray) {
      expect(elem).toContainKey("alt_text");
    }
  });
  test("property_id keys should be mapped to corresponding values from passed properties ref obj", () => {
    // Test data should add 1, 1, 1, 2, 3
    expect(returnedArray[0].property_id).toBe(1);
    expect(returnedArray[1].property_id).toBe(1);
    expect(returnedArray[2].property_id).toBe(1);
    expect(returnedArray[3].property_id).toBe(2);
    expect(returnedArray[4].property_id).toBe(3);
  });
  test("should not mutate original JSON data", () => {
    const copyOfTestData = [
      {
        property_name: "Modern Apartment in City Center",
        image_url: "https://example.com/images/modern_apartment_1.jpg",
        alt_tag: "Alt tag for Modern Apartment in City Center",
      },
      {
        property_name: "Modern Apartment in City Center",
        image_url: "https://example.com/images/modern_apartment_3.jpg",
        alt_tag: "Alt tag for Modern Apartment in City Center 2",
      },
      {
        property_name: "Modern Apartment in City Center",
        image_url: "https://example.com/images/modern_apartment_3.jpg",
        alt_tag: "Alt tag for Modern Apartment in City Center 3",
      },
      {
        property_name: "Cosy Family House",
        image_url: "https://example.com/images/cosy_family_house_1.jpg",
        alt_tag: "Alt tag for Cosy Family House",
      },
      {
        property_name: "Chic Studio Near the Beach",
        image_url: "https://example.com/images/chic_studio_1.jpg",
        alt_tag: "Alt tag for Chic Studio Near the Beach",
      },
    ];
    expect(testImagesData).toEqual(copyOfTestData);
  });
});
