"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import useAuthModal from "@/hooks/useAuthModal";

const LikeButton = ({ songId }) => {
  const router = useRouter();

  const authModal = useAuthModal();
  const { data: session } = useSession();
  const user = session?.user;

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fetchLikedSongs', {
          method: 'POST',
          body: JSON.stringify({ song_id: songId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          // If the response status is not ok, display an error toast
          toast.error('fetch error');
          return;
        }
  
        const data = await response.json();
  
        setIsLiked(data.message === 'liked'); // Adjust this line based on the actual response
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, [songId]);
  

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }
    try {
      const response = await fetch('/api/fetchLikedSongs', {
        method: 'POST',
        body: JSON.stringify({ song_id: songId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If the response status is not ok, display an error toast
        toast.error('fetch error');
        return;
      }

      const data = await response.json();
      const isCurrentlyLiked = data.message === 'liked'; // Adjust this line based on the actual response

      if (isCurrentlyLiked) {
        // Song is liked, so we should remove the like
        const removeResponse = await fetch('/api/removeLikedSongs', {
          method: 'POST',
          body: JSON.stringify({ song_id: songId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!removeResponse.ok) {
          toast.error('remove error');
          return;
        }

        setIsLiked(false);
      } else {
        // Song is not liked, so we should add the like
        const addResponse = await fetch('/api/putLikedSong', {
          method: 'POST',
          body: JSON.stringify({ song_id: songId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!addResponse.ok) {
          toast.error('put error');
          return;
        }

        setIsLiked(true);
        toast.success('Success');
      }

      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <button
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
      onClick={handleLike}
    >
      <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
    </button>
  );
};

export default LikeButton;