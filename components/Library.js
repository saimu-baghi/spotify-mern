"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

// import useUploadModal from "@/hooks/useUploadModal";
import { useSession } from "next-auth/react";
import useAuthModal from "@/hooks/useAuthModal";
import useOnPlay from "@/hooks/useOnPlay";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";

// import MediaItem from "./MediaItem";
import ListItem from "./ListItem";
import PlaylistItem from "./PlaylistItem";

const Library = ({
  // songs,
  playlists
}) => {
  const { data: session } = useSession();
  const user = session?.user;
  // const uploadModal = useUploadModal();
  const authModal = useAuthModal();
  const createPlaylistModal = useCreatePlaylistModal();

  // const onPlay = useOnPlay(songs);

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    // return uploadModal.onOpen();
    return createPlaylistModal.onOpen();
  }

  return ( 
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">
            Your Library
          </p>
        </div>
        <AiOutlinePlus 
          onClick={onClick} 
          size={20} 
          className="
            text-neutral-400 
            cursor-pointer 
            hover:text-white 
            transition
          "
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
      <ListItem image="/images/uploads.png" name="Your Uploads" href="home/uploads" />
      <ListItem image="/images/liked.png" name="Liked Songs" href="home/liked" />
      {playlists.map((item) => (
        <PlaylistItem key={item.id} data={item} />
      ))}
      </div>
    </div>
   );
}
 
export default Library;