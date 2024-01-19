const mongoose = require("mongoose");

const LikedSongSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: [true, "Please provide a user email for the liked song."],
    },
    song_id: {
        type: String,
        required: [true, "Please provide a song ID for the liked song."],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports =
	mongoose.models.LikedSong ?? mongoose.model("LikedSong", LikedSongSchema);