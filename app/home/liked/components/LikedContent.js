"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import PlaylistButton from "@/components/PlaylistButton";

const LikedContent = ({ likedSongData }) => {
  const [songs, setSongs] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const onPlay = useOnPlay(songs);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const songIds = likedSongData.map((likedSong) => likedSong.song_id);
        if (songIds.length === 0) {
          // console.log("No song_ids found in likedSongData");
          setSongs([]);
          return;
        }

        const response = await fetch("/api/getSongsBySongIds", {
          method: "POST",
          body: JSON.stringify({ song_ids: songIds }), // Change to song_ids
          headers: {
            "Content-Type": "application/json",
          },
        });
        

        if (!response.ok) {
          console.log("Error fetching liked songs");
          return;
        }

        const songsData = await response.json();
        setSongs(songsData.songs);

        
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [likedSongData, router, session, user]);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No liked songs.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {songs.map((song) => (
        <div key={song._id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem onClick={(id) => onPlay(id)} data={song} />
          </div>
          <LikeButton songId={song._id} />
          <PlaylistButton songId={song._id} />
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
