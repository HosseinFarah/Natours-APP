const express = require('express');
const router = express.Router();
const {
  deleteBooking,
  getBooking,
  getBookings,
  newBooking,
  updateBooking,
  createCheckoutSession,
  getStripeResult,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('./../controllers/authController');

router.get('/checkout-session/:id', protect, createCheckoutSession);
router
  .route('/')
  .get(protect, restrictTo('admin', 'lead-guide'), getBookings)
  .post(protect, restrictTo('admin'), newBooking);
router
  .route('/:id')
  .get(protect, restrictTo('admin'), getBooking)
  .patch(protect, restrictTo('admin'), updateBooking)
  .delete(protect, restrictTo('admin'), deleteBooking);

module.exports = router;
