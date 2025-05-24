const cleanPropertiesData = (propertiesData, usersRef) => {
  const copiedPropertiesData = JSON.parse(JSON.stringify(propertiesData));
  for (const property of copiedPropertiesData) {
    delete property.amenities;
    property.host_id = usersRef[property.host_name];
  }
  return copiedPropertiesData;
};

module.exports = cleanPropertiesData;
