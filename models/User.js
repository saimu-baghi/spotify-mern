const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a full name for the user."],
        // maxlength: [30, "Full name cannot be more than 60 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email for the user."],
    },
    password: {
        type: String,
        required: [true, "Please provide password for the user."],
    },
    avatar_url: {
        type: String,
        // required: [true, "Please provide an avatar URL for the user."],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports =
	mongoose.models.Users ?? mongoose.model("Users", UserSchema);