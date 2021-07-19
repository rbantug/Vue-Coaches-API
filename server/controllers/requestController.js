const RequestModel = require("../models/RequestModel");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appError");

exports.getAllRequest = catchAsyncErrors(async (req, res, next) => {
	const result = await RequestModel.find();

	if (!result) {
		return next(new AppError("No documents exist", 404));
	}

	res.status(200).json({
		status: "success",
		data: result,
	});
});

exports.getOneRequest = catchAsyncErrors(async (req, res, next) => {
	const coachId = req.params.id;
	const getOne = await RequestModel.find({ id: coachId });

	if (!getOne) {
		return next(new AppError("This document does not exist", 404));
	}

	res.status(200).json({
		status: "success",
		data: getOne,
	});
});

exports.postRequest = catchAsyncErrors(async (req, res, next) => {
	const { userEmail, userMessage, coachSlug } = req.body;
	const newDoc = await RequestModel.create({
		userEmail,
		userMessage,
		coachSlug,
	});
	res.status(200).json({
		status: "success",
		data: newDoc,
	});
});
