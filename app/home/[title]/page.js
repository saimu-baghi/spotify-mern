import getPlaylistSongs from "@/actions/getPlaylistSongs";
import getPlaylistsByUserId from "@/actions/getPlaylistsByUserId";

import PlaylistHeader from "./components/PlaylistHeader";
import PlaylistContent from "./components/PlaylistContent";

export const revalidate = 0;

const Playlist = async ({ searchParams }) => {
    const userPlaylists = await getPlaylistsByUserId();

    const selectedPlaylist = searchParams.id;
    const playlistSongsData = await getPlaylistSongs({ selectedPlaylist });

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
            <PlaylistHeader playlists={userPlaylists} />
            <PlaylistContent playlistSongsData={playlistSongsData} playlistId={selectedPlaylist} />
        </div>
    );
}

export default Playlist;
