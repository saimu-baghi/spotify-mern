import { connectToDB } from "@/app/lib/utils";
import PlaylistSong from "@/models/PlaylistSong";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

const getPlaylistSongs = async ({selectedPlaylist}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return [];
  }

  const user_email = session?.user?.email;

  await connectToDB();
    const data = await PlaylistSong.find({ user_email, playlist_id: selectedPlaylist }).select("song_id");

  return data || [];
}

export default getPlaylistSongs;
