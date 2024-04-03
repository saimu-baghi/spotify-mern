import { addSongstoPlaylist } from "@/app/lib/actions";
import { fetchSongs } from "@/app/lib/data";
import { fetchPlaylist } from "@/app/lib/data";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/songs/songs.module.css";
import Image from "next/image";
import Link from "next/link";
import AddSongToPlaylistContent from "./components/AddSongToPlaylistContent";

const AddSongToPlaylistPage = async ({ searchParams, params }) => {
  const { id } = params;
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, songs } = await fetchSongs(q, page);
  const {playlist }= await fetchPlaylist(id);


  return (
    <>
      <AddSongToPlaylistContent count={count} songs={songs} id={id} user_email={playlist.user_email} />
    </>
  );
};

export default AddSongToPlaylistPage;
