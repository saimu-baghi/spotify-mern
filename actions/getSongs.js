import { connectToDB } from "@/app/lib/utils";
import Song from "@/models/Song";

const getSongs = async () => {

  await connectToDB();
    const data = await Song.find()
    .sort({ created_at: -1 })
    .exec();

  return (data) || [];
};

export default getSongs;
