const db = require("../../db/connection");

exports.insertFavouriteById = async (payload, id) => {
  const { guest_id } = payload;

  const isPropIdNumber = Number.isNaN(Number(id)) ? false : true;
  if (!isPropIdNumber)
    return Promise.reject({
      status: 400,
      msg: "Bad request, id must be number.",
    });

  const {
    rows: [favourite],
  } = await db.query(
    `INSERT INTO favourites (guest_id, property_id)
   VALUES ($1, $2)
   RETURNING favourite_id`,
    [guest_id, id]
  );

  return { msg: "Property favourited successfully.", ...favourite };
};

exports.validateFavouritePayload = (payload) => {
  const errorMsg = {
    status: 400,
    msg: "Invalid payload.",
  };
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const payloadEntries = Object.entries(payload);
    if (
      payloadEntries.length !== 1 ||
      payloadEntries[0][0] !== "guest_id" ||
      typeof payloadEntries[0][1] !== "number"
    ) {
      throw errorMsg;
    }
  } else {
    throw errorMsg;
  }
};

exports.deleteFavourite = async (id) => {
  console.log(id);
};
