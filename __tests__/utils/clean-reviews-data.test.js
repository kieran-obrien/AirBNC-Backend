const cleanReviewsData = require("../../db/utils/clean-reviews-data");

describe("cleanReviewsData", () => {
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

  const testReviewsData = [
    {
      guest_name: "Frank White",
      property_name: "Chic Studio Near the Beach",
      rating: 4,
      comment:
        "Comment about Chic Studio Near the Beach: Great location and cosy space, perfect for a beach getaway.",
    },
    {
      guest_name: "Bob Smith",
      property_name: "Modern Apartment in City Center",
      rating: 2,
      comment:
        "Comment about Modern Apartment in City Center: Too noisy at night, and the apartment felt cramped. Wouldn’t stay again.",
    },
    {
      guest_name: "Rachel Cummings",
      property_name: "Luxury Penthouse with View",
      rating: 5,
      comment:
        "Comment about Luxury Penthouse with View: Incredible property! The view from the penthouse is stunning.",
    },
    {
      guest_name: "Frank White",
      property_name: "Elegant City Apartment",
      rating: 2,
      comment:
        "Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable.",
    },
    {
      guest_name: "Bob Smith",
      property_name: "Charming Studio Retreat",
      rating: 4,
      comment:
        "Comment about Charming Studio Retreat: Loved the ambiance and decor, but had some issues with the Wi-Fi connection.",
    },
  ];

  let returnedArray = [];
  beforeEach(() => {
    returnedArray = cleanReviewsData(
      testReviewsData,
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
  test("guest_id keys should be mapped to corresponding values from passed users array", () => {
    // Test data should add 1, 2, 3, 1, 2
    expect(returnedArray[0].guest_id).toBe(1);
    expect(returnedArray[1].guest_id).toBe(2);
    expect(returnedArray[2].guest_id).toBe(3);
    expect(returnedArray[3].guest_id).toBe(1);
    expect(returnedArray[4].guest_id).toBe(2);
  });
  test("property_id keys should be mapped to corresponding values from passed properties array", () => {
    // Test data should add 3, 1, 3, 1, 2
    expect(returnedArray[0].property_id).toBe(3);
    expect(returnedArray[1].property_id).toBe(1);
    expect(returnedArray[2].property_id).toBe(6);
    expect(returnedArray[3].property_id).toBe(4);
    expect(returnedArray[4].property_id).toBe(5);
  });
  test("should not mutate original JSON data", () => {
    const copyOfTestReviewsData = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment:
          "Comment about Chic Studio Near the Beach: Great location and cosy space, perfect for a beach getaway.",
      },
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
        rating: 2,
        comment:
          "Comment about Modern Apartment in City Center: Too noisy at night, and the apartment felt cramped. Wouldn’t stay again.",
      },
      {
        guest_name: "Rachel Cummings",
        property_name: "Luxury Penthouse with View",
        rating: 5,
        comment:
          "Comment about Luxury Penthouse with View: Incredible property! The view from the penthouse is stunning.",
      },
      {
        guest_name: "Frank White",
        property_name: "Elegant City Apartment",
        rating: 2,
        comment:
          "Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable.",
      },
      {
        guest_name: "Bob Smith",
        property_name: "Charming Studio Retreat",
        rating: 4,
        comment:
          "Comment about Charming Studio Retreat: Loved the ambiance and decor, but had some issues with the Wi-Fi connection.",
      },
    ];
    expect(testReviewsData).toEqual(copyOfTestReviewsData);
  });
});
