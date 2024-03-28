// api/removelikedsongs
import { connectToDB } from "@/app/lib/utils";
import LikedSong from "@/models/LikedSong";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("Please login first");
    return Response.json({ message: 'not_logged_in' });
  }
  const { song_id } = await req.json();
  const user_email = session?.user?.email;

  try {
    await connectToDB();
    const result = await LikedSong.deleteOne({ user_email, song_id });

    if (result.deletedCount > 0) {
      return Response.json({ message: 'deleted' });
    } else {
      return Response.json({ message: 'not_found' });
    }
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
