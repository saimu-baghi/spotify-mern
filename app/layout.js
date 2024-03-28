import { Figtree } from 'next/font/google'

import './globals.css'

const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Spotify 2.0',
  description: 'Enjoy the music',
};

export const revalidate = 0;

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className={font.className}>
        {children}
      </body>
    </html>
  );
}
