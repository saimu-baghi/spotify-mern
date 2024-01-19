import { Figtree } from 'next/font/google'

// import getSongsByUserId from '@/actions/getSongsByUserId'
import Sidebar from '@/components/Sidebar'
import Player from '@/components/Player'

import ToasterProvider from '@/providers/ToasterProvider'
import ModalProvider from '@/providers/ModalProvider'
import { AuthProvider } from '@/providers/AuthProvider'

import getPlaylistsByUserId from '@/actions/getPlaylistsByUserId'

import './globals.css'

const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Spotify 2.0',
  description: 'Enjoy the music',
};

export const revalidate = 0;

export default async function RootLayout({ children }) {

  // const userSongs = await getSongsByUserId();
  const userPlaylists = await getPlaylistsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <AuthProvider>
          <ModalProvider playlists={userPlaylists} />
          <Sidebar playlists={userPlaylists}>
            {children}
          </Sidebar>
          <Player />
        </AuthProvider>
      </body>
    </html>
  );
}
