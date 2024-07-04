const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppErr = require('./../utils/AppErr');
const APIFeatures = require('./../utils/APIFeatures');
const jwt = require('jsonwebtoken');
const Email = require('./../utils/mail');
const crypto = require('crypto');
const { promisify } = require('util');
const multer = require('multer');
const sharp = require('sharp');

const tokenSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createTokenResult = (req, res, user, statusCode) => {
  const token = tokenSign(user._id);
  user.password = undefined;
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure||req.headers['x-forwarded-proto']==='https',
  };

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createTokenResult(req, res, newUser, 201);
});
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppErr('Invalid Email or Password! try again!', 403));
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return next(
      new AppErr('Invalid Email or Password!!!, Please try again!', 400),
    );
  createTokenResult(req, res, user, 200);
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return next(new AppErr('Invalid Email! Please Enter your Email!', 400));
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new AppErr('Invalid Email! Check your email and try again!', 403),
    );
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
  await new Email(user, url).sendResetPassword();
  res.status(200).json({
    status: 'success',
    message: `Reset password link sent successfully to ${user.email}`,
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm)
    return next(
      new AppErr('Invalid Password or passwordConfirm!try Again!', 400),
    );
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.tokenId)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpires: { $gte: Date.now() },
  });
  if (!user) return next(new AppErr('Invalid Token or Token expired!', 403));
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  createTokenResult(req, res, user, 200);
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  const currentUser = await User.findById(decode.id);
  if (!currentUser || currentUser.isPasswordChanged(decode.iat))
    return next(
      new AppErr('Recently your password updated! Log in again!', 403),
    );
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.isPasswordCorrect(currentPassword, user.password)))
    return next(
      new AppErr(
        'Invalid currentPassword!Enter your current password correctly for updating password!',
        400,
      ),
    );
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  createTokenResult(req, res, user, 201);
});

const filteredObj = (obj, ...allowedItems) => {
  const newObj = {};
  Object.keys(obj).map((el) => {
    if (allowedItems.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppErr('Invalid file Type!', 400), false);
    }
  },
});
exports.uploadUserImage = upload.single('photo');
exports.resizeUploadUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.body.photo = `User-Image-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.body.photo}`);
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppErr('For update your password please use the below form!', 400),
    );
  const filteredBy = filteredObj(req.body, 'name', 'email');
  if (req.file) filteredBy.photo = req.body.photo;
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBy, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: {
      updateUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppErr(
          'You do not have a right permission to do this action!, Access denied!',
          403,
        ),
      );
    next();
  };
};
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_KEY,
      );
      const currentUser = await User.findById(decode.id);
      if (!currentUser) return next();
      if (currentUser.isPasswordChanged(decode.iat)) return next();
      res.locals.user = currentUser;
      req.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};
exports.logOut = (req, res, next) => {
  res.cookie('jwt', 'Loged out!', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};
