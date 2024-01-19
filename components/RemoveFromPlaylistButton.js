"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import useAuthModal from "@/hooks/useAuthModal";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";

const RemoveFromPlaylistButton = ({
  songId,
  playlistId
}) => {
  console.log("songid",songId,"playlistid",playlistId)
  const router = useRouter();
  const authModal = useAuthModal();
  const { data: session } = useSession();
  const user = session?.user;

  const handleRemove = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    else {
      const data = {
        song_id: songId,
        playlist_id: playlistId
      }
      const response = await fetch("/api/removeFromPlaylist", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
    
      if (!response.ok) {
        toast.error(responseData.message);
        return;
      } else {
        toast.success("Song removed!")
      }
    }

    router.refresh();
  }

  return (
    <button 
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
      onClick={handleRemove}
    >
      <MdOutlinePlaylistAddCheck size={25} />
    </button>
  );
}

export default RemoveFromPlaylistButton;
