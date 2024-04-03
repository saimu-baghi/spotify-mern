import { connectToDB } from "@/app/lib/utils";
import PlaylistSong from "@/models/PlaylistSong";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const { playlist_id, songs_ids, user_email } = await req.json();
    songs_ids.forEach(async (song_id) => {
      const song = await PlaylistSong.findOne({ playlist_id, song_id });
      if (!song) {
        await PlaylistSong.create({ playlist_id, song_id, user_email });
      }
    });

    return NextResponse.json({ message: "added to playlist" }, { status: 201 });
  } catch (error) {
    console.log(error);
  }
}
