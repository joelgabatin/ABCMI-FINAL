"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Users, 
  Calendar, 
  Heart, 
  MessageSquare, 
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  BookOpen,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Church
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const adminNavItems = [
  { title: 'Dashboard', icon: Home, href: '/admin' },
  { title: 'Members', icon: Users, href: '/admin/members' },
  { title: 'Prayer Requests', icon: Heart, href: '/admin/prayers' },
  { title: 'Events', icon: Calendar, href: '/admin/events' },
  { title: 'Counseling', icon: MessageSquare, href: '/admin/counseling' },
  { title: 'Donations', icon: DollarSign, href: '/admin/donations' },
  { title: 'Content', icon: FileText, href: '/admin/content' },
  { title: 'Reports', icon: BarChart3, href: '/admin/reports' },
]

const memberNavItems = [
  { title: 'Dashboard', icon: Home, href: '/member' },
  { title: 'Prayer Request', icon: Heart, href: '/prayer-request' },
  { title: 'Events', icon: Calendar, href: '/events' },
  { title: 'Bible Reading', icon: BookOpen, href: '/bible-reading' },
  { title: 'Counseling', icon: MessageSquare, href: '/counseling' },
  { title: 'Donate', icon: DollarSign, href: '/donate' },
]

const quickLinks = [
  { title: 'About Us', href: '/about' },
  { title: 'Services', href: '/services' },
  { title: 'Ministries', href: '/ministries' },
]

interface DashboardSidebarProps {
  variant: 'admin' | 'member'
}

export function DashboardSidebar({ variant }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()
  
  const navItems = variant === 'admin' ? adminNavItems : memberNavItems

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)] flex items-center justify-center">
            <Church className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm text-foreground leading-tight">
              Arise & Build
            </span>
            <span className="text-xs text-muted-foreground">
              {variant === 'admin' ? 'Admin Panel' : 'Member Portal'}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {variant === 'admin' ? 'Administration' : 'Main Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {variant === 'member' && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {quickLinks.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.href}>
                          <ChevronRight className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {variant === 'member' && isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Admin Access</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Admin Panel">
                      <Link href="/admin" className="text-[var(--church-primary)]">
                        <Settings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {variant === 'admin' && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Switch View</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Member Dashboard">
                      <Link href="/member">
                        <User className="w-4 h-4" />
                        <span>Member View</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Main Website">
                      <Link href="/">
                        <Home className="w-4 h-4" />
                        <span>Main Website</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="w-full justify-start"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-[var(--church-primary)] text-white text-xs">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {user?.email || ''}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="top" 
                align="start"
                className="w-56"
              >
                <DropdownMenuItem asChild>
                  <Link href={variant === 'admin' ? '/admin/settings' : '/member/settings'}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
