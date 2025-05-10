const reviewsSchema = `CREATE TABLE reviews(
  review_id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties,
  guest_id INT NOT NULL, FOREIGN KEY (guest_id) REFERENCES users(user_id),
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`;

exports.reviewsSchema = reviewsSchema;
