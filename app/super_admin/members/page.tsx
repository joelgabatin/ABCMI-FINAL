"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  Users, Search, Filter, MoreHorizontal, Mail,
  CheckCircle, Clock, UserPlus, Download, ShieldOff,
  ShieldCheck, Circle, RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Member {
  id: string
  name: string
  email: string
  role: string
  avatar_url: string | null
  created_at: string
  is_active: boolean
  last_seen: string | null
}

function isOnline(last_seen: string | null): boolean {
  if (!last_seen) return false
  return (Date.now() - new Date(last_seen).getTime()) < 5 * 60 * 1000
}

function formatJoined(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const ROLE_FILTERS = ['All', 'member', 'pastor', 'admin', 'super_admin']

export default function AdminMembersPage() {
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string; action: 'deactivate' | 'activate' } | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('get_all_members')
    if (error) {
      toast.error(`Failed to load members: ${error.message}`)
    } else if (data) {
      setMembers(data as Member[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMembers()

    // Realtime: re-fetch whenever profiles change
    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchMembers()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchMembers])

  const handleToggleActive = async () => {
    if (!confirmTarget) return
    const { error } = await supabase.rpc('set_member_active', {
      member_id: confirmTarget.id,
      active: confirmTarget.action === 'activate',
    })
    if (error) {
      toast.error('Failed to update account status.')
    } else {
      toast.success(
        confirmTarget.action === 'activate'
          ? `${confirmTarget.name}'s account has been activated.`
          : `${confirmTarget.name}'s account has been deactivated.`
      )
      setMembers(prev => prev.map(m =>
        m.id === confirmTarget.id ? { ...m, is_active: confirmTarget.action === 'activate' } : m
      ))
    }
    setConfirmTarget(null)
  }

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'All' || m.role === filterRole
    const matchStatus = filterStatus === 'All' ||
      (filterStatus === 'active' && m.is_active) ||
      (filterStatus === 'deactivated' && !m.is_active)
    return matchSearch && matchRole && matchStatus
  })

  const onlineCount = members.filter(m => isOnline(m.last_seen)).length
  const activeCount = members.filter(m => m.is_active).length
  const deactivatedCount = members.filter(m => !m.is_active).length

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Members</h1>
            <p className="text-muted-foreground mt-1">Manage your church membership directory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchMembers} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{members.length}</p>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Circle className="w-5 h-5 fill-emerald-500 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{onlineCount}</p>
                <p className="text-xs text-muted-foreground">Online Now</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active Accounts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ShieldOff className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{deactivatedCount}</p>
                <p className="text-xs text-muted-foreground">Deactivated</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 capitalize">
                  <Filter className="w-4 h-4" />
                  {filterRole === 'All' ? 'All Roles' : filterRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {ROLE_FILTERS.map(r => (
                  <DropdownMenuItem key={r} onClick={() => setFilterRole(r)} className="capitalize">
                    {r === 'All' ? 'All Roles' : r}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 capitalize">
                  <Filter className="w-4 h-4" />
                  {filterStatus === 'All' ? 'All Status' : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['All', 'active', 'deactivated'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)} className="capitalize">{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Member Directory</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `${filtered.length} member${filtered.length !== 1 ? 's' : ''} found`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Online</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                        Loading members...
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                        No members found.
                      </TableCell>
                    </TableRow>
                  ) : filtered.map(member => {
                    const online = isOnline(member.last_seen)
                    return (
                      <TableRow key={member.id} className={!member.is_active ? 'opacity-60' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-9 h-9">
                                <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                                  {getInitials(member.name || 'U')}
                                </AvatarFallback>
                              </Avatar>
                              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${online ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground hidden sm:block">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Circle className={`w-2.5 h-2.5 ${online ? 'fill-emerald-500 text-emerald-500' : 'fill-muted-foreground/40 text-muted-foreground/40'}`} />
                            <span className={`text-xs font-medium ${online ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                              {online ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-xs capitalize">
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.is_active ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs opacity-80">
                              Deactivated
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {formatJoined(member.created_at)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {member.is_active ? (
                                <DropdownMenuItem
                                  className="text-destructive gap-2"
                                  onClick={() => setConfirmTarget({ id: member.id, name: member.name, action: 'deactivate' })}
                                >
                                  <ShieldOff className="w-3.5 h-3.5" />
                                  Deactivate Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-emerald-600 gap-2"
                                  onClick={() => setConfirmTarget({ id: member.id, name: member.name, action: 'activate' })}
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Activate Account
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Deactivate / Activate Confirm Dialog */}
      <AlertDialog open={confirmTarget !== null} onOpenChange={() => setConfirmTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmTarget?.action === 'deactivate' ? 'Deactivate Account?' : 'Activate Account?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget?.action === 'deactivate'
                ? `${confirmTarget?.name} will no longer be able to log in or access the website. You can reactivate their account at any time.`
                : `${confirmTarget?.name}'s account will be restored and they will be able to log in again.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleActive}
              className={confirmTarget?.action === 'deactivate'
                ? 'bg-destructive hover:bg-destructive/90'
                : 'bg-emerald-600 hover:bg-emerald-700'
              }
            >
              {confirmTarget?.action === 'deactivate' ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
