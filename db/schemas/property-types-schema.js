const propertyTypesSchema = `CREATE TABLE property_types(
  property_type VARCHAR PRIMARY KEY NOT NULL,
  description TEXT NOT NULL
);`;

exports.propertyTypesSchema = propertyTypesSchema;
