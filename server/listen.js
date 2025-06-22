const app = require("./app");

const { PORT = 8888 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
