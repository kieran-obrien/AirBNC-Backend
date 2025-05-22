const columnOrder = ["property_type", "description"];

const formatJSONdata = (data, columnOrder) => {
  if (!columnOrder) {
    return data.map((row) => {
      return Object.values(row);
    });
  } else {
    return data.map((row) => {
      return columnOrder.map((column) => {
        return row[column];
      });
    });
  }
};

module.exports = formatJSONdata;
