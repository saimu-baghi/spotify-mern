const mongoose = require("mongoose");

const PlaylistSongSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: [true, "Please provide an email for the playlist."],
    },
    playlist_id: {
        type: String,
        required: [true, ""],
    },
    song_id: {
        type: String,
        required: [true, ""],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports =
	mongoose.models.PlaylistSong ?? mongoose.model("PlaylistSong", PlaylistSongSchema);