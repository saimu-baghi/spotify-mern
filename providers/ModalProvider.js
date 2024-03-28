"use client";

import AddToPlayListModal from '@/components/AddToPlayListModal';
import AuthModal from '@/components/AuthModal';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';
import UploadModal from '@/components/UploadModal';

import React, { useEffect, useState } from 'react'

function ModalProvider({playlists}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect (() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

  return (
    <>
    <AuthModal />
    <CreatePlaylistModal />
    <UploadModal/>
    <AddToPlayListModal playlists={playlists} />
    </>
  )
}

export default ModalProvider