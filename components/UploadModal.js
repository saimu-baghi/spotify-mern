"use client";

import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import useUploadModal from '@/hooks/useUploadModal';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  });

  const onChange = (open) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);

      const songFile = values.song?.[0];
      const imageFile = values.image?.[0];

      // Client-side validation
      if (!values.title || 
        values.title.trim() === '' ||
        !values.author || 
        values.author.trim() === '' || 
        !user || !imageFile || !songFile) {
        toast.error('Missing field');
        setIsLoading(false);
        return;
      }


      // Valid data, proceed with the API request
      const data = {
        title: values.title,
        email: user.email,
        imageType: imageFile.type,
        songType: songFile.type,
        author: values.author
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + '/api/uploadSong',
        {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const responseData = await response.json();

      if (!response.ok) {
        // If the response status is not ok, display an error toast
        toast.error("error");
        setIsLoading(false);
        return;
      }
      const { image: { url: img_url, fields: img_fields }, song: { url: sng_url, fields: sng_fields } } = await response.json();

      // Prepare and upload the image
      const imgFormData = new FormData();
      Object.entries(img_fields).forEach(([key, value]) => {
        imgFormData.append(key, value);
      });
      imgFormData.append('file', imageFile);
  
      const imgUploadResponse = await fetch(img_url, {
        method: 'POST',
        body: imgFormData,
      });
  
      if (!imgUploadResponse.ok) {
        toast.error('Error uploading image to S3');
        setIsLoading(false);
        return;
      }
  
      // Prepare and upload the song
      const sngFormData = new FormData();
      Object.entries(sng_fields).forEach(([key, value]) => {
        sngFormData.append(key, value);
      });
      sngFormData.append('file', songFile);
  
      const sngUploadResponse = await fetch(sng_url, {
        method: 'POST',
        body: sngFormData,
      });
  
      if (!sngUploadResponse.ok) {
        toast.error('Error uploading song to S3');
        setIsLoading(false);
        return;
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song uploaded!');
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="song"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Upload
        </Button>
      </form>
    </Modal>
  );
}

export default UploadModal;