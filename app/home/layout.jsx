import { Figtree } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import Player from '@/components/Player'

import ToasterProvider from '@/providers/ToasterProvider'
import ModalProvider from '@/providers/ModalProvider'
import { AuthProvider } from '@/providers/AuthProvider'

import getPlaylistsByUserId from '@/actions/getPlaylistsByUserId'
import { SpeedInsights } from '@vercel/speed-insights/next';


import '../globals.css'

const font = Figtree({ subsets: ['latin'] })


const Layout = async ({children}) => {
  const userPlaylists = await getPlaylistsByUserId();


  return (
    <>
      <ToasterProvider />
        <SpeedInsights />
        <AuthProvider>
          <ModalProvider playlists={userPlaylists} />
          <Sidebar playlists={userPlaylists}>
            {children}
          </Sidebar>
          <Player />
        </AuthProvider>
    </>
  );
}

export default Layout
