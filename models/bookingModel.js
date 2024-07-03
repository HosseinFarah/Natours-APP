const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'tour must obligate a tour id!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'user must obligate a tour id!'],
  },
  paid: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    require: [true],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
/*   fingerprint: String, */
});
bookingSchema.pre(/^find/, function (next) {
  this.populate('tour').populate('user');
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
