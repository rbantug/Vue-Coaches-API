const mongoose = require("mongoose");
const validator = require("validator");

const requestSchema = new mongoose.Schema({
	userEmail: {
		type: String,
		required: true,
		trim: true,
		validate: {
			validator: function (val) {
				return validator.isEmail(val);
			},
			message: "Please use a valid email address.",
		},
	},
	userMessage: {
		type: String,
		required: true,
		trim: true,
	},
	coachSlug: {
		type: String,
		requied: true,
		trim: true,
	},
});

const Request = mongoose.model("request", requestSchema);

module.exports = Request;
