import { Figtree } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";

import ToasterProvider from "@/providers/ToasterProvider";
import ModalProvider from "@/providers/ModalProvider";
import { AuthProvider } from "@/providers/AuthProvider";

import getPlaylistsByUserId from "@/actions/getPlaylistsByUserId";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "../globals.css";

const font = Figtree({ subsets: ["latin"] });

const Layout = async ({ children }) => {
  const userPlaylists = await getPlaylistsByUserId();

  return (
    <>
      <ToasterProvider />
      <SpeedInsights />
      <GoogleOAuthProvider clientId="1072891222597-uqjd7og22c44sslihgsavoonrqn1imjg.apps.googleusercontent.com">
        <AuthProvider>
          <ModalProvider playlists={userPlaylists} />
          <Sidebar playlists={userPlaylists}>{children}</Sidebar>
          <Player />
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
};

export default Layout;
