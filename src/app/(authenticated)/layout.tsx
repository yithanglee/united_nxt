import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { UserIcon } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="bg-white shadow-sm z-10">
            <div className="max-w mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900"></h1>
              <Link href="/profile" passHref>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Profile</span>
              </Button>
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className='bg-white p-8 shadow rounded'>

            
            {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </ProtectedRoute>
    
  )
}