const catchAsync = require('./../utils/catchAsync');
const AppErr = require('./../utils/AppErr');
const APIFeatures = require('./../utils/APIFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const feature = new APIFeatures(Model.find(filter), req.query)
      .fields()
      .filter()
      .paginate()
      .sort();
    const doc = await feature.query;
    res.status(200).json({
      status: 'success',
      date: req.date,
      length: doc.length,
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppErr(`Invalid ${doc} Id!`, 400));
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const userData = { ...req.body };
    if(!req.file){
      delete userData.photo
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, userData, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppErr(`Invalid ${doc} Id!`, 400));
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppErr(`Invalid ${doc} Id!`, 400));
    res.status(204).json({
      status: 'success',
    });
  });
