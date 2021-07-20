const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const AppError = require('../utils/appError');
const User = require('../models/UserModel');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 3600000
    ),
    httpOnly: true,
    sameSite: 'secure',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt
  });

  sendToken(newUser, 201, req, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide an email and a password', 400));
  }

  // check if email and password are correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // sendToken
  sendToken(user, 200, req, res);
});

exports.protect = catchAsyncErrors(async (req, res, next) => {
  let token;

  // get the token and check if it exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in.', 401));
  }
  // verify token & check if user still exist
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  const currentUser = await User.findById(decodedData.id);
  if (!currentUser) {
    return next(new AppError('This user does not exist', 401));
  }

  // check if the user has changed the password after issuing the JWT
  if (currentUser.changedPasswordAfter(decodedData.iat)) {
    return next(new AppError('The user recently changed the password', 401));
  }

  // store user info in req.user
  req.user = currentUser;
  next();
});
