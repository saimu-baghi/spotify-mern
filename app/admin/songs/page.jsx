import { deleteSong } from "@/app/lib/actions";
import { fetchSongs } from "@/app/lib/data";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/songs/songs.module.css";
import Image from "next/image";
import Link from "next/link";

const SongsPage = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, songs } = await fetchSongs(q, page);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a song..." />
        <Link href="/admin/songs/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Author</td>
            <td>Uploaded By</td>
            <td>Created At</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>
                <div className={styles.song}>
                  <Image
                    src={song.image_path
                      || "https://picsum.photos/500"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.songImage}
                  />
                  {song.title}
                </div>
              </td>
              <td>{song.author}</td>
              <td>{song.user_email}</td>
              <td>{song.created_at?.toString().slice(4, 16)}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/admin/songs/${song.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deleteSong}>
                    <input type="hidden" name="id" value={(song.id)} />
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

export default SongsPage;
