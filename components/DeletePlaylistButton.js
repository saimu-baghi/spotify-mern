"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import useAuthModal from "@/hooks/useAuthModal";
import Button from "./Button";

const DeletePlaylistButton = ({
  playlistId
}) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { data: session } = useSession();
  const user = session?.user;

  const handleDelete = async () => {
    if (!user) {
      return authModal.onOpen();
    }
  
    // Ask for confirmation before proceeding
    const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirmDelete) {
      return;
    }
  
    const response = await fetch("/api/deletePlaylist", {
      method: "POST",
      body: JSON.stringify({ playlist_id: playlistId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
  
    if (!response.ok) {
      toast.error(responseData.message);
      return;
    } else {
      toast.success("Playlist deleted!");
      router.push('/');
    }
  
    router.refresh();
  };
  

  return (
    <button
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
      onClick={handleDelete}
    >
      <Button>Delete playlist</Button>
    </button>
  );
}

export default DeletePlaylistButton;
