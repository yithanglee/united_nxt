'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  HomeIcon,
  ShoppingBagIcon,
  PackageIcon,
  CreditCardIcon,
  UsersIcon,
  BoxIcon,
  TagIcon,
  ScaleIcon,
  DollarSignIcon,
  MapPinIcon,
  MegaphoneIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MenuIcon,
  ExpandIcon,
  ListCollapseIcon,
  WifiIcon,
  WifiOffIcon,
  BookOpen,
  Building,
  Building2,
  FolderOpen,
  Home,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  Tag,
  UserPlus,
  Users,
  LibraryBig,
  CloudUpload,
  FileScan,
  FileClock,
  ChartBar
} from 'lucide-react'
import { usePhoenixChannel } from '@/lib/usePhoenixChannel'

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
      { name: "Logout", href: "/login", icon: LogOut },
    ]
  }
]

export default function Sidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])
  const pathname = usePathname()
  const { counts, isConnected } = usePhoenixChannel()
  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

  const isGroupCollapsed = (groupName: string) => collapsedGroups.includes(groupName)

  const toggleAllGroups = () => {
    if (collapsedGroups.length === navGroups.length) {
      setCollapsedGroups([])
    } else {
      setCollapsedGroups(navGroups.map(group => group.name))
    }
  }

  useEffect(() => {
    // Reset collapsed groups when sidebar is collapsed
    if (isSidebarCollapsed) {
      setCollapsedGroups([])
    }
  }, [isSidebarCollapsed])

  return (
    <nav className={cn(
      "bg-white shadow-md transition-all duration-300 flex flex-col",
      isSidebarCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex justify-between items-center">
        {!isSidebarCollapsed && <h1 className="text-2xl font-bold text-gray-800">United v3 Admin</h1>}
        <div className="flex space-x-2 items-center">
          {!isSidebarCollapsed && (
            <>

              {isConnected ? (
                <WifiIcon className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOffIcon className="h-4 w-4 text-red-500" />
              )}
              <Button variant="ghost" size="icon" onClick={toggleAllGroups}>
                {collapsedGroups.length === navGroups.length ? <ExpandIcon className="h-4 w-4" /> : <ListCollapseIcon className="h-4 w-4" />}
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="space-y-4 p-4">
          {navGroups.map((group, groupIndex) => (
            <div key={group.name}>
              {groupIndex > 0 && <Separator className="my-2" />}
              {!isSidebarCollapsed && (
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="w-full px-4 py-2 flex items-center justify-between text-sm font-semibold text-gray-500 hover:bg-gray-100"
                >
                  {group.name}
                  {isGroupCollapsed(group.name) ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                </button>
              )}
              <ul className={cn(
                "space-y-1 py-2",
                isSidebarCollapsed || !isGroupCollapsed(group.name) ? "block" : "hidden"
              )}>
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                        pathname === item.href
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        isSidebarCollapsed ? "justify-center" : "justify-between"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className={cn("h-5 w-5", isSidebarCollapsed ? "mr-0" : "mr-3")} />
                        {!isSidebarCollapsed && <span>{item.name}</span>}
                      </div>
                      {!isSidebarCollapsed && item.countKey && counts[item.countKey] !== undefined && (
                        <Badge variant="secondary" className="ml-auto">
                          {counts[item.countKey]}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>
    </nav>
  )
}