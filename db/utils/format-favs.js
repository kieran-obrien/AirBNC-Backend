const formatFavsData = (favsData, usersRef, propertiesRef) => {
  // Create a deep copy
  const copiedFavsData = JSON.parse(JSON.stringify(favsData));
  for (const fav of copiedFavsData) {
    fav.guest_id = usersRef[fav.guest_name];
    delete fav.guest_name;
    fav.property_id = propertiesRef[fav.property_name];
    delete fav.property_name;
  }
  return copiedFavsData;
};

module.exports = formatFavsData;
