import { connectMongoDB } from "@/lib/mongodb";
import PlaylistSong from "@/models/PlaylistSong";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
    const session = await getServerSession(authOptions);
  if (!session) {
    console.log("Please login first");
    return [];
  }

  const user_email = session?.user?.email;

  try {
    await connectMongoDB();
    const { playlist_id, song_id } = await req.json();
    await PlaylistSong.deleteOne({ playlist_id, user_email, song_id });

    return NextResponse.json({ message: "Removed" }, {status: 201});
  } catch (error) {
      console.log("error".error);
    return NextResponse.json({ message: "No Song Found" }, {status: 201});
  }
}
