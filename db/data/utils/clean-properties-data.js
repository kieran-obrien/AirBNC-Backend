const cleanPropertiesData = (propertiesData, insertedUsers) => {
  const copiedPropertiesData = JSON.parse(JSON.stringify(propertiesData));
  console.log(insertedUsers);
  for (const property of copiedPropertiesData) {
    delete property.amenities;
    for (const user of insertedUsers) {
      if (user.full_name === property.host_name) {
        property.host_id = user.user_id;
      }
    }
  }
  return copiedPropertiesData;
};

module.exports = cleanPropertiesData;
