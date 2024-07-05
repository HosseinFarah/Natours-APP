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
const cors = require('cors');
const { webhookCheckout } = require('./controllers/bookingController');

const app = express();

// Enable compression for response size optimization
app.use(compression());

// Enable CORS for all routes
app.use(cors());
app.options('*', cors());

// Set security headers with Content Security Policy
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
        'https://code.jquery.com',
        'https://cdn.jsdelivr.net',
        'https://maxcdn.bootstrapcdn.com',
        // Add other script sources as needed
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


// Parse cookies
app.use(cookieParser());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution attacks
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

// Configure trusted proxies (specific to your deployment environment, update as necessary)
app.set('trust proxy', 'loopback');
// Mongo Sanitizer
app.use(sanitizer())
// Rate limiting middleware
const limiter = rateLimiter({
  max: 200, // Max requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Stripe webhook endpoint
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout,
);

// Parse incoming requests with JSON payloads
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static files (e.g., CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Set up Pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware to add timestamp to request object
app.use((req, res, next) => {
  req.date = new Date().toISOString();
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handle invalid paths
app.all('*', (req, res, next) => {
  next(new AppErr('Invalid Path!', 404));
});

// Error handling middleware
app.use(errorController);

module.exports = app;
