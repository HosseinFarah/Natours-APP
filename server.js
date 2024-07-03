const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

const app = require("./app");
const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASS);
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Successfully Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${process.env.PORT}...!`);
});
