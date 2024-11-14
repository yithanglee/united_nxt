import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Portal',
  description: 'United v3 Admin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{overflow: 'hidden'}}>
      <body className={inter.className}>
        <AuthProvider>
          
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}