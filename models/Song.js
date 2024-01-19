const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String,
        required: [true, "Please provide a title for the song."],
    },
    song_path: {
        type: String,
        required: [true, "Please provide a path for the song."],
    },
    image_path: {
        type: String,
        required: [true, "Please provide an image path for the song."],
    },
    author: {
        type: String,
        required: [true, "Please provide an author for the song."],
    },
    user_email: {
        type: String,
        required: [true, "Please provide a user ID for the song."],
    },
});

module.exports =
	mongoose.models.Song ?? mongoose.model("Song", SongSchema);