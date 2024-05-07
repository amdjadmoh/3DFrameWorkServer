const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const AppError = require('./utils/appError');
const toursRouter = require('./routes/toursRoutes');
const adminRouter = require('./routes/adminRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//1)Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
});

// 3) Routes
app.use('/', adminRouter);
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
