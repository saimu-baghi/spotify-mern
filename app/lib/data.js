import Playlists from "@/models/Playlists";
import { Product, Users } from "./models";
import { connectToDB } from "./utils";
import PlaylistSong from "@/models/PlaylistSong";
import Song from "@/models/Song";

export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 10;

  try {
    connectToDB();
    const count = await Users.find({ username: { $regex: regex } }).count();
    const users = await Users.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchUser = async (id) => {
  try {
    connectToDB();
    const user = await Users.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

export const fetchPlaylists = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 10;

  try {
    connectToDB();
    const count = await Playlists.find({ title: { $regex: regex } }).count();
    const playlists = await Playlists.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, playlists };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch playlists!");
  }
};

export const fetchPlaylist = async (id) => {
  try {
    connectToDB();
    const playlist = await Playlists.findById(id);
    const song_ids = await PlaylistSong.find({ playlist_id: id }).select("song_id");
    const songIds = song_ids.map(song => song.song_id);
    const songs = await Song.find({ _id: { $in: songIds } });
    return {playlist, songs};
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch playlist!");
  }
};

export const fetchSongs = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 2;

  try {
    connectToDB();
    const count = await Song.find({ title: { $regex: regex } }).count();
    const songs = await Song.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, songs };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch songs!");
  }
};

export const fetchSong = async (id) => {
  try {
    connectToDB();
    const song = await Song.findById(id);
    return song;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch song!");
  }
};

export const fetchProducts = async (q, page) => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 2;

  try {
    connectToDB();
    const count = await Product.find({ title: { $regex: regex } }).count();
    const products = await Product.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, products };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch products!");
  }
};

export const fetchProduct = async (id) => {
  try {
    connectToDB();
    const product = await Product.findById(id);
    return product;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch product!");
  }
};

// DUMMY DATA

export const cards = [
  {
    id: 1,
    title: "Total Users",
    number: 10.928,
    change: 12,
  },
  {
    id: 2,
    title: "Stock",
    number: 8.236,
    change: -2,
  },
  {
    id: 3,
    title: "Revenue",
    number: 6.642,
    change: 18,
  },
];
