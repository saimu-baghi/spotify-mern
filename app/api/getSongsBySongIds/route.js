import { connectToDB } from "@/app/lib/utils";
import Song from "@/models/Song";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  try {
    await connectToDB();
    const { song_ids } = await req.json();

    const songs = await Song.find({ _id: { $in: song_ids } }) // Use $in to find songs with multiple IDs
    if (!songs || songs.length === 0) {
      console.log("No matching songs found");
      return NextResponse.json(
        { message: "No matching songs found" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Songs found", songs: songs }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}
