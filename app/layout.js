import { Inter } from 'next/font/google'
import './globals.css'
import PWAInstaller from "../components/PWAInstaller"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HelioIQ - Your GLP-1 Daily Insight Companion',
  description: 'Understand daily weight fluctuations with AI-powered insights while on GLP-1 medications',
  manifest: '/manifest.json',
  themeColor: '#101214',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HelioIQ',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} bg-primary-bg text-body-text antialiased`}>
        <PWAInstaller />
        {children}
      </body>
    </html>
  )
}
