const formatImagesData = (imagesData, propertiesRef) => {
  // Create a deep copy
  const copiedImagesData = JSON.parse(JSON.stringify(imagesData));
  for (const image of copiedImagesData) {
    image.property_id = propertiesRef[image.property_name];
    delete image.property_name;
    image.alt_text = image.alt_tag;
    delete image.alt_tag;
  }
  return copiedImagesData;
};

module.exports = formatImagesData;
