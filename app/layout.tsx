import type { Metadata, Viewport } from 'next'
import { Montserrat, Open_Sans, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
})

const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const lora = Lora({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Arise and Build For Christ Ministries Inc.',
  description: 'A faith-centered community dedicated to spreading the Gospel, nurturing believers, and building disciples for Christ. Join us in worship, prayer, and fellowship.',
  keywords: ['church', 'ministry', 'christian', 'worship', 'prayer', 'bible study', 'fellowship'],
  authors: [{ name: 'Arise and Build For Christ Ministries Inc.' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2EA8DF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${montserrat.variable} ${openSans.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
