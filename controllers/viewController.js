const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppErr = require('./../utils/AppErr');
const APIFeatures = require('../utils/APIFeatures');

exports.getOvewviewPage = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Tour.find(), req.query)
    .search()
    .sort()
    .fields()
    .paginate()
    .sort();
  const tours = await feature.query;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  res.status(200).render('overview', {
    title: 'All Tours!',
    tours,
    currentPath: req.path,
    pagination: {
      nextPage: tours.length>=limit*page ? parseInt(page) + 1:null ,
      prevPage: parseInt(page - 1) >= 1 ? parseInt(page - 1) : null,
      limit,
    }
  });
});
exports.getTourDetailes = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate('Bookings')
    .populate('Reviews');
  let reviewUser;
  let bookedUser;
  if (res.locals.user) {
    bookedUser = tour.Bookings.find((el) => el.user.id === res.locals.user.id);
    reviewUser = tour.Reviews.find((el) => el.user.id === res.locals.user.id);
  }

  if (!tour) return next(new AppErr('Invalid tour name!', 400));
  res.status(200).render('tour', {
    title: tour.name,
    tour,
    bookedUser,
    reviewUser,
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
  const feature = new APIFeatures(User.find(), req.query)
    .fields()
    .filter()
    .search()
    .sort()
    .paginate();
  const users = await feature.query;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  res.status(200).render('manageUsers', {
    title: 'Manage All Users',
    users,
    pagination: {
      nextPage: users.length>=limit ? parseInt(page) + 1 : null,
      prevPage: parseInt(page) - 1 >= 1 ? parseInt(page) - 1 : null,
      limit: limit,
    },
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
  const feature = new APIFeatures(Booking.find(), req.query).paginate();
  const bookings = await feature.query;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  res.status(200).render('manageBookings', {
    title: 'All reserved Bookings',
    bookings,
    pagination: {
      nextPage: bookings.length >= limit ? parseInt(page) + 1 : null,
      prevPage: parseInt(page) - 1 >= 1 ? parseInt(page) - 1 : null,
      limit,
    },
  });
});

exports.getAllReviewsByAdmin = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Review.find(), req.query).paginate();
  const reviews = await feature.query;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  res.status(200).render('manageReviews', {
    title: 'All Reviews',
    reviews,
    pagination: {
      nextPage: reviews.length >= limit ? parseInt(page) + 1 : null,
      prevPage: parseInt(page) - 1 >= 1 ? parseInt(page) - 1 : null,
      limit,
    },
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
  const feature = new APIFeatures(Tour.find(), req.query);
  const tours = await feature.query;
  const page = req.query.page || 1;
  const limit = req.query.limit || 8;
  res.status(200).render('allTours', {
    title: 'All Tours',
    tours,
    pagination: {
      nextPage: tours.length >= page*limit ? parseInt(page) + 1 : null,
      prevPage: parseInt(page) - 1 >= 1 ? parseInt(page) - 1 : null,
      limit,
    },
  });
});
exports.getTourInfoPageForAdmin = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new AppErr('Invalid Tour', 400));
  res.status(200).render('tourInfo', {
    title: tour.name,
    tour,
  });
});
exports.getNewUserPage = (req, res, next) => {
  res.status(200).render('newUser', {
    title: 'Create New User',
  });
};
exports.getCreateNewTourPage=(req,res,next)=>{
  res.status(200).render('newTour',{
    title:'Create new tour'
  })
}