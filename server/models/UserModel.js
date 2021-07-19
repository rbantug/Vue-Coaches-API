const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: [true, "A name is required."],
		minlength: [10, "Your name should be more or equal 10 characters."],
		maxlength: [30, "Your name should be less or equal 30 characters."],
		validate: {
			validator: function (val) {
				const oneLongString = val.split(" ").join("");
				return validator.isAlpha(oneLongString);
			},
			message: "Your name should not contain numbers or symbols",
		},
	},
	email: {
		type: String,
		required: [true, "An email is required"],
		unique: true,
		lowercase: true,
		validate: {
			validator: function (val) {
				return validator.isEmail(val);
			},
			message: "Please use a valid email address.",
		},
	},
	password: {
		type: String,
		required: [true, "A password is required"],
		mixlength: [8, "Your password should at least be 8 characters."],
		select: false,
	},
	confirmPassword: {
		type: String,
		required: [true, "Please confirm your password"],
		validate: {
			validator: function (val) {
				return val === this.password;
			},
			message: "The passwords are not the same.",
		},
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

// Password encryption using bcrypt

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
	this.confirmPassword = undefined;
	next();
});

// Add the value of "passwordChangedAt" every pre-save hook

userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) {
		return next();
	}
	this.passwordChangedAt = new Date.now() - 1000;
	next();
});

// Check if users are active

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

// Compare login password with database encrypted password

userSchema.methods.comparePasswords = async function (
	loginPassword,
	databasePassword
) {
	return await bcrypt.compare(loginPassword, databasePassword);
};

// Check if password was changed after the JWT was issued

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const convertToMilliseconds = this.passwordChangedAt.getTime() / 1000;
		return JWTTimestamp < convertToMilliseconds;
	}
	return false;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
