const express = require('express');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const bookingRouter = require('./routes/bookingRouter');
const viewRouter = require('./routes/viewRouter');
const errorController = require('./controllers/errorController');
const AppErr = require('./utils/AppErr');
const path = require('path');
const rateLimiter = require('express-rate-limit');
const sanitizer = require('express-mongo-sanitize');
const hpp = require('hpp');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cros = require('cros');
const { webhookCheckout } = require('./controllers/bookingController');

const app = express();
app.use(compression());
app.use(cros());
app.options('*', cros());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: [
        "'self'",
        'https://*.cloudflare.com',
        'https://*.stripe.com',
        'https://*.mapbox.com',
      ],
      frameSrc: ["'self'", 'https://*.stripe.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      workerSrc: ["'self'", 'data:', 'blob:'],
      childSrc: ["'self'", 'blob:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
      upgradeInsecureRequests: [],
    },
  }),
);
app.use(cookieParser());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'name',
      'duration',
      'price',
      'ratingsAverage',
      'duration',
      'maxGroupSize',
    ],
  }),
);
const limiter = rateLimiter({
  max: 200,
  windowMs: 60000,
  message: 'to many attemp! try again after 60s!',
});
app.use(sanitizer());
app.use('/api', limiter);

//stripe webhook
app.post('/webhook-checkout', express.raw({type:'application/json'}), webhookCheckout);

app.use(express.json({ limit: '10kb' }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  req.date = new Date().toISOString();
  next();
});
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppErr('Invalid Path!', 404));
});
app.use(errorController);

module.exports = app;
