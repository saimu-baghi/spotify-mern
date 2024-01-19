import getSongsByUserId from "@/actions/getSongsByUserId";

import UploadsContent from "./components/UploadsContent";
import UploadsHeader from "./components/UploadsHeader";

export const revalidate = 0;

const Uploads = async () => {
  const songs = await getSongsByUserId();

  return (
    <div 
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
        <UploadsHeader />
      <UploadsContent songs={songs} />
    </div>
  );
}

export default Uploads;
