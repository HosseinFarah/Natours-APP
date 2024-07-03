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

app.listen(process.env.PORT, process.env.SERVER, () => {
  console.log(`Server is ruuning on port ${process.env.PORT}...!`);
});
