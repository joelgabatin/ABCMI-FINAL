"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Home,
  Users,
  Calendar,
  Heart,
  MessageSquare,
  MessageSquarePlus,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  BookOpen,
  BookMarked,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Church,
  Star,
  MapPin,
  Clock,
  Shield,
  Radio,
  Mail,
  GraduationCap,
  ChevronDown,
  Link2,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const adminNavItems = [
  { title: 'Dashboard', icon: Home, href: '/super_admin' },
  { title: 'Members', icon: Users, href: '/super_admin/members' },
  { title: 'Prayer Requests', icon: Heart, href: '/super_admin/prayers' },
  { title: 'Events', icon: Calendar, href: '/super_admin/events' },
  { title: 'Counseling', icon: MessageSquare, href: '/super_admin/counseling' },
  { title: 'Donations', icon: DollarSign, href: '/super_admin/donations' },
  { title: 'Testimony', icon: Star, href: '/super_admin/testimony' },
  { title: 'Feedback', icon: MessageSquarePlus, href: '/super_admin/feedback' },
  { title: 'Bible Study', icon: BookOpen, href: '/super_admin/bible-study' },
  { title: 'Daily Devotion', icon: BookMarked, href: '/super_admin/devotion' },
  { title: 'Facebook Live', icon: Radio, href: '/super_admin/live' },
  { title: 'Messages', icon: Mail, href: '/super_admin/messages' },
  { title: 'Missions Training', icon: GraduationCap, href: '/super_admin/missions-training' },
  { title: 'Ministries', icon: Church, href: '/super_admin/ministries' },
  { title: 'Branches', icon: MapPin, href: '/super_admin/branches' },
  { title: 'Content', icon: FileText, href: '/super_admin/content' },
  { title: 'Website Pages', icon: Link2, href: '/super_admin/pages' },
  { title: 'Reports', icon: BarChart3, href: '/super_admin/reports' },
  { title: 'Permissions', icon: Shield, href: '/super_admin/permissions' },
  { title: 'Settings', icon: Settings, href: '/super_admin/settings' },
]

const memberNavItems = [
  { title: 'Dashboard', icon: Home, href: '/member' },
  { title: 'Prayer Request', icon: Heart, href: '/member/prayers' },
  { title: 'Events', icon: Calendar, href: '/member/events' },
  { title: 'Service Schedule', icon: Clock, href: '/member/services' },
  { title: 'Bible Reading', icon: BookOpen, href: '/member/bible-reading' },
  { title: 'Bible Study', icon: BookMarked, href: '/member/bible-study' },
  { title: 'Counseling', icon: MessageSquare, href: '/member/counseling' },
  { title: 'Testimony', icon: Star, href: '/member/testimony' },
  { title: 'Feedback', icon: MessageSquarePlus, href: '/member/feedback' },
  { title: 'Donate', icon: DollarSign, href: '/member/donate' },
]

const pastorNavItems = [
  { title: 'Dashboard', icon: Home, href: '/pastor' },
  { title: 'Branch Monitoring', icon: Church, href: '/pastor/branch' },
  { title: 'Members', icon: Users, href: '/pastor/members' },
  { title: 'Counseling', icon: MessageSquare, href: '/pastor/counseling' },
  { title: 'Prayer Requests', icon: Heart, href: '/pastor/prayers' },
  { title: 'Service Schedule', icon: Clock, href: '/pastor/schedule' },
  { title: 'Report Submission', icon: BarChart3, href: '/pastor/reports' },
]

const quickLinks = [
  { title: 'About Us', href: '/about' },
  { title: 'Services', href: '/services' },
  { title: 'Ministries', href: '/ministries' },
]

interface DashboardSidebarProps {
  variant: 'admin' | 'member' | 'pastor'
}

const branchSubItems = [
  { title: 'Branches',  icon: MapPin, href: '/super_admin/branches?tab=branches' },
  { title: 'Members',   icon: Users,  href: '/super_admin/branches?tab=members'  },
  { title: 'Pastors',   icon: Shield, href: '/super_admin/branches?tab=pastors'  },
]

export function DashboardSidebar({ variant }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()
  const isBranchesActive = pathname === '/super_admin/branches'
  const [branchesOpen, setBranchesOpen] = useState(isBranchesActive)

  const navItems = variant === 'admin' ? adminNavItems : variant === 'pastor' ? pastorNavItems : memberNavItems

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
          <img 
            src="/images/abcmi-logo.png" 
            alt="Arise and Build For Christ Ministries" 
            className="w-10 h-10 rounded-lg"
          />
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm text-foreground leading-tight">
              Arise & Build
            </span>
            <span className="text-xs text-muted-foreground">
              {variant === 'admin' ? 'Admin Panel' : variant === 'pastor' ? 'Pastor Portal' : 'Member Portal'}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {variant === 'admin' ? 'Administration' : variant === 'pastor' ? 'Pastor Portal' : 'Main Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (item.title === 'Branches' && variant === 'admin') {
                  return (
                    <Collapsible key="branches" open={branchesOpen} onOpenChange={setBranchesOpen} asChild>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isBranchesActive}
                            tooltip="Branches"
                            className="w-full"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>Branches</span>
                            <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-200 ${branchesOpen ? 'rotate-180' : ''}`} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {branchSubItems.map(sub => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname + (typeof window !== 'undefined' ? window.location.search : '') === sub.href}
                                >
                                  <Link href={sub.href}>
                                    <sub.icon className="w-3.5 h-3.5" />
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }
                return (
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
                )
              })}
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
                      <Link href="/super_admin" className="text-[var(--church-primary)]">
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
                  <Link href={variant === 'admin' ? '/super_admin/settings' : '/member/settings'}>
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
