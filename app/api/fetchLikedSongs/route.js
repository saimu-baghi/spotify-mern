// api/fetchlikedsongs
import { connectToDB } from "@/app/lib/utils";
import LikedSong from "@/models/LikedSong";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("Please login first");
    return Response.json({ message: 'not_liked' }); // Adjust this line to indicate not liked
  }
  const { song_id } = await req.json();
  const user_email = session?.user?.email;

  try {
    await connectToDB();
    const data = await LikedSong.findOne({ user_email, song_id });

    if (data) {
      return Response.json({ message: 'liked' }); // Adjust this line to indicate liked
    } else {
      return Response.json({ message: 'not_liked' }); // Adjust this line to indicate not liked
    }
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
