import { addPlaylist } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/playlists/addPlaylist/addPlaylist.module.css";

const AddUserPage = () => {
  return (
    <div className={styles.container}>
      <form action={addPlaylist} className={styles.form}>
        <input type="text" placeholder="title" name="title" required />
        <input type="email" placeholder="user" name="user_email" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddUserPage;
