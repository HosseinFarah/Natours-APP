const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });
const mongoose = require('mongoose');
const User = require('./../models/userModel');
const Tour = require('./../models/tourModel');
const Review = require('./../models/reviewModel');

const allTours = JSON.parse(
  fs.readFileSync('./../Dev-data/data/tours.json', 'utf-8'),
);
const allusers = JSON.parse(
  fs.readFileSync('./../Dev-data/data/users.json', 'utf-8'),
);
const allReviews = JSON.parse(
  fs.readFileSync('./../Dev-data/data/reviews.json', 'utf-8'),
);
const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASS);
mongoose
  .connect(DB)
  .then(() => {
    console.log('DB Successfully Connected!');
  })
  .catch((err) => {
    console.log(err);
  });

const importDb = async () => {
  try {
    await Tour.create(allTours,{validateBeforeSave: false});
    await User.create(allusers,{validateBeforeSave: false});
    await Review.create(allReviews,{validateBeforeSave: false});
    console.log('Db Imported!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const delDb = async () => {
  try {
    await User.deleteMany();
    await Tour.deleteMany();
    await Review.deleteMany();
    console.log('Db Deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importDb();
} else if (process.argv[2] === '--delete') {
  delDb();
}
