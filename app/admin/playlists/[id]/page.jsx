import { updatePlaylist } from "@/app/lib/actions";
import { fetchPlaylist } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import stylesSongs from "@/app/ui/dashboard/songs/songs.module.css";
import Image from "next/image";
// import Search from "@/app/ui/dashboard/search/search";
import Link from "next/link";
import { removeFromPlaylist } from "@/app/lib/actions";
export const revalidate = 0;

const SingleUserPage = async ({ params }) => {
  const { id } = params;
  const {playlist, songs }= await fetchPlaylist(id);
  return (
    <>
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src={playlist.image_path || "https://picsum.photos/500"} alt="" fill />
        </div>
        {playlist.title}
      </div>
      <div className={styles.formContainer}>
        <form action={updatePlaylist} className={styles.form}>
          <input type="hidden" name="id" value={playlist.id}/>
          <label>Title</label>
          <input type="text" name="name" placeholder={playlist.title} />
          <label>Created By</label>
          <input type="email" name="email" placeholder={playlist.user_email} />
          <button>Update</button>
        </form>
      </div>
    </div>
    <div className={stylesSongs.container}>
      <div className={stylesSongs.top}>
        {/* <Search placeholder="Search for a song..." /> */}
        <Link href={`/admin/playlists/${id}/add`}>
          <button className={stylesSongs.addButton}>Add More</button>
        </Link>
      </div>
      <table className={stylesSongs.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Author</td>
            <td>Created At</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>
                <div className={stylesSongs.song}>
                  <Image
                    src={song.image_path
                      || "https://picsum.photos/500"}
                    alt=""
                    width={40}
                    height={40}
                    className={stylesSongs.songImage}
                  />
                  {song.title}
                </div>
              </td>
              <td>{song.author}</td>
              <td>{song.created_at?.toString().slice(4, 16)}</td>
              <td>
                <div className={stylesSongs.buttons}>
                  <Link href={`/admin/songs/${song.id}`}>
                    <button className={`${stylesSongs.button} ${stylesSongs.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={removeFromPlaylist}>
                    <input type="hidden" name="id" value={(song.id)} />
                    <button className={`${stylesSongs.button} ${stylesSongs.delete}`}>
                      Remove
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default SingleUserPage;
