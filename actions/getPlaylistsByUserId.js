import { connectMongoDB } from "@/lib/mongodb";
import playlists from "@/models/Playlists";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

const getPlaylistsByUserId = async () => {

  const session = await getServerSession(authOptions);

  // const { data: session, error: sessionError } = await getServerSession(authOptions);


  if (!session) {
    console.log("Please login first");
    return [];
  }

  const user_email = session?.user?.email;

  await connectMongoDB();
    const data = await playlists.find({ user_email })
    .sort({ created_at: -1 })
    .exec();

  return (data) || [];
};

export default getPlaylistsByUserId;
