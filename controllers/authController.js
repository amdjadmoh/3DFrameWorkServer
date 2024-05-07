const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

dotenv.config({ path: './config.env' });
const secretKey = process.env.JWT_SECRET; // Replace with your own secret key

// Admin login method
exports.adminLogin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new AppError('Please provide username and password', 400));
  }
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '30d' });
    res.status(200).json({
      status: 'success',
      token,
    });
  } else {
    next(new AppError('Incorrect username or password', 401));
  }
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  //verify token
  const decoded = promisify(jwt.verify)(token, secretKey);
  console.log(decoded);
});
