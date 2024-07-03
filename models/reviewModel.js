const mongoose = require('mongoose');

const Tour = require('./../models/tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true],
      minlength: [2],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true],
      min: [1],
      max: [5],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate('user').populate('tour');
  next();
});

reviewSchema.statics.calcRatingsAverage = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        count: { $sum: 1 },
        average: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].count,
      ratingsAverage: stats[0].average,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcRatingsAverage(this.tour);
});

/* reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne()
  next();
}); */

reviewSchema.post(/^findOneAndUpdate/, async function (doc) {
  if (doc) {
    await doc.constructor.calcRatingsAverage(doc.tour);
  }
});
reviewSchema.post(/^findOneAndDelete/, async function (doc) {
  if (doc) {
    await doc.constructor.calcRatingsAverage(doc.tour);
  }
});


/* reviewSchema.post(/^findOneAnd/,async function(){
  await this.r.constructor.calcRatingsAverage(this.r.tour)
})
 */
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
