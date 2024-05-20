/* eslint-disable prefer-destructuring */
const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const AppError = require('./utils/appError');
const toursRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const authController = require('./controllers/authController');
const Tour = require('./models/tourModel');

const app = express();

// // 1)Middlewares
// Set Security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      // ...other directives...
    },
  }),
);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
    // ...
  }),
);
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
const corsOptions = {
  origin: 'https://panoriha.azurewebsites.net',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
//Cookie parser
app.use(cookieParser());
app.get('/set-cookie', (req, res) => {
  res.cookie('myCookie', 'cookieVlaue', {
    sameSite: 'None',
  });
  res.send('cookie set successfully');
});
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Date sanitization against XSS
app.use(xss());
//Prevent parameter pollution
app.use(hpp({}));
//serving static files
app.use(express.static('public/dist'));
app.use(express.static(path.join(__dirname, 'public', 'build')));
app.use(express.urlencoded({ extended: true }));
// request time
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
});

// 3) Routes
const sendFileTour = (req, res) => {
  const filename = req.params.filename;
  if (filename === 'scene.gltf') {
    res.sendFile(path.resolve(__dirname, 'images/tours', filename));
    res.sendFile(path.resolve(__dirname, 'images/tours', 'scene.bin'));
  } else {
    res.sendFile(path.resolve(__dirname, 'images/tours', filename));
  }
};

const sendFileScene = (req, res) => {
  console.log('here');
  const filename = req.params.filename;
  const tourID = req.params.tourID;
  res.sendFile(path.resolve(__dirname, 'images/tours', tourID, filename));
};
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', toursRouter);
app.get('/appiframe', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'build', 'index.html'));
});
app.get('/images/tours/:tourID/:filename', (req, res, next) => {
  Tour.findById(req.params.tourID)
    .then((tour) => {
      if (tour.isPublic) {
        sendFileScene(req, res);
      } else {
        authController.protect(req, res, () => {
          authController.restrictTo('admin', 'user')(req, res, () => {
            authController.restrictTourToCreator(req, res, () => {
              sendFileScene(req, res);
            });
          });
        });
      }
    })
    .catch(next);
});
app.get(
  '/images/tours/:filename',
  // authController.protect,
  // authController.restrictTo('admin', 'user'),
  // authController.restrictTourToCreator,
  sendFileTour,
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});
app.use(globalErrorHandler);
// app.set('view engine', 'ejs');
// app.set('views', 'views');
// app.get('/', (req, res) => {
//   res.render('index');
// });

module.exports = app;
