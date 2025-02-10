const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const { Worker } = require('worker_threads');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const logger = require('./config/logger');
// Import the worker file
const app = express();

function startCdnWorker() {
  const workerFilePath = path.resolve(__dirname, 'cdn.worker.js'); // Resolves to an absolute path
  return new Worker(workerFilePath); // Pass absolute path to Worker
}

// // Initialize the worker for CDN switching (starts as soon as the server runs)
// const worker = startCdnWorker();
// worker.on('message', (msg) => {
//   logger.info('Message from CDN worker:', msg);  // You can log messages from the worker here
// });

// worker.on('error', (error) => {
//   logger.error('Worker encountered an error:', error);
// });

// worker.on('exit', (code) => {
//   if (code !== 0) {
//     logger.error(`Worker stopped with exit code ${code}`);
//   }
// });

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
