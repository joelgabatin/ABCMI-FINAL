"use client"

import { useState } from 'react'
import { Bell, Search, LogOut, Settings, User, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

type Notification = {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  type: 'prayer' | 'member' | 'donation' | 'counseling' | 'training' | 'message'
}

const sampleNotifications: Notification[] = [
  { id: 1, title: 'New Prayer Request', message: 'Maria Cruz submitted a prayer request for healing.', time: '5 min ago', read: false, type: 'prayer' },
  { id: 2, title: 'Training Registration', message: 'Carlos Mendoza registered for Church Planting Training.', time: '30 min ago', read: false, type: 'training' },
  { id: 3, title: 'New Member', message: 'Sarah Johnson completed registration and is pending approval.', time: '1 hr ago', read: false, type: 'member' },
  { id: 4, title: 'Counseling Request', message: 'Jose Dela Cruz submitted a counseling request.', time: '2 hrs ago', read: true, type: 'counseling' },
  { id: 5, title: 'Donation Received', message: 'Anonymous donation of ₱2,500 received via online giving.', time: '3 hrs ago', read: true, type: 'donation' },
  { id: 6, title: 'New Message', message: 'You have an unread message from the Contact page.', time: 'Yesterday', read: true, type: 'message' },
]

const notifColors: Record<string, string> = {
  prayer: 'bg-rose-100 text-rose-600',
  member: 'bg-blue-100 text-blue-600',
  donation: 'bg-[var(--church-gold)]/20 text-amber-600',
  counseling: 'bg-purple-100 text-purple-600',
  training: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]',
  message: 'bg-indigo-100 text-indigo-600',
}

interface DashboardHeaderProps {
  title?: string
  breadcrumbBase?: { label: string; href: string }
}

export function DashboardHeader({ title, breadcrumbBase }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)

  const unread = notifications.filter(n => !n.read).length

  function markAllRead() {
    setNotifications(p => p.map(n => ({ ...n, read: true })))
  }

  function markRead(id: number) {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const baseName = breadcrumbBase?.label ?? 'Dashboard'
  const baseHref = breadcrumbBase?.href ?? '/admin'

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {title ? (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={baseHref}>{baseName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <div className="flex-1" />
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-56 pl-8 h-9" />
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[var(--church-primary)] text-[10px] font-bold text-white flex items-center justify-center">
                  {unread}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-sm text-foreground">Notifications</span>
                {unread > 0 && <Badge className="bg-[var(--church-primary)] text-white text-xs border-none">{unread}</Badge>}
              </div>
              {unread > 0 && (
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7" onClick={markAllRead}>
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {notifications.map(n => (
                <button key={n.id} onClick={() => markRead(n.id)}
                  className={cn("w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0", !n.read && "bg-[var(--church-primary)]/3")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5", notifColors[n.type])}>
                    {n.title[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--church-primary)] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-5 hidden md:block" />

        {/* User menu / Sign Out */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 hover:bg-muted/60">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-[var(--church-primary)] text-white text-xs font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-foreground max-w-[120px] truncate">
                {user?.name || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal pb-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/admin/settings" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/permissions" className="cursor-pointer">
                <User className="w-4 h-4 mr-2" /> Permissions
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive cursor-pointer font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
