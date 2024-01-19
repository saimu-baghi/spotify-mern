"use client";

import React, { useEffect, useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";

import useAuthModal from "@/hooks/useAuthModal";

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const AuthModal = ({ session }) => {
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
	const [isMessageSent, setMessageSent] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
  
      // Valid data, proceed with the API request
      const data = {
        email: values.email,
        password: values.password,
      };
  
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res.error) {
        toast.error("Invalid Credentials");
        return;
      }

      // If login is successful, display a success toast
      // toast.success(responseData.message);
  
      setMessageSent(true);
      router.refresh();
      setIsLoading(false);
      // toast.success('Login Successful!');
      reset();
      onClose();
    } catch (error) {
      console.error("Error during login:", error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [router, onClose]);

  const onChange = (open) => {
    if (!open) {
      onClose();
    }
  }

  return (
    <Modal
      title="Welcome back"
      description="Login to your account."
      isOpen={isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="email"
          type="email"
          disabled={isLoading}
          {...register('email', { required: true })}
          placeholder="Email"
        />
        <Input
          id="password"
          type="password"
          disabled={isLoading}
          {...register('password', { required: true })}
          placeholder="Password"
        />
        <Button disabled={isLoading} type="submit">
          Login
        </Button>
      </form>
    </Modal>
  );
}

export default AuthModal;