"use client"
import React, { useState, useEffect } from 'react';
import Pagination from '@/app/ui/dashboard/pagination/pagination';
import Search from '@/app/ui/dashboard/search/search';
import styles from '@/app/ui/dashboard/songs/songs.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AddSongToPlaylistContent = ({ count, songs, id, user_email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (selectedSongs.length === songs.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [selectedSongs]);

  const toggleSongSelection = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter((id) => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allSongIds = songs.map((song) => song._id);
      setSelectedSongs(allSongIds);
      setSelectAllChecked(true);
    } else {
      setSelectedSongs([]);
      setSelectAllChecked(false);
    }
  };

  const addPlaylist = async () => {
    try {
      setIsLoading(true);
        const data = {
            songs_ids: selectedSongs,
            playlist_id: id,
            user_email
        }
        const response = await fetch("/api/addMultipleToPlaylist", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
  
        if (!response.ok) {
          console.log("Unable adding to playlist");
          return;
        }
        router.refresh()
        setIsLoading(false);
        router.push(`/admin/playlists/${id}`)
      } catch (error) {
        cosole.log ("something went wrong")
      } finally {
        setIsLoading(false);
      }
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a song..." />
        <button disabled={isLoading} onClick={addPlaylist} className={styles.addButton}>Add to playlist</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>
              <input
                type="checkbox"
                checked={selectAllChecked}
                onChange={handleSelectAll}
              />{' '}
              Select All
            </td>
            <td>Title</td>
            <td>Author</td>
            <td>Uploaded By</td>
            <td>Created At</td>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedSongs.includes(song._id)}
                  onChange={() => toggleSongSelection(song._id)}
                />
              </td>
              <td>
                <div className={styles.song}>
                  <Image
                    src={song.image_path || 'https://picsum.photos/500'}
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
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default AddSongToPlaylistContent;
