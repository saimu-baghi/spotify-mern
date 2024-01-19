"use client";

import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';

import useAddToPlaylistModal from "@/hooks/useAddToPlaylistModal";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";

import Modal from './Modal';
import Button from './Button';
import Dropdown from "./Dropdown";

const AddToPlayListModal = ({ playlists }) => {
  const [isLoading, setIsLoading] = useState(false);
  const addToPlaylistModal = useAddToPlaylistModal();
  const createPlaylistModal = useCreatePlaylistModal();

  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const createPlaylist = () => {
    if (!user) {
      return authModal.onOpen();
  }
    return createPlaylistModal.onOpen(); 
  }

  const handleSelect = (selectedId) => {
    setSelectedPlaylistId(selectedId);
  };

  const { handleSubmit, reset } = useForm({
    defaultValues: {},
  });

  const onChange = (open) => {
    if (!open) {
      reset();
      addToPlaylistModal.onClose();
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
  
      const songId = addToPlaylistModal.songId;
  
      // Check if a playlist is selected
      if (!selectedPlaylistId) {
        toast.error('Please select a playlist');
        setIsLoading(false);
        return;
      }
  
      // Check if the song already exists in the playlist
      // const { data: existingSongs, error: supabaseError } = await supabaseClient
      //   .from('playlist_songs')
      //   .select('*')
      //   .eq('playlist_id', selectedPlaylistId)
      //   .eq('song_id', songId);
  
      // if (supabaseError) {
      //   toast.error(supabaseError.message);
      //   return;
      // }
      const data = {
        playlist_id: selectedPlaylistId,
        song_id: songId,
      }

      const resSongExists = await fetch("/api/existingPlaylistSong", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const { song } = await resSongExists.json();

      // if (song) {
      //   toast.error("Song already exists.");
      //   return;
      // }
  
      if (song) {
        // Song already exists in the playlist
        toast.error('Song already exists in the playlist!');
        setIsLoading(false);
        return;
      }
  
  

      const response = await fetch("/api/addToPlaylist", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });


      if (!response.ok) {
        toast.error("Unable adding to playlist");
        return;
      }
  
      router.refresh();
      setIsLoading(false);
      toast.success('Added to playlist!');
      reset();
      addToPlaylistModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Modal
      title="Add to a playlist"
      description="Select a playlist"
      isOpen={addToPlaylistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Dropdown playlists={playlists} onSelect={handleSelect} />
        <Button onClick={createPlaylist}>Create a new playlist</Button>
        <Button disabled={isLoading} type="submit">
          Add
        </Button>
      </form>
    </Modal>
  );
};

export default AddToPlayListModal;