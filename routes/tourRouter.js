const express = require('express');
const reviewRouter = require('./../routes/reviewRouter');

const {
  deleteTour,
  getAllTours,
  getTour,
  newTour,
  updateTour,
  getTopTours,
  getToursStats,
  getToursMonthlyPlan,
  getToursWithin,
  toursDistance,
  uploadTourImages,
  resizeUploadTourImages,
} = require('./../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);

router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);
router.get('/distance/:latlng/unit/:unit', toursDistance);
router.get('/top-5-tour', getTopTours, getAllTours);
router.get('/tour-stats', getToursStats);
router.get('/tour-plan/:year', getToursMonthlyPlan);
router.route('/').get(protect,getAllTours).post(protect,restrictTo('admin'),newTour);
router.route('/:id').get(protect,restrictTo('admin'),getTour).patch(protect,restrictTo('admin'),uploadTourImages,resizeUploadTourImages,updateTour).delete(protect,restrictTo('admin'),deleteTour);
module.exports = router;
