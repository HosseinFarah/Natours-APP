const express = require('express');
const {
  getOvewviewPage,
  getTourDetailes,
  getLoginPage,
  getSignUpPage,
  getMe,
  getUsersByAdmin,
  getUserByAdmin,
  getForgetpasswordPage,
  getResetPasswordPage,
  getMyBookings,
  getReviewDetail,
  getAllReviewsByAdmin,
  getReviewDetailByAdmin,
  getAllBookingsByAdmin,
  getBookingInfo,
  getAllToursByAdmin,
  getTourInfoPageForAdmin
} = require('../controllers/viewController');
const {
  isLoggedIn,
  protect,
  restrictTo,
} = require('../controllers/authController');
const { getMyReviews } = require('../controllers/reviewController');
const router = express.Router();

router.get('/', isLoggedIn, getOvewviewPage);
router.route('/tour/:slug').get(isLoggedIn, getTourDetailes);
router.get('/login', isLoggedIn, getLoginPage);
router.get('/signup',getSignUpPage)
router.get('/me', isLoggedIn,protect, getMe);
router.get('/manage-users', protect, restrictTo('admin'), getUsersByAdmin);
router.get('/manage-reviews',protect, getAllReviewsByAdmin);
router.get('/manage-bookings',protect, getAllBookingsByAdmin);
router.get('/manage-tours',protect, getAllToursByAdmin);
router.get('/tour-info/:tourId',protect, getTourInfoPageForAdmin);
router.get('/booking-info/:bookingId',protect, getBookingInfo);
router.get('/edit-review/:reviewId',protect, getReviewDetailByAdmin);
router.get('/user-info/:userId', protect, restrictTo('admin'), getUserByAdmin);
router.get('/forgetpassword', getForgetpasswordPage);
router.get('/resetpassword/:tokenId', getResetPasswordPage);

router.get('/my-bookings', protect, getMyBookings);
router.get('/my-reviews', protect, getMyReviews);
router.get('/review/:reviewId',protect, getReviewDetail);
module.exports = router;
