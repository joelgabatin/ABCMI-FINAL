"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardHeader } from './dashboard-header'
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  variant: 'admin' | 'member' | 'pastor'
  title?: string
  description?: string
}

export function DashboardLayout({ 
  children, 
  variant,
  title,
  description 
}: DashboardLayoutProps) {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login')
      } else if (variant === 'admin' && !isAdmin) {
        router.push('/member')
      }
    }
  }, [user, isLoading, isAdmin, variant, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--church-light-blue)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--church-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (variant === 'admin' && !isAdmin)) {
    return null
  }

  return (
    <SidebarProvider>
      <DashboardSidebar variant={variant} />
      <SidebarInset>
        <DashboardHeader title={title} description={description} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
