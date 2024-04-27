const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const eventsRouter = require('./routes/eventsRoutes');

const scenesRouter = require('./routes/scenesRoutes');


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
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/scenes', scenesRouter);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;
