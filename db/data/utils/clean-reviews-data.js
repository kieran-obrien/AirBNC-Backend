const cleanReviewsData = (reviewsData, insertedUsers, insertedProperties) => {
  const copiedReviewsData = JSON.parse(JSON.stringify(reviewsData));
  for (const review of copiedReviewsData) {
    for (const user of insertedUsers) {
      if (user.full_name === review.guest_name) {
        review.guest_id = user.user_id;
      }
    }
    delete review.guest_name;
    for (const property of insertedProperties) {
      if (property.name === review.property_name) {
        review.property_id = property.property_id;
      }
    }
    delete review.property_name;
  }
  return copiedReviewsData;
};

module.exports = cleanReviewsData;
