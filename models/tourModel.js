const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Name must have a value'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration must have a value'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'maxGroupSize must have a value'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty must have a value'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Invalid difficulty!',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price must have a value'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'summary must have a value'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    images: [String],
    startDates: [Date],
    startLocation: {
      description: String,
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
    },
    locations: [
      {
        description: String,
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        day: Number,
      },
    ],
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount ({VAL}) must be bigger than the ptice',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
    slug: String,
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('Reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
tourSchema.virtual('Bookings', {
  ref: 'Booking',
  foreignField: 'tour',
  localField: '_id',
});
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.virtual('Per/Week').get(function () {
  return this.duration / 7;
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name email role photo',
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
