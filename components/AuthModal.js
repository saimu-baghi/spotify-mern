"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useAuthModal from "@/hooks/useAuthModal";

const AuthModal = ({ session }) => {
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageSent, setMessageSent] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
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
      toast.success('Login Successful!');
      reset();
      onClose();
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (response) => {
    try {
      setIsLoading(true);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }
      );
      const { name, email, sub } = userInfo.data;

      const data = { name, email, password: sub };

      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (!user) {
        const registerRes = await fetch("/api/register", {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });

        const responseData = await registerRes.json();

        if (!registerRes.ok) {
          toast.error(responseData.message);
          setIsLoading(false);
          return;
        }
      }
      const signInRes = await signIn("credentials", {
        email,
        password: sub,
        redirect: false,
      });

      if (signInRes.error) {
        toast.error("Invalid Credentials");
        return;
      }

      setMessageSent(true);
      router.refresh();
      toast.success("Login Successful!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (values) => {
    try {
      setIsLoading(true);

      // Client-side validation
      if (!values.name || values.name.trim() === "") {
        toast.error("Name cannot be empty. Please enter a name.");
        setIsLoading(false);
        return;
      }

      if (values.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
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
      toast.error("Something went wrong. Please try again.");
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
  };

  const login = useGoogleLogin({
    onSuccess: handleLogin,
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <Modal
      title="Welcome"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <Button
              onClick={login}
              disabled={isLoading}
              className="bg-white flex flex-row items-center justify-center gap-1"
            >
              <FcGoogle size={20} />
              Sign in with Google
            </Button>
            <Input
              id="email"
              type="email"
              disabled={isLoading}
              {...register("email", { required: true })}
              placeholder="Email"
            />
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...register("password", { required: true })}
              placeholder="Password"
            />
            <Button disabled={isLoading} type="submit">
              Login
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="signup">
          <form
            onSubmit={handleSubmit(onSignUp)}
            className="flex flex-col gap-y-4"
          >
            <Button
              onClick={login}
              disabled={isLoading}
              className="bg-white flex flex-row items-center justify-center gap-1"
            >
              <FcGoogle size={20} />
              Sign up with Google
            </Button>
            <Input
              id="name"
              disabled={isLoading}
              {...register("name")}
              placeholder="Full Name"
            />
            <Input
              id="email"
              type="email"
              disabled={isLoading}
              {...register("email", { required: true })}
              placeholder="Email"
            />
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...register("password", { required: true })}
              placeholder="Password"
            />
            <Button disabled={isLoading} type="submit">
              Register
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};

export default AuthModal;
