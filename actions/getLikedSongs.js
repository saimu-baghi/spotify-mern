import { connectMongoDB } from "@/lib/mongodb";
import LikedSong from "@/models/LikedSong";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

const getLikedSongs = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("Please login first");
    return [];
  }

  const user_email = session?.user?.email;

  await connectMongoDB();
    const data = await LikedSong.find({ user_email }).select("song_id");

  if (!data) return [];

  return data || [];
};

export default getLikedSongs;