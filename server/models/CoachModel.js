const mongoose = require("mongoose");
const slugify = require("slugify");

const coachSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	hourlyRate: {
		type: Number,
		required: true,
		default: 30,
	},
	areas: {
		type: [String],
		enum: ["frontend", "backend", "career"],
		required: true,
	},
	description: {
		type: String,
		trim: true,
		required: true,
	},
	slug: String,
	userId: String
});

coachSchema.pre("save", function (next) {
	const fullName = `${this.firstName} ${this.lastName}`;
	this.slug = slugify(fullName, { lower: true });
	next();
});

const Coach = mongoose.model("coach", coachSchema);

module.exports = Coach;
