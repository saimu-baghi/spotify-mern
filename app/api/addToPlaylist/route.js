import { connectToDB } from "@/app/lib/utils";
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
    await connectToDB();
    const { playlist_id, song_id } = await req.json();
    await PlaylistSong.create({ playlist_id, song_id, user_email });

    return NextResponse.json({ message: "added to playlist" }, {status: 201});
  } catch (error) {
    console.log(error);
  }
}
