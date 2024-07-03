const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require('./../controllers/authController');
const {
  deleteReview,
  getReview,
  getReviews,
  newReview,
  updateReview,
  chkTourAndUser,
} = require('./../controllers/reviewController');


router
  .route('/')
  .get(protect, restrictTo('admin'), getReviews)
  .post(protect, restrictTo('admin','guide', 'user'), chkTourAndUser, newReview);
router
  .route('/:id')
  .get(protect, getReview)
  .patch(protect, updateReview)
  .delete(protect, restrictTo('admin', 'user'), deleteReview);


module.exports = router;
