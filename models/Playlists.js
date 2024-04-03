const mongoose = require("mongoose");

const PlaylistsSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String,
        required: [true, "Please provide a title for the playlist."],
        // maxlength: [60, "Title cannot be more than 60 characters"],
    },
    image_path: {
        type: String,
    },
    user_email: {
        type: String,
        required: [true, "Please provide a user ID for the playlist."],
    },
});

module.exports =
	mongoose.models.Playlists ?? mongoose.model("Playlists", PlaylistsSchema);