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
