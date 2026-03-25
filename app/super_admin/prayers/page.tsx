"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  Heart, Search, CheckCircle, AlertCircle, Loader2,
  Trash2, StickyNote, ChevronDown, RefreshCw, Phone, MapPin, Users
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { toast } from 'sonner'

type PrayerStatus = 'pending' | 'inprayer' | 'interceded'

interface PrayerRequest {
  id: number
  name: string
  contact: string | null
  address: string | null
  request: string
  is_anonymous: boolean
  face_to_face: boolean
  status: PrayerStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
}

const statusConfig: Record<PrayerStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  'pending':    { label: 'Pending',    className: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)] border-[var(--church-gold)]/20',       icon: AlertCircle },
  'inprayer':   { label: 'In Prayer',  className: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20', icon: Heart },
  'interceded': { label: 'Interceded', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',                                    icon: CheckCircle },
}

const TABS: { value: 'all' | PrayerStatus; label: string }[] = [
  { value: 'all',        label: 'All' },
  { value: 'pending',    label: 'Pending' },
  { value: 'inprayer',   label: 'In Prayer' },
  { value: 'interceded', label: 'Interceded' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminPrayersPage() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewItem, setViewItem] = useState<PrayerRequest | null>(null)
  const [notesText, setNotesText] = useState('')
  const [notesLoading, setNotesLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchPrayers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/prayer-requests')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPrayers(data)
    } catch {
      toast.error('Failed to load prayer requests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPrayers() }, [fetchPrayers])

  const updateStatus = async (id: number, status: PrayerStatus) => {
    // Optimistic update
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    if (viewItem?.id === id) setViewItem(prev => prev ? { ...prev, status } : null)

    const res = await fetch(`/api/prayer-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      toast.error('Failed to update status')
      fetchPrayers()
    } else {
      toast.success(`Marked as ${statusConfig[status].label}`)
    }
  }

  const saveNotes = async (id: number) => {
    setNotesLoading(true)
    const res = await fetch(`/api/prayer-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: notesText }),
    })
    if (!res.ok) {
      toast.error('Failed to save notes')
    } else {
      setPrayers(prev => prev.map(p => p.id === id ? { ...p, admin_notes: notesText } : p))
      if (viewItem?.id === id) setViewItem(prev => prev ? { ...prev, admin_notes: notesText } : null)
      setViewItem(null)
      toast.success('Notes saved')
    }
    setNotesLoading(false)
  }

  const deletePrayer = async (id: number) => {
    setDeleteLoading(true)
    const res = await fetch(`/api/prayer-requests/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Failed to delete prayer request')
    } else {
      setPrayers(prev => prev.filter(p => p.id !== id))
      toast.success('Prayer request deleted')
    }
    setDeleteId(null)
    setDeleteLoading(false)
  }

  const getFiltered = (tab: 'all' | PrayerStatus) =>
    prayers.filter(p => {
      const matchTab = tab === 'all' || p.status === tab
      const matchSearch = p.request.toLowerCase().includes(search.toLowerCase()) ||
        p.name.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })

  const countByStatus = (s: PrayerStatus) => prayers.filter(p => p.status === s).length

  const PrayerCard = ({ p }: { p: PrayerRequest }) => {
    const { icon: StatusIcon, className: statusClass, label: statusLabel } = statusConfig[p.status]
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="font-semibold text-sm text-foreground">
                  {p.is_anonymous ? 'Anonymous' : p.name}
                </p>
                {p.face_to_face && (
                  <Badge variant="outline" className="text-xs border-[var(--church-primary)]/30 text-[var(--church-primary)]">
                    <Users className="w-3 h-3 mr-1" />
                    Face-to-Face
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(p.created_at)}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className={`text-xs ${statusClass}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusLabel}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => { setViewItem(p); setNotesText(p.admin_notes || '') }}>
                    <StickyNote className="w-4 h-4 mr-2" /> View & Notes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {p.status !== 'pending' && (
                    <DropdownMenuItem onClick={() => updateStatus(p.id, 'pending')} className="text-[var(--church-gold)]">
                      <AlertCircle className="w-4 h-4 mr-2" /> Mark as Pending
                    </DropdownMenuItem>
                  )}
                  {p.status !== 'inprayer' && (
                    <DropdownMenuItem onClick={() => updateStatus(p.id, 'inprayer')} className="text-[var(--church-primary)]">
                      <Heart className="w-4 h-4 mr-2" /> Mark as In Prayer
                    </DropdownMenuItem>
                  )}
                  {p.status !== 'interceded' && (
                    <DropdownMenuItem onClick={() => updateStatus(p.id, 'interceded')} className="text-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark as Interceded
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDeleteId(p.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {p.contact && !p.is_anonymous && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> {p.contact}
              </span>
            )}
            {p.address && !p.is_anonymous && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {p.address}
              </span>
            )}
          </div>

          <p className="text-sm text-foreground leading-relaxed line-clamp-3">{p.request}</p>

          {p.admin_notes && (
            <div className="mt-3 p-3 rounded-lg bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/15">
              <p className="text-xs font-semibold text-[var(--church-primary)] mb-1">Admin Notes</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{p.admin_notes}</p>
            </div>
          )}

          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <Button
              size="sm" variant="outline" className="flex-1 h-7 text-xs"
              onClick={() => { setViewItem(p); setNotesText(p.admin_notes || '') }}
            >
              <StickyNote className="w-3.5 h-3.5 mr-1" />
              {p.admin_notes ? 'Edit Notes' : 'Add Notes'}
            </Button>
            {p.status === 'pending' && (
              <Button
                size="sm" variant="outline"
                className="flex-1 h-7 text-xs text-[var(--church-primary)] border-[var(--church-primary)]/30 hover:bg-[var(--church-primary)]/10"
                onClick={() => updateStatus(p.id, 'inprayer')}
              >
                <Heart className="w-3.5 h-3.5 mr-1" /> Pray
              </Button>
            )}
            {p.status === 'inprayer' && (
              <Button
                size="sm" variant="outline"
                className="flex-1 h-7 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                onClick={() => updateStatus(p.id, 'interceded')}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Interceded
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prayer Requests</h1>
            <p className="text-muted-foreground mt-1">Review and manage community prayer requests</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={fetchPrayers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{prayers.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{countByStatus('pending')}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{countByStatus('inprayer')}</p>
                <p className="text-xs text-muted-foreground">In Prayer</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{countByStatus('interceded')}</p>
                <p className="text-xs text-muted-foreground">Interceded</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or request..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
              {TABS.map(tab => {
                const count = tab.value === 'all' ? prayers.length : countByStatus(tab.value)
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                    {tab.label}
                    <span className="text-xs bg-muted-foreground/15 rounded-full px-1.5 py-0.5 font-medium leading-none tabular-nums">
                      {count}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {TABS.map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                {getFiltered(tab.value).length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center text-muted-foreground">
                      No {tab.value === 'all' ? '' : tab.label.toLowerCase()} prayer requests found.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {getFiltered(tab.value).map(p => <PrayerCard key={p.id} p={p} />)}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* View / Notes Dialog */}
        <Dialog open={!!viewItem} onOpenChange={open => !open && setViewItem(null)}>
          <DialogContent className="max-w-lg">
            {viewItem && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {viewItem.is_anonymous ? 'Anonymous' : viewItem.name}
                  </DialogTitle>
                  <DialogDescription>
                    {formatDate(viewItem.created_at)}
                    {viewItem.face_to_face && ' · Requested face-to-face'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Contact info */}
                  {!viewItem.is_anonymous && (viewItem.contact || viewItem.address) && (
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {viewItem.contact && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {viewItem.contact}
                        </span>
                      )}
                      {viewItem.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {viewItem.address}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Status chips */}
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'inprayer', 'interceded'] as PrayerStatus[]).map(s => {
                      const { icon: Icon, label } = statusConfig[s]
                      return (
                        <Button
                          key={s}
                          size="sm"
                          variant={viewItem.status === s ? 'default' : 'outline'}
                          className={`text-xs h-7 gap-1 ${viewItem.status === s ? 'bg-[var(--church-primary)] text-white' : ''}`}
                          onClick={() => updateStatus(viewItem.id, s)}
                          disabled={viewItem.status === s}
                        >
                          <Icon className="w-3 h-3" />
                          {label}
                        </Button>
                      )
                    })}
                  </div>

                  <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-4">
                    {viewItem.request}
                  </p>

                  <div className="space-y-2">
                    <Label>Admin Notes (internal only)</Label>
                    <Textarea
                      rows={4}
                      placeholder="Add private notes about this prayer request..."
                      value={notesText}
                      onChange={e => setNotesText(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setViewItem(null)}>
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                      onClick={() => saveNotes(viewItem.id)}
                      disabled={notesLoading}
                    >
                      {notesLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <StickyNote className="w-4 h-4 mr-2" />}
                      Save Notes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this prayer request?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => deleteId !== null && deletePrayer(deleteId)}
                disabled={deleteLoading}
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
