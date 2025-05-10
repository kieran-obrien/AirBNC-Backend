const formatJSONdata = (data) => {
  return data.map((row) => {
    return Object.values(row);
  });
};

module.exports = formatJSONdata;
