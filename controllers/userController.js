const factoryHandller = require('./factoryHandller');
const User = require('./../models/userModel');
const multer = require('multer');
const sharp = require('sharp');
const AppErr = require('../utils/AppErr');
const catchAsync = require('../utils/catchAsync');

exports.getUsers = factoryHandller.getAll(User);
exports.getUser = factoryHandller.getOne(User);
exports.newUser = factoryHandller.createOne(User);
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppErr('Invalid file format!', 400), false);
    }
  },
});
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUploadUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
  req.body.photo = `User-${req.user.id}-${Date.now()}-image.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.body.photo}`);
  next();
});

exports.updateUser = factoryHandller.updateOne(User);
exports.deleteUser = factoryHandller.deleteOne(User);
