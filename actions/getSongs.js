import { connectMongoDB } from "@/lib/mongodb";
import Song from "@/models/Song";

const getSongs = async () => {

  await connectMongoDB();
    const data = await Song.find()
    .sort({ created_at: -1 })
    .exec();

  return (data) || [];
};

export default getSongs;
