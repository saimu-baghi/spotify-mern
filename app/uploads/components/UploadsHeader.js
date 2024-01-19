"use client"
import React from 'react'
import Image from "next/image";
import { useSession } from "next-auth/react";

import Header from "@/components/Header";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import Button from '@/components/Button';

function UploadsHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const uploadModal = useUploadModal();
  const authModal = useAuthModal();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    return uploadModal.onOpen();
  }
  return (
    <Header>
    <div className="mt-20">
      <div 
        className="
          flex 
          flex-col 
          md:flex-row 
          items-center 
          gap-x-5
        "
      >
        <div className="relative h-32 w-32 lg:h-44 lg:w-44">
          <Image
            className="object-cover"
            fill
            src="/images/uploads.png"
            alt="Playlist"
          />
        </div>
        <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
          <p className="hidden md:block font-semibold text-sm">
            Playlist
          </p>
          <h1 
            className="
              text-white 
              text-4xl 
              sm:text-5xl 
              lg:text-7xl 
              font-bold
            "
          >
            Your uploads
          </h1>
          <Button onClick={onClick}>Upload songs</Button>
        </div>
      </div>
    </div>
  </Header>
  )
}

export default UploadsHeader