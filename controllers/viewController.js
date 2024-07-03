const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppErr = require('./../utils/AppErr');

exports.getOvewviewPage = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours!',
    tours,
  });
});
exports.getTourDetailes = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    'Reviews',
  );
  if (!tour) return next(new AppErr('Invalid tour name!', 400));
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
exports.getLoginPage = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log in!',
  });
};
exports.getSignUpPage = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign Up!',
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).render('me', {
    title: req.user.name,
  });
};
exports.getUsersByAdmin = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('manageUsers', {
    title: 'Manage All Users',
    users,
  });
});
exports.getUserByAdmin = catchAsync(async (req, res, next) => {
  const selectedUser = await User.findById(req.params.userId);
  if (!selectedUser) return next(new AppErr('Invalid User Id', 403));
  res.status(200).render('userInfo', {
    title: `${selectedUser.name} Settings`,
    selectedUser,
  });
});
exports.getForgetpasswordPage = (req, res, next) => {
  res.status(200).render('forgetPassword', {
    title: 'Forget password?',
  });
};
exports.getResetPasswordPage = (req, res, next) => {
  res.status(200).render('resetPassword', {
    title: 'resetPassword',
    tokenId: req.params.tokenId,
  });
};
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map((booking) => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
exports.getReviewDetail = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return next(new AppErr('Invalid Review!', 400));
  res.status(200).render('myReviewDetail', {
    title: 'My Review details',
    reviewId: req.params.reviewId,
    review,
  });
});

exports.getReviewDetailByAdmin = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return next(new AppErr('Invalid Review!', 400));
  res.status(200).render('reviewDetail', {
    title: 'Review details',
    reviewId: req.params.reviewId,
    review,
  });
});
exports.getAllBookingsByAdmin = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).render('manageBookings', {
    title: 'All reserved Bookings',
    bookings,
  });
});

exports.getAllReviewsByAdmin = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).render('manageReviews', {
    title: 'All Reviews',
    reviews,
  });
});

exports.getBookingInfo = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) return next(new AppErr('Invalid Booking', 400));
  res.status(200).render('bookingInfo', {
    title: 'Booking Info',
    booking,
  });
});

exports.getAllToursByAdmin = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('allTours', {
    title: 'All Tours',
    tours,
  });
});
exports.getTourInfoPageForAdmin=catchAsync(async(req,res,next)=>{
  const tour=await Tour.findById(req.params.tourId)
  if (!tour) return next(new AppErr('Invalid Tour', 400));
  res.status(200).render('tourInfo',{
    title: tour.name,
    tour
  })
})