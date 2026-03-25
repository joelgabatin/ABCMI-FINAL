"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  MessageSquare, Calendar, Clock, User, CheckCircle, AlertCircle,
  Search, Filter, XCircle, UserCheck, ChevronDown, RefreshCw, Facebook, MapPin, Phone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { toast } from 'sonner'

type Status = 'pending' | 'approved' | 'declined' | 'completed'

interface CounselingRequest {
  id: number
  full_name: string
  contact_number: string
  address: string | null
  facebook_account: string | null
  preferred_date: string
  preferred_time: string
  counseling_type: 'face-to-face' | 'call' | 'video'
  is_member: boolean
  concern: string
  status: Status
  admin_notes: string | null
  created_at: string
}

const STATUS_TABS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined' },
]

const statusConfig: Record<Status, { className: string; icon: React.ElementType; label: string }> = {
  pending:   { className: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]',   icon: AlertCircle,  label: 'Pending' },
  approved:  { className: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]', icon: Calendar, label: 'Approved' },
  completed: { className: 'bg-emerald-500/10 text-emerald-600',                      icon: CheckCircle,  label: 'Completed' },
  declined:  { className: 'bg-rose-500/10 text-rose-600',                            icon: XCircle,      label: 'Declined' },
}

function NotesDialog({ 
  request, 
  onUpdate 
}: { 
  request: CounselingRequest
  onUpdate: (id: number, notes: string) => void
}) {
  const [notes, setNotes] = useState(request.admin_notes || '')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/counseling/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notes })
      })
      if (!res.ok) throw new Error('Failed to update notes')
      onUpdate(request.id, notes)
      setOpen(false)
      toast.success('Notes updated successfully')
    } catch (error) {
      toast.error('Failed to update notes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs text-balance">
          <MessageSquare className="w-3 h-3" />
          Notes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Notes</DialogTitle>
          <DialogDescription>
            Add private notes for {request.full_name}&apos;s counseling session
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea 
            placeholder="Enter session notes (private)..." 
            rows={5} 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button 
            className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Notes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CounselingCard({
  request,
  onStatusChange,
  onUpdateNotes,
}: {
  request: CounselingRequest
  onStatusChange: (id: number, status: Status) => void
  onUpdateNotes: (id: number, notes: string) => void
}) {
  const config = statusConfig[request.status]
  const StatusIcon = config.icon

  const nextStatuses: { label: string; value: Status; className?: string }[] = [
    { label: 'Mark as Pending',   value: 'pending' },
    { label: 'Approve Request',   value: 'approved' },
    { label: 'Mark as Completed', value: 'completed' },
    { label: 'Decline',           value: 'declined', className: 'text-destructive' },
  ].filter(s => s.value !== request.status)

  const handleStatusUpdate = async (newStatus: Status) => {
    try {
      const res = await fetch(`/api/counseling/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update status')
      onStatusChange(request.id, newStatus)
      toast.success(`Status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold text-balance">
                {request.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground text-sm">{request.full_name}</p>
              <p className="text-xs text-muted-foreground">{request.is_member ? 'Church Member' : 'Non-Member'}</p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
            <Badge variant="secondary" className={`${config.className} text-xs capitalize`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Concern:</p>
          <p className="text-sm text-foreground leading-relaxed line-clamp-3 italic bg-muted/30 p-2 rounded border-l-2 border-[var(--church-primary)]/30">
            "{request.concern}"
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground text-balance">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(request.preferred_date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground text-balance">
            <Clock className="w-3.5 h-3.5" />
            {request.preferred_time}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground text-balance">
            <User className="w-3.5 h-3.5" />
            {request.counseling_type.replace('-', ' ')}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground text-balance">
            <Phone className="w-3.5 h-3.5" />
            {request.contact_number}
          </div>
          {request.facebook_account && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground col-span-2 truncate text-balance">
              <Facebook className="w-3.5 h-3.5" />
              {request.facebook_account}
            </div>
          )}
          {request.address && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground col-span-2 truncate text-balance">
              <MapPin className="w-3.5 h-3.5" />
              {request.address}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-2">
          <NotesDialog request={request} onUpdate={onUpdateNotes} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs gap-1 text-balance">
                Update Status
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {nextStatuses.map((s) => (
                <DropdownMenuItem
                  key={s.value}
                  className={s.className}
                  onClick={() => handleStatusUpdate(s.value)}
                >
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminCounselingPage() {
  const [requests, setRequests] = useState<CounselingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/counseling')
      if (!res.ok) throw new Error('Failed to fetch requests')
      const data = await res.json()
      setRequests(data)
    } catch (error) {
      toast.error('Failed to load counseling requests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleStatusChange = (id: number, status: Status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const handleUpdateNotes = (id: number, admin_notes: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, admin_notes } : r))
  }

  const countByStatus = (s: Status) => requests.filter(r => r.status === s).length

  const filtered = requests.filter(r => {
    const matchSearch = r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.concern.toLowerCase().includes(search.toLowerCase())
    const matchTab = activeTab === 'all' || r.status === activeTab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Counseling Requests</h1>
            <p className="text-muted-foreground mt-1 text-balance">Manage and respond to counseling appointment requests</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 flex-shrink-0 text-balance" onClick={fetchRequests} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Pending',   value: countByStatus('pending'),   color: 'text-[var(--church-gold)]', bg: 'bg-[var(--church-gold)]/10', icon: AlertCircle },
            { label: 'Approved',  value: countByStatus('approved'),  color: 'text-[var(--church-primary)]', icon: Calendar, bg: 'bg-[var(--church-primary)]/10' },
            { label: 'Completed', value: countByStatus('completed'), color: 'text-emerald-600',                      icon: CheckCircle,  bg: 'bg-emerald-500/10' },
            { label: 'Declined',  value: countByStatus('declined'),  color: 'text-rose-600',                            icon: XCircle,      bg: 'bg-rose-500/10' },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or concern..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 text-balance"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 h-auto flex-wrap gap-1 bg-background border">
            {STATUS_TABS.map(tab => {
              const count = tab.value === 'all'
                ? requests.length
                : requests.filter(r => r.status === tab.value).length
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 data-[state=active]:bg-[var(--church-primary)] data-[state=active]:text-white">
                  {tab.label}
                  <span className="text-xs bg-muted-foreground/15 rounded-full px-1.5 py-0.5 font-medium leading-none tabular-nums text-balance">
                    {count}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {STATUS_TABS.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              {loading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="h-48 animate-pulse bg-muted/20" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground text-balance">
                    No {tab.value === 'all' ? '' : tab.label.toLowerCase()} counseling requests found.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered.map(req => (
                    <CounselingCard
                      key={req.id}
                      request={req}
                      onStatusChange={handleStatusChange}
                      onUpdateNotes={handleUpdateNotes}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
