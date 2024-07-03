const catchAsync = require('../utils/catchAsync');
const factoryHandller = require('./../controllers/factoryHandller');
const Review = require('./../models/reviewModel');

exports.chkTourAndUser = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getReviews = factoryHandller.getAll(Review);
exports.getReview = factoryHandller.getOne(Review);
exports.newReview = factoryHandller.createOne(Review);
exports.updateReview = factoryHandller.updateOne(Review);
exports.deleteReview = factoryHandller.deleteOne(Review);

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });
  res.status(200).render('reviews',{
    title:'my-reviews',
    reviews
  })
});
