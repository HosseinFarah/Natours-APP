const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
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
    client_reference_id: req.params.id,
    success_url: `${req.protocol}://${req.get('host')}/my-bookings/`,
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

const purchasedTour = async (session) => {
  try {
    const tour = session.client_reference_id;
    const userDoc = await User.findOne({ email: session.customer_email });
    if (!userDoc) {
      throw new Error('User not found');
    }
    const user = userDoc.id;
    const price = (await Tour.findById(tour)).price;
    console.log('Booking details:', tour, user, price); // Ensure this log statement is reachable
    await Booking.create({ tour, user, price });
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error; // Make sure to re-throw or handle the error appropriately
  }
};


exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_SIGNING_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    purchasedTour(event.data.object);
  }

  res.status(200).json({ received: true });
};

/* exports.purchasedTour = async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!user && !tour && !price) return next();
  await Booking.create({ user, tour, price });
  res.redirect(req.originalUrl.split('?')[0]);
};
 */
