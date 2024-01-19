"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useCreatePlaylistModal from '@/hooks/useCreatePlaylistModal';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const CreatePlaylistModal = () => {
  // const [file, setFile] = useState(null)


  const [isLoading, setIsLoading] = useState(false)

  const createPlaylistModal = useCreatePlaylistModal();

  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [isMessageSent, setMessageSent] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];

      // Client-side validation
      if (!values.title || values.title.trim() === '' || !user || !imageFile) {
        toast.error('Missing field');
        setIsLoading(false);
        return;
      }


      // Valid data, proceed with the API request
      const data = {
        title: values.title,
        email: user.email,
        contentType: imageFile.type,
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + '/api/createPlaylist',
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
      const { url, fields } = await response.json()

      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value)
      })
      formData.append('file', imageFile)

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {
        toast.success('Playlist Created')
      } else {
        console.error('S3 Upload Error:', uploadResponse)
        toast.error('Error occured while creating a playlist')
      }

      // If registration is successful, display a success toast
      // toast.success("success");

      setMessageSent(true);
      router.refresh();
      setIsLoading(false);
      // toast.success('Registration Successful!');
      reset();
      createPlaylistModal.onClose();
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (open) => {
    if (!open) {
      createPlaylistModal.onClose();
    }
  }

  return (
    <Modal
      title="Create a playlist"
      description="Select a playlist title that is meaningful"
      isOpen={createPlaylistModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          name="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Playlist title"
        />
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
          Create
        </Button>
      </form>
    </Modal>
  );
}

export default CreatePlaylistModal;