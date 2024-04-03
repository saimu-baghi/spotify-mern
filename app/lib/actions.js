"use server";

import { revalidatePath } from "next/cache";
import { Product, Users } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import { hash as bcryptHash } from "bcrypt";
import { generateId } from "lucia";
import Playlists from "@/models/Playlists";
import Song from "@/models/Song";

export const addUser = async (formData) => {
  const { username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const hashedPassword = await bcryptHash(password, 10);
    const userId = generateId(15);

    const newUser = new Users({
      _id: userId,
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    });

    await newUser.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
};

export const addSong = async (formData) => {
  const { title, author } =
    Object.fromEntries(formData);

  try {
    connectToDB();


    const newSong = new Song({
      title,
      author,
    });

    await newSong.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to add a song!");
  }

  revalidatePath("/admin/songs");
  redirect("/admin/songs");
};

export const addPlaylist = async (formData) => {
  const { title, user_email } =
    Object.fromEntries(formData);

  try {
    connectToDB();


    const newPlaylist = new Playlists({
      title,
      user_email,
      image_path:" "
    });

    await newPlaylist.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create a playlist!");
  }

  revalidatePath("/admin/playlist");
  redirect("/admin/playlists");
};

export const updateUser = async (formData) => {
  const { id, username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();
    const hashedPassword = await bcryptHash(password, 10);

    const updateFields = {
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Users.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
};

export const updateSong = async (formData) => {
  const { title, user_email, author } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      title, user_email, author
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Users.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update song!");
  }

  revalidatePath("/admin/songs");
  redirect("/admin/songs");
};

export const updatePlaylist = async (formData) => {
  const { title, user_email } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      title, user_email
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Playlists.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update playlist!");
  }

  revalidatePath("/admin/playlists");
  redirect("/admin/playlists");
};

export const addProduct = async (formData) => {
  const { title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const newProduct = new Product({
      title,
      desc,
      price,
      stock,
      color,
      size,
    });

    await newProduct.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
};

export const updateProduct = async (formData) => {
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      title,
      desc,
      price,
      stock,
      color,
      size,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Product.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update product!");
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
};

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Users.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }

  revalidatePath("/admin/users");
};

export const deletePlaylist = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Playlists.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete song!");
  }

  revalidatePath("/admin/playlists");
};

export const deleteSong = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Song.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete song!");
  }

  revalidatePath("/admin/songs");
};

export const deleteProduct = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Product.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete product!");
  }

  revalidatePath("/admin/products");
};

export const authenticate = async (prevState, formData) => {
  const { email, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { email, password });
  } catch (err) {
    if (err.message.includes("CredentialsSignin")) {
      return "Wrong Credentials";
    }
    throw err;
  }
};
