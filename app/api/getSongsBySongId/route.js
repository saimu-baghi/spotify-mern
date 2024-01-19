import { connectMongoDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  try {
    await connectMongoDB();
    const { song_id } = await req.json();

    const song = await Song.find({ _id: song_id }) 
    if (!song) {
      console.log("No matching songs found");
      return NextResponse.json(
        { message: "No matching songs found" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Songs found", song }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}
