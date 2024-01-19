import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useSession } from "next-auth/react";


const useOnPlay = (songs) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const {data: session} = useSession();
  const user = session?.user;

  const onPlay = (id) => {
    if (!user) {
      return authModal.onOpen();
    }

    player.setId(id);
    player.setIds(songs.map((song) => song._id));
  }

  return onPlay;
};

export default useOnPlay;
