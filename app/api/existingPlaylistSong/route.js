import { connectMongoDB } from "@/lib/mongodb";
import PlaylistSong from "@/models/PlaylistSong";
import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
//     const session = await getServerSession(authOptions);
//   if (!session) {
//     console.log("Please login first");
//     return [];
//   }

//   const user_email = session?.user?.email;

  try {
    await connectMongoDB();
    const { playlist_id, song_id } = await req.json();
    const song = await PlaylistSong.findOne({ playlist_id, song_id });

    return NextResponse.json({ song });
  } catch (error) {
    console.log(error);
  }
}
