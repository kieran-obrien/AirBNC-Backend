const formatHosts = require("../db/data/utils/format-hosts");

describe("formatHosts", () => {
  const testUsersData = [
    {
      first_name: "Alice",
      surname: "Johnson",
      email: "alice@example.com",
      phone_number: "+44 7000 111111",
      role: "host",
      avatar: "https://example.com/images/alice.jpg",
    },
    {
      first_name: "Bob",
      surname: "Smith",
      email: "bob@example.com",
      phone_number: "+44 7000 222222",
      role: "guest",
      avatar: "https://example.com/images/bob.jpg",
    },
    {
      first_name: "Emma",
      surname: "Davis",
      email: "emma@example.com",
      phone_number: "+44 7000 333333",
      role: "host",
      avatar: "https://example.com/images/emma.jpg",
    },
  ];

  test("should return an array", () => {
    expect(formatHosts(testUsersData)).toBeArray();
  });
  test("should return an array of nested objects", () => {
    const returnedArray = formatHosts(testUsersData);
    for (let elem of returnedArray) {
      expect(elem).toBeObject();
    }
  });
  test("nested objects should have same keys as original data", () => {
    const keysOfInitialData = Object.keys(testUsersData[0]);
    const returnedArray = formatHosts(testUsersData);

    expect(Object.keys(returnedArray[0])).toEqual(keysOfInitialData);
  });
  test('should change "role" keys to boolean values in relation to passed val', () => {
    // Test data should return object with true, false, true
    const returnedArray = formatHosts(testUsersData);
    expect(returnedArray[0].role).toBeTrue();
    expect(returnedArray[1].role).toBeFalse();
    expect(returnedArray[2].role).toBeTrue();
  });
  test("should not mutate original JSON data", () => {
    const copyOfTestData = [
      {
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        role: "host",
        avatar: "https://example.com/images/alice.jpg",
      },
      {
        first_name: "Bob",
        surname: "Smith",
        email: "bob@example.com",
        phone_number: "+44 7000 222222",
        role: "guest",
        avatar: "https://example.com/images/bob.jpg",
      },
      {
        first_name: "Emma",
        surname: "Davis",
        email: "emma@example.com",
        phone_number: "+44 7000 333333",
        role: "host",
        avatar: "https://example.com/images/emma.jpg",
      },
    ];
    formatHosts(testUsersData);
    expect(testUsersData).toEqual(copyOfTestData);
  });
});
