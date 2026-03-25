"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Edit, Trash2, Search, ChevronLeft, Calendar,
  Users, Clock, MapPin, Eye, EyeOff, RefreshCw,
  Shield, UserPlus, Church, ChevronRight, Image, X,
  Phone, ListChecks, FileText, Palette,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// ── Types ────────────────────────────────────────────────────────────────────
interface Ministry {
  id: number
  name: string
  description: string
  long_description: string
  meeting_time: string
  color: string
  icon: string
  visible: boolean
  overseer: string
  co_leader: string
  location: string
  contact: string
  background_image_url: string
  activities: string[]
  slug: string
  created_at: string
}

interface BranchMinistry {
  id: number
  ministry_id: number
  branch_id: number
  leader_name: string
  meeting_time: string | null
  status: string
}

interface MinistryMember {
  id: number
  branch_ministry_id: number
  name: string
  profile_id: string | null
  role: string
  joined_date: string
  status: string
}

interface MinistryEvent {
  id: number
  branch_ministry_id: number
  title: string
  date: string
  time: string
  location: string
  event_description: string
  type: string
}

interface Branch {
  id: number
  name: string
}

// ── Constants ────────────────────────────────────────────────────────────────
const colorOptions = [
  { label: 'Church Blue', value: 'bg-[var(--church-primary)]' },
  { label: 'Gold',        value: 'bg-[var(--church-gold)]' },
  { label: 'Emerald',     value: 'bg-emerald-500' },
  { label: 'Rose',        value: 'bg-rose-500' },
  { label: 'Orange',      value: 'bg-orange-500' },
  { label: 'Indigo',      value: 'bg-indigo-500' },
  { label: 'Teal',        value: 'bg-teal-500' },
  { label: 'Pink',        value: 'bg-pink-500' },
]

const eventTypes = ['Service', 'Training', 'Retreat', 'Outreach', 'Fellowship', 'Special']
const eventTypeColors: Record<string, string> = {
  Training:   'bg-blue-500/10 text-blue-600',
  Service:    'bg-[var(--church-primary)]/10 text-[var(--church-primary)]',
  Retreat:    'bg-emerald-500/10 text-emerald-600',
  Outreach:   'bg-rose-500/10 text-rose-600',
  Fellowship: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]',
  Special:    'bg-purple-500/10 text-purple-600',
}

const emptyMinistryForm = {
  name: '', description: '', long_description: '', meeting_time: '',
  color: 'bg-[var(--church-primary)]', icon: 'Users', visible: true,
  overseer: '', co_leader: '', location: '', contact: '',
  background_image_url: '', slug: '',
}
const emptyEvent  = { title: '', date: '', time: '', location: '', event_description: '', type: 'Service' }
const emptyMember = { name: '', role: 'member', joined_date: '' }

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminMinistriesPage() {
  const supabase = createClient()

  // Data
  const [ministries,       setMinistries]       = useState<Ministry[]>([])
  const [branchMinistries, setBranchMinistries] = useState<BranchMinistry[]>([])
  const [members,          setMembers]          = useState<MinistryMember[]>([])
  const [events,           setEvents]           = useState<MinistryEvent[]>([])
  const [branches,         setBranches]         = useState<Branch[]>([])
  const [loading,          setLoading]          = useState(true)

  // Navigation
  const [selectedMinistry,       setSelectedMinistry]       = useState<Ministry | null>(null)
  const [selectedBranchMinistry, setSelectedBranchMinistry] = useState<BranchMinistry | null>(null)

  // Ministry inline form (replaces modal)
  const [ministryFormOpen,  setMinistryFormOpen]  = useState(false)
  const [editingMinistry,   setEditingMinistry]   = useState<Ministry | null>(null)
  const [ministryForm,      setMinistryForm]      = useState(emptyMinistryForm)
  const [activities,        setActivities]        = useState<string[]>([])
  const [activityInput,     setActivityInput]     = useState('')
  const [deleteMinistryId,  setDeleteMinistryId]  = useState<number | null>(null)

  // Branch Ministry (leader) dialog
  const [bmDialog,   setBmDialog]   = useState(false)
  const [editingBm,  setEditingBm]  = useState<BranchMinistry | null>(null)
  const [bmForm,     setBmForm]     = useState({ branch_id: 0, leader_name: '', meeting_time: '', status: 'active' })
  const [deleteBmId, setDeleteBmId] = useState<number | null>(null)

  // Member dialog
  const [memberDialog,    setMemberDialog]    = useState(false)
  const [editingMember,   setEditingMember]   = useState<MinistryMember | null>(null)
  const [memberForm,      setMemberForm]      = useState(emptyMember)
  const [deleteMemberId,  setDeleteMemberId]  = useState<number | null>(null)

  // Event dialog
  const [eventDialog,   setEventDialog]   = useState(false)
  const [editingEvent,  setEditingEvent]  = useState<MinistryEvent | null>(null)
  const [eventForm,     setEventForm]     = useState(emptyEvent)
  const [deleteEventId, setDeleteEventId] = useState<number | null>(null)

  // Filters
  const [search,       setSearch]       = useState('')
  const [branchFilter, setBranchFilter] = useState<number | 'all'>('all')

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [m, bm, mm, me, br] = await Promise.all([
      supabase.from('ministries').select('*').order('id'),
      supabase.from('branch_ministries').select('*').order('id'),
      supabase.from('ministry_members').select('*').order('id'),
      supabase.from('ministry_events').select('*').order('date'),
      supabase.from('branches').select('id, name').order('id'),
    ])
    if (m.error)  console.error('ministries error:',  m.error)
    if (bm.error) console.error('branch_ministries:', bm.error)
    if (mm.error) console.error('ministry_members:',  mm.error)
    if (me.error) console.error('ministry_events:',   me.error)
    if (br.error) console.error('branches error:',    br.error)
    if (m.data)  setMinistries(m.data as Ministry[])
    if (bm.data) setBranchMinistries(bm.data as BranchMinistry[])
    if (mm.data) setMembers(mm.data as MinistryMember[])
    if (me.data) setEvents(me.data as MinistryEvent[])
    if (br.data) setBranches(br.data as Branch[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Ministry helpers ────────────────────────────────────────────────────────
  const openAddMinistry = () => {
    setEditingMinistry(null)
    setMinistryForm(emptyMinistryForm)
    setActivities([])
    setActivityInput('')
    setMinistryFormOpen(true)
  }

  const openEditMinistry = (m: Ministry) => {
    setEditingMinistry(m)
    setMinistryForm({
      name: m.name, description: m.description, long_description: m.long_description || '',
      meeting_time: m.meeting_time, color: m.color, icon: m.icon, visible: m.visible,
      overseer: m.overseer, co_leader: m.co_leader || '', location: m.location || '',
      contact: m.contact || '', background_image_url: m.background_image_url || '',
      slug: m.slug || '',
    })
    setActivities(m.activities || [])
    setActivityInput('')
    setMinistryFormOpen(true)
  }

  const closeMinistryForm = () => {
    setMinistryFormOpen(false)
    setEditingMinistry(null)
  }

  const addActivity = () => {
    const val = activityInput.trim()
    if (!val) return
    setActivities(prev => [...prev, val])
    setActivityInput('')
  }

  const removeActivity = (i: number) => {
    setActivities(prev => prev.filter((_, idx) => idx !== i))
  }

  const saveMinistry = async () => {
    if (!ministryForm.name.trim()) { toast.error('Ministry name is required.'); return }
    const slug = ministryForm.slug.trim() || toSlug(ministryForm.name)
    const payload = { ...ministryForm, slug, activities }

    if (editingMinistry) {
      const { error } = await supabase.from('ministries').update(payload).eq('id', editingMinistry.id)
      if (error) { toast.error('Failed to update ministry.'); return }
      const updated = { ...editingMinistry, ...payload }
      setMinistries(prev => prev.map(m => m.id === editingMinistry.id ? updated : m))
      if (selectedMinistry?.id === editingMinistry.id) setSelectedMinistry(updated)
    } else {
      const { data, error } = await supabase.from('ministries').insert(payload).select().single()
      if (error) { toast.error('Failed to add ministry.'); return }
      setMinistries(prev => [...prev, data as Ministry])
    }
    toast.success(editingMinistry ? 'Ministry updated.' : 'Ministry created.')
    closeMinistryForm()
  }

  const deleteMinistry = async (id: number) => {
    const { error } = await supabase.from('ministries').delete().eq('id', id)
    if (error) { toast.error('Failed to delete ministry.'); return }
    setMinistries(prev => prev.filter(m => m.id !== id))
    if (selectedMinistry?.id === id) setSelectedMinistry(null)
    setDeleteMinistryId(null)
    toast.success('Ministry deleted.')
  }

  const toggleVisible = async (ministry: Ministry) => {
    const { error } = await supabase.from('ministries').update({ visible: !ministry.visible }).eq('id', ministry.id)
    if (error) { toast.error('Failed to update visibility.'); return }
    setMinistries(prev => prev.map(m => m.id === ministry.id ? { ...m, visible: !m.visible } : m))
  }

  // ── Branch Ministry helpers ─────────────────────────────────────────────────
  const openAddBm = () => {
    setEditingBm(null)
    setBmForm({ branch_id: 0, leader_name: '', meeting_time: '', status: 'active' })
    setBmDialog(true)
  }
  const openEditBm = (bm: BranchMinistry) => {
    setEditingBm(bm)
    setBmForm({ branch_id: bm.branch_id, leader_name: bm.leader_name, meeting_time: bm.meeting_time || '', status: bm.status })
    setBmDialog(true)
  }

  const saveBm = async () => {
    if (!selectedMinistry) return
    if (bmForm.branch_id === 0) { toast.error('Select a branch.'); return }
    if (editingBm) {
      const { error } = await supabase.from('branch_ministries').update({ leader_name: bmForm.leader_name, meeting_time: bmForm.meeting_time, status: bmForm.status }).eq('id', editingBm.id)
      if (error) { toast.error('Failed to update.'); return }
      setBranchMinistries(prev => prev.map(b => b.id === editingBm.id ? { ...b, ...bmForm } : b))
      toast.success('Branch ministry updated.')
    } else {
      const payload = { ministry_id: selectedMinistry.id, branch_id: bmForm.branch_id, leader_name: bmForm.leader_name, meeting_time: bmForm.meeting_time, status: bmForm.status }
      const { data, error } = await supabase.from('branch_ministries').insert(payload).select().single()
      if (error) { toast.error(error.message.includes('unique') ? 'This branch already has this ministry.' : 'Failed to add branch.'); return }
      setBranchMinistries(prev => [...prev, data as BranchMinistry])
      toast.success('Branch added to ministry.')
    }
    setBmDialog(false)
  }

  const deleteBm = async (id: number) => {
    const { error } = await supabase.from('branch_ministries').delete().eq('id', id)
    if (error) { toast.error('Failed to remove branch ministry.'); return }
    setBranchMinistries(prev => prev.filter(b => b.id !== id))
    if (selectedBranchMinistry?.id === id) setSelectedBranchMinistry(null)
    setDeleteBmId(null)
    toast.success('Branch removed from ministry.')
  }

  // ── Member helpers ──────────────────────────────────────────────────────────
  const openAddMember    = () => { setEditingMember(null); setMemberForm(emptyMember); setMemberDialog(true) }
  const openEditMember   = (m: MinistryMember) => {
    setEditingMember(m)
    setMemberForm({ name: m.name, role: m.role, joined_date: m.joined_date })
    setMemberDialog(true)
  }

  const saveMember = async () => {
    if (!selectedBranchMinistry) return
    if (!memberForm.name.trim()) { toast.error('Name is required.'); return }
    if (editingMember) {
      const { error } = await supabase.from('ministry_members').update(memberForm).eq('id', editingMember.id)
      if (error) { toast.error('Failed to update member.'); return }
      setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...memberForm } : m))
    } else {
      const payload = { branch_ministry_id: selectedBranchMinistry.id, ...memberForm, status: 'active' }
      const { data, error } = await supabase.from('ministry_members').insert(payload).select().single()
      if (error) { toast.error('Failed to add member.'); return }
      setMembers(prev => [...prev, data as MinistryMember])
    }
    toast.success(editingMember ? 'Member updated.' : 'Member added.')
    setMemberDialog(false)
  }

  const deleteMember = async (id: number) => {
    const { error } = await supabase.from('ministry_members').delete().eq('id', id)
    if (error) { toast.error('Failed to remove member.'); return }
    setMembers(prev => prev.filter(m => m.id !== id))
    setDeleteMemberId(null)
    toast.success('Member removed.')
  }

  // ── Event helpers ───────────────────────────────────────────────────────────
  const openAddEvent  = () => { setEditingEvent(null); setEventForm(emptyEvent); setEventDialog(true) }
  const openEditEvent = (e: MinistryEvent) => {
    setEditingEvent(e)
    setEventForm({ title: e.title, date: e.date, time: e.time, location: e.location, event_description: e.event_description, type: e.type })
    setEventDialog(true)
  }

  const saveEvent = async () => {
    if (!selectedBranchMinistry) return
    if (!eventForm.title.trim()) { toast.error('Event title is required.'); return }
    if (editingEvent) {
      const { error } = await supabase.from('ministry_events').update(eventForm).eq('id', editingEvent.id)
      if (error) { toast.error('Failed to update event.'); return }
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...eventForm } : e))
    } else {
      const payload = { branch_ministry_id: selectedBranchMinistry.id, ...eventForm }
      const { data, error } = await supabase.from('ministry_events').insert(payload).select().single()
      if (error) { toast.error('Failed to add event.'); return }
      setEvents(prev => [...prev, data as MinistryEvent])
    }
    toast.success(editingEvent ? 'Event updated.' : 'Event added.')
    setEventDialog(false)
  }

  const deleteEvent = async (id: number) => {
    const { error } = await supabase.from('ministry_events').delete().eq('id', id)
    if (error) { toast.error('Failed to delete event.'); return }
    setEvents(prev => prev.filter(e => e.id !== id))
    setDeleteEventId(null)
    toast.success('Event deleted.')
  }

  // ── Derived helpers ──────────────────────────────────────────────────────────
  const getBranchName      = (id: number) => branches.find(b => b.id === id)?.name || 'Unknown'
  const getBmsForMinistry  = (ministryId: number) => branchMinistries.filter(bm => bm.ministry_id === ministryId)
  const getMembersForBm    = (bmId: number) => members.filter(m => m.branch_ministry_id === bmId)
  const getEventsForBm     = (bmId: number) => events.filter(e => e.branch_ministry_id === bmId)

  const totalMembersForMinistry = (ministryId: number) => {
    const bmIds = getBmsForMinistry(ministryId).map(bm => bm.id)
    return members.filter(m => bmIds.includes(m.branch_ministry_id)).length
  }
  const totalEventsForMinistry = (ministryId: number) => {
    const bmIds = getBmsForMinistry(ministryId).map(bm => bm.id)
    return events.filter(e => bmIds.includes(e.branch_ministry_id)).length
  }

  const filtered = ministries.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.overseer || '').toLowerCase().includes(search.toLowerCase())
  )

  const selectedMinistryBms = selectedMinistry
    ? getBmsForMinistry(selectedMinistry.id).filter(bm =>
        branchFilter === 'all' || bm.branch_id === branchFilter
      )
    : []

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">

        {/* ── VIEW: Ministry Form (full inline section) ── */}
        {ministryFormOpen ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Form header */}
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2" onClick={closeMinistryForm}>
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {editingMinistry ? 'Edit Ministry' : 'Create New Ministry'}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  This ministry will appear across all branches and on the public website.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* ── LEFT COLUMN ── */}
              <div className="lg:col-span-2 space-y-5">

                {/* Basic Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--church-primary)]" /> Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ministry Name <span className="text-destructive">*</span></Label>
                        <Input
                          value={ministryForm.name}
                          onChange={e => {
                            const name = e.target.value
                            setMinistryForm(f => ({
                              ...f, name,
                              slug: f.slug || toSlug(name),
                            }))
                          }}
                          placeholder="e.g. Music Ministry"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL Slug</Label>
                        <Input
                          value={ministryForm.slug}
                          onChange={e => setMinistryForm(f => ({ ...f, slug: e.target.value }))}
                          placeholder="music-ministry"
                        />
                        <p className="text-xs text-muted-foreground">Used in website URL: /ministries/<strong>{ministryForm.slug || 'slug'}</strong></p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Overseer (Organization-wide)</Label>
                        <Input
                          value={ministryForm.overseer}
                          onChange={e => setMinistryForm(f => ({ ...f, overseer: e.target.value }))}
                          placeholder="e.g. Ptr. Fhey Coyoy"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Co-Leader / Deputy</Label>
                        <Input
                          value={ministryForm.co_leader}
                          onChange={e => setMinistryForm(f => ({ ...f, co_leader: e.target.value }))}
                          placeholder="e.g. Bro. Daniel Paloma"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--church-primary)]" /> Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Short Description</Label>
                      <Textarea
                        value={ministryForm.description}
                        onChange={e => setMinistryForm(f => ({ ...f, description: e.target.value }))}
                        rows={2}
                        placeholder="A brief one-line summary shown on the ministries listing page."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>About This Ministry (Long Description)</Label>
                      <Textarea
                        value={ministryForm.long_description}
                        onChange={e => setMinistryForm(f => ({ ...f, long_description: e.target.value }))}
                        rows={6}
                        placeholder="Detailed description shown on the ministry detail page. Include the ministry's vision, values, and what members do."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Regular Activities */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-[var(--church-primary)]" /> Regular Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={activityInput}
                        onChange={e => setActivityInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addActivity() } }}
                        placeholder="e.g. Weekly worship rehearsals every Saturday"
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={addActivity} className="gap-1.5 shrink-0">
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </div>
                    {activities.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                        No activities added yet. Type an activity above and press Enter or Add.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {activities.map((act, i) => (
                          <li key={i} className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg group">
                            <div className="w-6 h-6 rounded-full bg-[var(--church-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">{i + 1}</span>
                            </div>
                            <span className="text-sm text-foreground flex-1 leading-relaxed">{act}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive shrink-0"
                              onClick={() => removeActivity(i)}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="space-y-5">

                {/* Appearance */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[var(--church-primary)]" /> Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme Color</Label>
                      <Select value={ministryForm.color} onValueChange={v => setMinistryForm(f => ({ ...f, color: v }))}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${ministryForm.color}`} />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map(c => (
                            <SelectItem key={c.value} value={c.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3.5 h-3.5 rounded-full ${c.value}`} />
                                {c.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Image className="w-3.5 h-3.5" /> Section Background Image URL
                      </Label>
                      <Input
                        value={ministryForm.background_image_url}
                        onChange={e => setMinistryForm(f => ({ ...f, background_image_url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                      {ministryForm.background_image_url && (
                        <div className="relative mt-2 rounded-lg overflow-hidden h-28 border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ministryForm.background_image_url}
                            alt="Background preview"
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <p className="text-white text-xs font-medium">Preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                      <Switch
                        checked={ministryForm.visible}
                        onCheckedChange={v => setMinistryForm(f => ({ ...f, visible: v }))}
                      />
                      <div>
                        <Label className="cursor-pointer">Visible on Website</Label>
                        <p className="text-xs text-muted-foreground">Show this ministry on the public site</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule & Contact */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--church-primary)]" /> Schedule & Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Default Meeting Schedule</Label>
                      <Input
                        value={ministryForm.meeting_time}
                        onChange={e => setMinistryForm(f => ({ ...f, meeting_time: e.target.value }))}
                        placeholder="e.g. Saturdays, 4:00 PM"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Meeting Location</Label>
                      <Input
                        value={ministryForm.location}
                        onChange={e => setMinistryForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Main Sanctuary, ABCMI"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Contact</Label>
                      <Input
                        value={ministryForm.contact}
                        onChange={e => setMinistryForm(f => ({ ...f, contact: e.target.value }))}
                        placeholder="e.g. musicministry@abcmi.org"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Save */}
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                    onClick={saveMinistry}
                  >
                    {editingMinistry ? 'Save Changes' : 'Create Ministry'}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={closeMinistryForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>

        /* ── VIEW 3: Branch-ministry detail (members + events) ── */
        ) : selectedBranchMinistry && selectedMinistry ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <button onClick={() => { setSelectedBranchMinistry(null) }} className="hover:text-foreground transition-colors">
                    {selectedMinistry.name}
                  </button>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-foreground">{getBranchName(selectedBranchMinistry.branch_id)}</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground">{getBranchName(selectedBranchMinistry.branch_id)} Branch</h1>
                <p className="text-muted-foreground mt-1">{selectedMinistry.name} — members &amp; events</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={fetchAll} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>

            <Button variant="outline" className="gap-2" onClick={() => setSelectedBranchMinistry(null)}>
              <ChevronLeft className="w-4 h-4" /> Back to {selectedMinistry.name}
            </Button>

            {/* Branch ministry header card */}
            <Card>
              <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${selectedMinistry.color} flex items-center justify-center flex-shrink-0`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{getBranchName(selectedBranchMinistry.branch_id)}</p>
                    <p className="text-sm text-muted-foreground">
                      Leader: <span className="text-foreground font-medium">{selectedBranchMinistry.leader_name || 'Not assigned'}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getMembersForBm(selectedBranchMinistry.id).length} members · {getEventsForBm(selectedBranchMinistry.id).length} events
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEditBm(selectedBranchMinistry)}>
                  <Edit className="w-3.5 h-3.5" /> Edit Leader
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="members">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <TabsList>
                  <TabsTrigger value="members">Members ({getMembersForBm(selectedBranchMinistry.id).length})</TabsTrigger>
                  <TabsTrigger value="events">Events ({getEventsForBm(selectedBranchMinistry.id).length})</TabsTrigger>
                </TabsList>
              </div>

              {/* Members */}
              <TabsContent value="members">
                <div className="flex justify-end mb-3">
                  <Button size="sm" onClick={openAddMember} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                    <UserPlus className="w-4 h-4" /> Add Member
                  </Button>
                </div>
                {getMembersForBm(selectedBranchMinistry.id).length === 0 ? (
                  <Card><CardContent className="p-12 text-center text-muted-foreground">No members yet. Add the first member.</CardContent></Card>
                ) : (
                  <div className="space-y-2">
                    {getMembersForBm(selectedBranchMinistry.id).map(member => (
                      <Card key={member.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <Avatar className="w-9 h-9 flex-shrink-0">
                            <AvatarFallback className={`${member.role === 'leader' ? 'bg-[var(--church-gold)]/20 text-[var(--church-gold)]' : 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]'} text-sm font-semibold`}>
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">Joined: {member.joined_date}</p>
                          </div>
                          <Badge className={member.role === 'leader' ? 'bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30 capitalize' : 'bg-[var(--church-primary)]/10 text-[var(--church-primary)] capitalize'}>
                            {member.role}
                          </Badge>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditMember(member)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteMemberId(member.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Events */}
              <TabsContent value="events">
                <div className="flex justify-end mb-3">
                  <Button size="sm" onClick={openAddEvent} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                    <Plus className="w-4 h-4" /> Add Event
                  </Button>
                </div>
                {getEventsForBm(selectedBranchMinistry.id).length === 0 ? (
                  <Card><CardContent className="p-12 text-center text-muted-foreground">No events yet.</CardContent></Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {getEventsForBm(selectedBranchMinistry.id).map(event => (
                      <Card key={event.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="secondary" className={`text-xs ${eventTypeColors[event.type] || 'bg-muted text-muted-foreground'}`}>{event.type}</Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditEvent(event)}><Edit className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteEventId(event.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                          <CardTitle className="text-base mt-1">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.event_description}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="w-3 h-3" />{event.date} {event.time && `at ${event.time}`}</div>
                            {event.location && <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{event.location}</div>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

        /* ── VIEW 2: Ministry detail (branch list) ── */
        ) : selectedMinistry ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{selectedMinistry.name}</h1>
                <p className="text-muted-foreground mt-1">Overseer: {selectedMinistry.overseer} · {getBmsForMinistry(selectedMinistry.id).length} branches</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={fetchAll} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </div>
            </div>

            <Button variant="outline" className="gap-2" onClick={() => setSelectedMinistry(null)}>
              <ChevronLeft className="w-4 h-4" /> Back to Ministries
            </Button>

            {/* Ministry header card */}
            <Card>
              <CardContent className="p-6 flex items-start gap-4 flex-wrap">
                <div className={`w-14 h-14 rounded-xl ${selectedMinistry.color} flex items-center justify-center flex-shrink-0`}>
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-foreground">{selectedMinistry.name}</h2>
                    <Badge variant="secondary" className={selectedMinistry.visible ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}>
                      {selectedMinistry.visible ? 'Visible' : 'Hidden'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Overseer: <span className="font-medium text-foreground">{selectedMinistry.overseer || 'Not assigned'}</span>
                    {selectedMinistry.co_leader && (
                      <> · Co-Leader: <span className="font-medium text-foreground">{selectedMinistry.co_leader}</span></>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{selectedMinistry.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                    {selectedMinistry.meeting_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedMinistry.meeting_time}</span>}
                    {selectedMinistry.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedMinistry.location}</span>}
                    <span className="flex items-center gap-1"><Church className="w-3 h-3" />{getBmsForMinistry(selectedMinistry.id).length} branches</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{totalMembersForMinistry(selectedMinistry.id)} total members</span>
                  </div>
                  {selectedMinistry.activities && selectedMinistry.activities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Regular Activities:</p>
                      <ul className="flex flex-col gap-0.5">
                        {selectedMinistry.activities.slice(0, 3).map((a, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--church-primary)] flex-shrink-0" />
                            {a}
                          </li>
                        ))}
                        {selectedMinistry.activities.length > 3 && (
                          <li className="text-xs text-muted-foreground ml-3">+{selectedMinistry.activities.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEditMinistry(selectedMinistry)}>
                    <Edit className="w-3.5 h-3.5 mr-1.5" />Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Branch filter + Add branch */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Select value={branchFilter === 'all' ? 'all' : String(branchFilter)} onValueChange={v => setBranchFilter(v === 'all' ? 'all' : Number(v))}>
                <SelectTrigger className="w-52"><SelectValue placeholder="All Branches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={openAddBm} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" /> Add Branch
              </Button>
            </div>

            {/* Branch list */}
            {selectedMinistryBms.length === 0 ? (
              <Card><CardContent className="p-12 text-center text-muted-foreground">No branches assigned to this ministry yet.</CardContent></Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedMinistryBms.map(bm => {
                  const bmMembers = getMembersForBm(bm.id)
                  const bmEvents  = getEventsForBm(bm.id)
                  return (
                    <Card key={bm.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                              <Church className="w-5 h-5 text-[var(--church-primary)]" />
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-sm leading-tight">{getBranchName(bm.branch_id)}</CardTitle>
                              <Badge variant={bm.status === 'active' ? 'secondary' : 'outline'} className={`text-xs mt-0.5 ${bm.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'text-muted-foreground'}`}>
                                {bm.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditBm(bm)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteBmId(bm.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4 text-[var(--church-gold)] flex-shrink-0" />
                          <span className="text-muted-foreground text-xs">Leader:</span>
                          <span className="text-xs font-medium text-foreground truncate">{bm.leader_name || 'Not assigned'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{bmMembers.length} members</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{bmEvents.length} events</span>
                        </div>
                        {bmMembers.length > 0 && (
                          <div className="flex -space-x-2">
                            {bmMembers.slice(0, 5).map(m => (
                              <Avatar key={m.id} className="w-7 h-7 border-2 border-background">
                                <AvatarFallback className="text-xs bg-[var(--church-primary)]/10 text-[var(--church-primary)]">{getInitials(m.name)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {bmMembers.length > 5 && (
                              <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                +{bmMembers.length - 5}
                              </div>
                            )}
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="w-full gap-2 mt-1" onClick={() => setSelectedBranchMinistry(bm)}>
                          <Eye className="w-3.5 h-3.5" /> Manage Members &amp; Events
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

        /* ── VIEW 1: Ministry list ── */
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Ministries</h1>
                <p className="text-muted-foreground mt-1">Manage all church ministries across branches</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={fetchAll} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Button onClick={openAddMinistry} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <Plus className="w-4 h-4" /> Add Ministry
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4 mb-2">
              <Card><CardContent className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center"><Users className="w-5 h-5 text-[var(--church-primary)]" /></div>
                <div><p className="text-2xl font-bold text-foreground">{ministries.length}</p><p className="text-sm text-muted-foreground">Total Ministries</p></div>
              </CardContent></Card>
              <Card><CardContent className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Eye className="w-5 h-5 text-emerald-500" /></div>
                <div><p className="text-2xl font-bold text-foreground">{ministries.filter(m => m.visible).length}</p><p className="text-sm text-muted-foreground">Visible on Website</p></div>
              </CardContent></Card>
              <Card><CardContent className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center"><Users className="w-5 h-5 text-[var(--church-gold)]" /></div>
                <div><p className="text-2xl font-bold text-foreground">{members.length}</p><p className="text-sm text-muted-foreground">Total Members Serving</p></div>
              </CardContent></Card>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search ministries..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>

            {/* Ministry cards */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(ministry => (
                <Card key={ministry.id} className="flex flex-col hover:shadow-md transition-shadow overflow-hidden">
                  {/* Card header — image or color band */}
                  <div className="relative h-36 flex-shrink-0">
                    {ministry.background_image_url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ministry.background_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50" />
                      </>
                    ) : (
                      <div className={`absolute inset-0 ${ministry.color}`} />
                    )}
                    {/* Overlay content */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-4">
                      <div className="flex justify-end">
                        <Badge className={ministry.visible ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30 text-xs' : 'bg-black/30 text-white/70 border-white/20 text-xs'}>
                          {ministry.visible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-white font-bold text-base leading-tight drop-shadow">{ministry.name}</p>
                        <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
                          <Shield className="w-3 h-3" />{ministry.overseer || 'No overseer'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="flex-1 flex flex-col gap-3 pt-4">
                    <p className="text-xs text-muted-foreground line-clamp-2">{ministry.description}</p>
                    {ministry.meeting_time && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{ministry.meeting_time}
                      </div>
                    )}
                    {ministry.activities && ministry.activities.length > 0 && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <ListChecks className="w-3 h-3" />{ministry.activities.length} regular activities
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Church className="w-3 h-3" />{getBmsForMinistry(ministry.id).length} branches</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{totalMembersForMinistry(ministry.id)} members</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{totalEventsForMinistry(ministry.id)} events</span>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                      <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs" onClick={() => { setSelectedMinistry(ministry); setBranchFilter('all') }}>
                        <Church className="w-3 h-3" /> View Branches
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => openEditMinistry(ministry)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => toggleVisible(ministry)} title={ministry.visible ? 'Hide from website' : 'Show on website'}>
                        {ministry.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteMinistryId(ministry.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Branch Ministry (leader) Dialog ── */}
        <Dialog open={bmDialog} onOpenChange={setBmDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingBm ? 'Edit Branch Ministry' : 'Add Branch to Ministry'}</DialogTitle>
              <DialogDescription>Assign a branch and set the ministry leader for that branch.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {!editingBm && (
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select value={bmForm.branch_id ? String(bmForm.branch_id) : ''} onValueChange={v => setBmForm(f => ({ ...f, branch_id: Number(v) }))}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>{branches.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Ministry Leader (this branch)</Label>
                <Input value={bmForm.leader_name} onChange={e => setBmForm(f => ({ ...f, leader_name: e.target.value }))} placeholder="e.g. Bro. Daniel Santos" />
              </div>
              <div className="space-y-2">
                <Label>Meeting Time (optional override)</Label>
                <Input value={bmForm.meeting_time} onChange={e => setBmForm(f => ({ ...f, meeting_time: e.target.value }))} placeholder="Leave blank to use default" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={bmForm.status} onValueChange={v => setBmForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setBmDialog(false)}>Cancel</Button>
                <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={saveBm}>
                  {editingBm ? 'Save Changes' : 'Add Branch'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Member Dialog ── */}
        <Dialog open={memberDialog} onOpenChange={setMemberDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Member' : 'Add Member'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Full Name</Label><Input value={memberForm.name} onChange={e => setMemberForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Bro. Daniel Santos" /></div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={memberForm.role} onValueChange={v => setMemberForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leader">Leader</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Joined Date</Label><Input type="date" value={memberForm.joined_date} onChange={e => setMemberForm(f => ({ ...f, joined_date: e.target.value }))} /></div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setMemberDialog(false)}>Cancel</Button>
                <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={saveMember}>
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Event Dialog ── */}
        <Dialog open={eventDialog} onOpenChange={setEventDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Event Title</Label><Input value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Time</Label><Input type="time" value={eventForm.time} onChange={e => setEventForm(f => ({ ...f, time: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Location</Label><Input value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select value={eventForm.type} onValueChange={v => setEventForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{eventTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={eventForm.event_description} onChange={e => setEventForm(f => ({ ...f, event_description: e.target.value }))} rows={3} /></div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setEventDialog(false)}>Cancel</Button>
                <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={saveEvent}>
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Confirm Delete Dialogs ── */}
        <AlertDialog open={deleteMinistryId !== null} onOpenChange={() => setDeleteMinistryId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete Ministry?</AlertDialogTitle>
              <AlertDialogDescription>This permanently removes the ministry and all its branch instances, members, and events.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white" onClick={() => deleteMinistryId && deleteMinistry(deleteMinistryId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={deleteBmId !== null} onOpenChange={() => setDeleteBmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Remove Branch from Ministry?</AlertDialogTitle>
              <AlertDialogDescription>This removes the branch's ministry instance including all its members and events.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white" onClick={() => deleteBmId && deleteBm(deleteBmId)}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={deleteMemberId !== null} onOpenChange={() => setDeleteMemberId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Remove Member?</AlertDialogTitle>
              <AlertDialogDescription>This removes the member from this branch ministry.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white" onClick={() => deleteMemberId && deleteMember(deleteMemberId)}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={deleteEventId !== null} onOpenChange={() => setDeleteEventId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete Event?</AlertDialogTitle>
              <AlertDialogDescription>This permanently removes the event.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white" onClick={() => deleteEventId && deleteEvent(deleteEventId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
    </DashboardLayout>
  )
}
