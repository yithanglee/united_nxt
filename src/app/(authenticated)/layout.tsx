'use client'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { BookOpen, Building, Building2, ChartBar, CloudUpload, FileClock, FileScan, FolderOpen, Home, LibraryBig, LogOut, Mail, Settings, ShieldCheck, Tag, UserIcon, UserPlus, Users } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {


interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  countKey?: string
}

interface NavGroup {
  name: string
  items: NavItem[]
}
const navGroups: NavGroup[] = [
  {
    name: "Dashboard",
    items: [
      { name: "Overview", href: "/dashboard", icon: Home },
      { name: "Statistic", href: "/statistic", icon: ChartBar },
      { name: "Loans", href: "/loans", icon: LibraryBig },
      { name: "History", href: "/loans/history", icon: FileClock },
    ]
  },
  {
    name: "Books",
    items: [
      { name: "Books", href: "/books", icon: BookOpen },
      { name: "Authors", href: "/authors", icon: Users },
      { name: "Publishers", href: "/publishers", icon: Building },
      { name: "Tags", href: "/tags", icon: Tag },
      { name: "Categories", href: "/categories", icon: FolderOpen },
      { name: "Scan", href: "/scan", icon: FileScan },
      { name: "Upload", href: "/upload", icon: CloudUpload },
    ]
  },
  {
    name: "Members",
    items: [
      { name: "Organizations", href: "/organizations", icon: Building2 },
      { name: "Email Settings", href: "/smtp_settings", icon: Mail },
      { name: "Admins", href: "/users", icon: ShieldCheck },
      { name: "Members", href: "/members", icon: Users },
      { name: "Groups", href: "/groups", icon: UserPlus },
    ]
  },
  {
    name: "System",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },

    ]
  }
]


  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar navGroups={navGroups} sidebarTitle='United v3 Admin' />
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
            <div className='lg:bg-white p-0 lg:p-8 lg:shadow rounded'>

            
            {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </ProtectedRoute>
    
  )
}