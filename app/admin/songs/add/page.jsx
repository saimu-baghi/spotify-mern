import { addSong } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/songs/addSong/addSong.module.css";

const AddUserPage = () => {
  return (
    <div className={styles.container}>
      <form action={addSong} className={styles.form}>
        <input type="text" placeholder="title" name="title" required />
        <input type="text" placeholder="author" name="author" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddUserPage;
