const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
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

const app = express();

//1)Middlewares
//Set Security HTTP headers
app.use(helmet());
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
const corsOptions = {
  origin: true,
  credentials: true,
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
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
// request time
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
});

// 3) Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', toursRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// app.set('view engine', 'ejs');
// app.set('views', 'views');
// app.get('/', (req, res) => {
//   res.render('index');
// });

module.exports = app;
