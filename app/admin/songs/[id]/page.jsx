import { updateSong } from "@/app/lib/actions";
import { fetchSong } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/songs/singleSong/singleSong.module.css";
import Image from "next/image";

const SingleUserPage = async ({ params }) => {
  
  const { id } = params;
  const song = await fetchSong(id);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src={song.image_path || "https://picsum.photos/500"} alt="" fill />
        </div>
        {song.title}
      </div>
      <div className={styles.formContainer}>
        <form action={updateSong} className={styles.form}>
          <input type="hidden" name="id" value={song.id}/>
          <label>Title</label>
          <input type="text" name="name" placeholder={song.title} />
          <label>Author</label>
          <input type="text" name="author" placeholder={song.author} />
          <label>Uploaded By</label>
          <input type="email" name="user_email" placeholder={song.user_email} />
          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleUserPage;
