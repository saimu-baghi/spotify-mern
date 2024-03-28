import { connectToDB } from "@/app/lib/utils";
import playlists from "@/models/Playlists";
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
    const { playlist_id } = await req.json();
    await playlists.deleteOne({ _id: playlist_id, user_email });
    await PlaylistSong.deleteMany({ playlist_id, user_email });

    return NextResponse.json({ message: "Playlist Deleted" }, {status: 201});
  } catch (error) {
      console.log(error);
    return NextResponse.json({ message: "No Playlist Found" }, {status: 201});
  }
}
