const cleanReviewsData = (reviewsData, usersRef, propertiesRef) => {
  const copiedReviewsData = JSON.parse(JSON.stringify(reviewsData));
  for (const review of copiedReviewsData) {
    review.guest_id = usersRef[review.guest_name];
    delete review.guest_name;
    review.property_id = propertiesRef[review.property_name];
    delete review.property_name;
  }
  return copiedReviewsData;
};

module.exports = cleanReviewsData;
