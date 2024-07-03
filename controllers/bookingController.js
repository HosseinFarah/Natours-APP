const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const factoryHandller = require('./factoryHandller');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getBookings = factoryHandller.getAll(Booking);
exports.newBooking = factoryHandller.createOne(Booking);
exports.getBooking = factoryHandller.getOne(Booking);
exports.updateBooking = factoryHandller.updateOne(Booking);
exports.deleteBooking = factoryHandller.deleteOne(Booking);

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    client_reference_id: req.user.id,
    success_url: `${req.protocol}://${req.get('host')}/my-bookings/?tour=${tour._id}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: tour.name,
            description: tour.summary,
          },
        },
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  });
});
exports.purchasedTour = async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!user && !tour && !price) return next();
  await Booking.create({ user, tour, price });
  res.redirect(req.originalUrl.split('?')[0]);
};

