import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const useSongById = (id) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState(undefined);


  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {

      const data = await fetch("/api/getSongsBySongId", {
        method: "POST",
        body: JSON.stringify({ song_id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await data.json();
      if (!data.ok) {
        setIsLoading(false);
        return toast.error(resData.message);
      }
      
      setSong(resData.song);
      setIsLoading(false);
    }

    fetchSong();
  }, [id]);

  return useMemo(() => ({
    isLoading,
    song
  }), [isLoading, song]);
};

export default useSongById;
