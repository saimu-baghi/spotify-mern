import { deletePlaylist } from "@/app/lib/actions";
import { fetchPlaylists } from "@/app/lib/data";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/playlists/playlists.module.css";
import Image from "next/image";
import Link from "next/link";

const PlaylistsPage = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, playlists } = await fetchPlaylists(q, page);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a playlist..." />
        <Link href="/admin/playlists/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Created By</td>
            <td>Created At</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {playlists.map((playlist) => (
            <tr key={playlist.id}>
              <td>
                <div className={styles.playlist}>
                  <Image
                    src={playlist.image_path
                      || "https://picsum.photos/500"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.playlistImage}
                  />
                  {playlist.title}
                </div>
              </td>
              <td>{playlist.user_email}</td>
              <td>{playlist.created_at?.toString().slice(4, 16)}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/admin/playlists/${playlist.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deletePlaylist}>
                    <input type="hidden" name="id" value={(playlist.id)} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default PlaylistsPage;
