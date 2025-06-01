const db = require("../../db/connection");

exports.selectUserById = async (id) => {
  const isUserIdNumber = Number.isNaN(Number(id)) ? false : true;
  if (!isUserIdNumber)
    return Promise.reject({ status: 400, msg: "Invalid id data type." });

  const {
    rows: [user],
  } = await db.query(
    `
    SELECT * FROM users WHERE user_id = $1;
    `,
    [id]
  );

  const userIdInDb = user === undefined ? false : true;
  if (!userIdInDb)
    return Promise.reject({ status: 404, msg: "Data not found." });

  return user;
};

exports.updateUserById = async (id, payload) => {
  const isUserIdNumber = Number.isNaN(Number(id)) ? false : true;
  if (!isUserIdNumber)
    return Promise.reject({ status: 400, msg: "Invalid id data type." });

  const payloadKeys = Object.keys(payload);
  const payloadValues = Object.values(payload);

  const setClause = payloadKeys
    .map((key, i) => `${key} = $${i + 2}`)
    .join(", ");

  const {
    rows: [user],
  } = await db.query(
    `
    UPDATE users
    SET ${setClause}
    WHERE user_id = $1
    RETURNING *;`,
    [id, ...payloadValues]
  );

  const userIdInDb = user === undefined ? false : true;
  if (!userIdInDb)
    return Promise.reject({ status: 404, msg: "Data not found." });

  return user;
};

exports.validateUpdateUserPayload = async (payload) => {
  if (!payload)
    return Promise.reject({ status: 400, msg: "Must provide payload." });

  const payloadKeys = Object.keys(payload);
  const validPayloadKeys = [
    "first_name",
    "surname",
    "email",
    "phone_number",
    "avatar",
  ];

  if (payloadKeys.length < 1) {
    return Promise.reject({ status: 400, msg: "Invalid payload." });
  } else if (!payloadKeys.every((key) => validPayloadKeys.includes(key)))
    return Promise.reject({ status: 400, msg: "Invalid payload." });
  else if (!payloadKeys.every((key) => typeof payload[key] === "string"))
    return Promise.reject({
      status: 400,
      msg: "Invalid payload value data type.",
    });
};
