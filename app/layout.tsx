import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BuzzBerry',
  description: 'Connect and grow with BuzzBerry - The ultimate platform for social media growth and engagement.',
  keywords: 'BuzzBerry, social media, growth, engagement, influencers, marketing',
  authors: [{ name: 'BuzzBerry' }],
  creator: 'BuzzBerry',
  publisher: 'BuzzBerry',
  robots: 'index, follow',
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'BuzzBerry',
    description: 'Connect and grow with BuzzBerry - The ultimate platform for social media growth and engagement.',
    type: 'website',
    siteName: 'BuzzBerry',
    images: [
      {
        url: '/BuzzberryIcon.png',
        width: 512,
        height: 512,
        alt: 'BuzzBerry Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuzzBerry',
    description: 'Connect and grow with BuzzBerry - The ultimate platform for social media growth and engagement.',
    images: ['/BuzzberryIcon.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/BuzzberryIcon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/BuzzberryIcon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/BuzzberryIcon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 