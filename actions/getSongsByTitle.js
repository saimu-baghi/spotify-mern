import { connectToDB } from "@/app/lib/utils";
import Song from "@/models/Song";

import getSongs from "./getSongs";

const getSongsByTitle = async (title) => {

  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }
  const regex = new RegExp(title, 'i');
  await connectToDB();
    const data = await Song.find({ title: { $regex: regex } })
    .sort({ created_at: -1 })
    .exec();

  return (data) || [];
};

export default getSongsByTitle;
