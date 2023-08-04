import './globals.css'
import { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Providers } from '@/Store/Provider'
import 'react-toastify/dist/ReactToastify.css';

const poppin = Poppins({
  weight: ['100', '400'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fast Buy | Online Shop',
  description: 'Online Shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppin.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
