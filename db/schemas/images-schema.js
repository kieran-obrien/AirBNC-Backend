const imagesSchema = `CREATE TABLE images(
  image_id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties,
  image_url VARCHAR NOT NULL,
  alt_text VARCHAR NOT NULL
);`;

exports.imagesSchema = imagesSchema;
