const AppErr = require('./../utils/AppErr');

const handleDuplicateValDB = (err) => {
  const message = `${err.message}`.match(/"([^"]*)"/g);
  return new AppErr(`Duplicate value for: ${message}`, 400);
};
const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors);
  return new AppErr(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);
const sendErrDev = (req, err, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Somthing went wrong!',
      message: err.stack,
    });
  }
};
const sendErrProd = (req, err, res) => {
  if(req.originalUrl.startsWith('/api')){
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.log('ERROR 💥', err);
      res.status(500).json({
        status: 'Fetal error!',
        message: 'Somthing went wrong! Please try later!',
      });
    }
  }else{
    if (err.isOperational) {
      res.status(err.statusCode).render({
        title: 'Somthing went wrong!!!',
        message: err.message,
      });
    } else {
      console.log('ERROR 💥', err);
      res.status(500).render({
        status: 'Fetal error!',
        message: 'Somthing went wrong! Please try later!',
      });
  }
}};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'ERROR!';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(req, err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err,
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
    if (error.code === 11000) error = handleDuplicateValDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrProd(req, error, res);
  }
}
