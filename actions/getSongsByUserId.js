import { connectToDB } from "@/app/lib/utils";
import Song from "@/models/Song";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

const getSongsByUserId = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return [];
  }

  const user_email = session?.user?.email;

  await connectToDB();
    const data = await Song.find({ user_email })
    .sort({ created_at: -1 })
    .exec();

  return (data) || [];
};

export default getSongsByUserId;
