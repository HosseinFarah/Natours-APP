const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppErr = require('./../utils/AppErr');
const APIFeatures = require('./../utils/APIFeatures');
const multer = require('multer');
const sharp = require('sharp');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Tour.find(), req.query)
    .fields()
    .filter()
    .paginate()
    .sort();
  const tours = await feature.query;
  res.status(200).json({
    status: 'success',
    date: req.date,
    length: tours.length,
    data: {
      tours,
    },
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
    .populate('Reviews')
    .populate('Bookings');

  if (!tour) return next(new AppErr('Invalid Id!', 400));
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
exports.newTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppErr('Invalid Imgae type', 400), false);
    }
  },
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeUploadTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover) return next();

  req.body.imageCover = `Tour-Cover-${req.params.id}-${Date.now()}.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  if (!req.files.images) return next;
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const fileName = `Tour-Slide-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${fileName}`);
      req.body.images.push(fileName);
    }),
  );
  next();
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) return next(new AppErr('Invalid Id!', 400));
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) return next(new AppErr('Invalid Id!', 400));
  res.status(204).json({
    status: 'success',
  });
});
exports.getTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,price,ratingsAverage';
  next();
};

exports.getToursStats = catchAsync(async (req, res, next) => {
  const stat = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 1 },
      },
    },
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 },
        max_price: { $max: '$price' },
        avg_price: { $avg: '$price' },
        min_price: { $min: '$price' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    length: stat.length,
    data: {
      stat,
    },
  });
});
exports.getToursMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        count: { $sum: 1 },
        tours: {
          $push: {
            name: '$name',
            price: '$price',
            duration: '$duration',
          },
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { count: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    length: plan.length,
    data: {
      plan,
    },
  });
});
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    return next(new AppErr('Invalid latittiude or longitiude!', 400));
  const radios = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const toursWithin = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radios] } },
  });
  res.status(200).json({
    status: 'success',
    length: toursWithin.length,
    data: {
      toursWithin,
    },
  });
});
exports.toursDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    return next(new AppErr('Invalid latittiude or longitiude!', 400));
  const multiplier = unit === 'mi' ? 0.000621371 : 0.01;
  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'Distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        name: 1,
        Distance: 1,
      },
    },
    {
      $sort: { Distance: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    length: distance.length,
    dta: {
      distance,
    },
  });
});
