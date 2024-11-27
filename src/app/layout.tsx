import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import ProtectedRoute from '@/components/ProtectedRoute'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'United v3',
  description: 'Library management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ overflow: 'hidden' }}>
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>


        </AuthProvider>
      </body>
    </html>
  )
}