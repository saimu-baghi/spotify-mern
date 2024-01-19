"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";

import useRegisterModal from "@/hooks/useRegisterModal";

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const RegisterModal = () => {
  const router = useRouter();
  const { onClose, isOpen } = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
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
  
      // Client-side validation
      if (!values.name || values.name.trim() === '') {
        toast.error('Name cannot be empty. Please enter a name.');
        setIsLoading(false);
        return;
      }
  
      if (values.password.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }
  
      // Valid data, proceed with the API request
      const data = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        toast.error("User already exists.");
        return;
      }
  
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const responseData = await response.json();

      if (!response.ok) {
        // If the response status is not ok, display an error toast
        toast.error(responseData.message);
        setIsLoading(false);
        return;
      }

      // If registration is successful, display a success toast
      toast.success(responseData.message);
  
      setMessageSent(true);
      router.refresh();
      setIsLoading(false);
      // toast.success('Registration Successful!');
      reset();
      onClose();
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  // useEffect(() => {
  //   if (session) {
  //     router.refresh();
  //     onClose();
  //   }
  // }, [session, router, onClose]);

  const onChange = (open) => {
    if (!open) {
      onClose();
    }
  }

  return (
    <Modal
      title="Welcome"
      description="Register your account."
      isOpen={isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="name"
          disabled={isLoading}
          {...register('name', { required: true })}
          placeholder="Full Name"
        />
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
          Register
        </Button>
      </form>
    </Modal>
  );
}

export default RegisterModal;