const CoachModel = require('../models/CoachModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const AppError = require('../utils/appError.js');

exports.getAllCoaches = catchAsyncErrors(async (req, res, next) => {
  const result = await CoachModel.find();
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getSingleCoach = catchAsyncErrors(async (req, res, next) => {
  const coachId = req.params.id;
  const getOne = await CoachModel.find({ id: coachId });

  if (!getOne) {
    return next(new AppError('This document does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: getOne
  });
});

exports.postCoach = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    areas,
    description,
    hourlyRate,
    userId
  } = req.body;
  const newDoc = await CoachModel.create({
    firstName,
    lastName,
    areas,
    description,
    hourlyRate,
    userId
  });

  res.status(200).json({
    status: 'success',
    data: newDoc
  });
});

exports.deleteSingleCoach = catchAsyncErrors(async (req, res, next) => {
  const doc = await CoachModel.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('This document does not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'document was deleted'
  });
});
