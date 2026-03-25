"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Calendar, Plus, Users, Clock, MapPin, Edit, Trash2,
  Search, Filter, Eye, Save, Loader2, ChevronLeft, ChevronRight,
  Star, X, Mail, Phone, UserCheck, AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ChurchEvent {
  id: number
  title: string
  date: string
  time: string
  end_time?: string | null
  location: string
  category: string
  description?: string | null
  image_url?: string | null
  capacity?: number | null
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  is_published: boolean
  is_featured_past: boolean
  highlights: string[]
  open_registration: boolean
  created_at: string
}

interface Attendee {
  id: number
  event_id: number
  name: string
  email: string
  phone?: string | null
  notes?: string | null
  registered_at: string
}

type EventForm = Omit<ChurchEvent, "id" | "created_at">

const CATEGORIES = ["Worship", "Study", "Fellowship", "Outreach", "Meeting", "Special", "Prayer", "Youth", "Women", "Missions", "Training", "General"]

const CATEGORY_COLORS: Record<string, string> = {
  Worship: "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Study: "bg-emerald-500/10 text-emerald-600",
  Fellowship: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Outreach: "bg-rose-500/10 text-rose-600",
  Meeting: "bg-slate-500/10 text-slate-600",
  Special: "bg-purple-500/10 text-purple-600",
  Prayer: "bg-blue-500/10 text-blue-600",
  Youth: "bg-teal-500/10 text-teal-600",
  Women: "bg-pink-500/10 text-pink-600",
  Missions: "bg-indigo-500/10 text-indigo-600",
  Training: "bg-orange-500/10 text-orange-600",
  General: "bg-muted text-muted-foreground",
}

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-emerald-500/10 text-emerald-600",
  ongoing: "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
}

function blankForm(): EventForm {
  return {
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    end_time: null,
    location: "",
    category: "General",
    description: "",
    image_url: "",
    capacity: null,
    status: "upcoming",
    is_published: true,
    is_featured_past: false,
    highlights: [],
    open_registration: true,
  }
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  // add / edit
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventForm>(blankForm())
  const [saving, setSaving] = useState(false)

  // delete
  const [confirmDelete, setConfirmDelete] = useState<ChurchEvent | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // attendees
  const [attendeeEvent, setAttendeeEvent] = useState<ChurchEvent | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [attendeesLoading, setAttendeesLoading] = useState(false)
  const [confirmRemoveAttendee, setConfirmRemoveAttendee] = useState<Attendee | null>(null)
  const [removeAttendeeLoading, setRemoveAttendeeLoading] = useState(false)

  // ── fetch ──
  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await apiFetch("/api/events")
      setEvents(data)
    } catch (e: unknown) {
      toast.error("Failed to load events: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  const fetchAttendees = async (eventId: number) => {
    setAttendeesLoading(true)
    try {
      const data = await apiFetch(`/api/events/${eventId}/attendees`)
      setAttendees(data)
    } catch (e: unknown) {
      toast.error("Failed to load attendees: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setAttendeesLoading(false)
    }
  }

  // ── open dialogs ──
  const openAdd = () => {
    setEditingId(null)
    setForm(blankForm())
    setDialogOpen(true)
  }

  const openEdit = (ev: ChurchEvent) => {
    setEditingId(ev.id)
    setForm({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      end_time: ev.end_time ?? null,
      location: ev.location,
      category: ev.category,
      description: ev.description ?? "",
      image_url: ev.image_url ?? "",
      capacity: ev.capacity ?? null,
      status: ev.status,
      is_published: ev.is_published,
      is_featured_past: ev.is_featured_past || false,
      highlights: ev.highlights || [],
      open_registration: ev.open_registration,
    })
    setDialogOpen(true)
  }

  const openAttendees = (ev: ChurchEvent) => {
    setAttendeeEvent(ev)
    fetchAttendees(ev.id)
  }

  // ── save ──
  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required.")
    if (!form.date) return toast.error("Date is required.")
    if (!form.time) return toast.error("Time is required.")
    if (!form.location.trim()) return toast.error("Location is required.")

    setSaving(true)
    try {
      const payload = { 
        ...form, 
        capacity: form.capacity || null, 
        end_time: form.end_time || null, 
        description: form.description || null,
        image_url: form.image_url || null,
        is_published: form.is_published,
        is_featured_past: form.is_featured_past,
        highlights: form.highlights
      }
      if (editingId !== null) {
        await apiFetch(`/api/events/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        toast.success("Event updated.")
      } else {
        await apiFetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        toast.success("Event created.")
      }
      setDialogOpen(false)
      fetchEvents()
    } catch (e: unknown) {
      toast.error("Save failed: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setSaving(false)
    }
  }

  // ── delete ──
  const handleDelete = async () => {
    if (!confirmDelete) return
    setDeleteLoading(true)
    try {
      await apiFetch(`/api/events/${confirmDelete.id}`, { method: "DELETE" })
      toast.success(`"${confirmDelete.title}" deleted.`)
      setConfirmDelete(null)
      fetchEvents()
    } catch (e: unknown) {
      toast.error("Delete failed: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── remove attendee ──
  const handleRemoveAttendee = async () => {
    if (!confirmRemoveAttendee || !attendeeEvent) return
    setRemoveAttendeeLoading(true)
    try {
      await apiFetch(`/api/events/${attendeeEvent.id}/attendees?attendeeId=${confirmRemoveAttendee.id}`, { method: "DELETE" })
      toast.success(`${confirmRemoveAttendee.name} removed.`)
      setConfirmRemoveAttendee(null)
      fetchAttendees(attendeeEvent.id)
    } catch (e: unknown) {
      toast.error("Failed: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setRemoveAttendeeLoading(false)
    }
  }

  // ── derived ──
  const filtered = useMemo(() => events.filter(ev => {
    const isCompleted = ev.status === "completed"
    const matchTab = activeTab === "past" ? isCompleted : !isCompleted
    const matchSearch = ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === "All" || ev.category === filterCategory
    const matchStatus = filterStatus === "All" || ev.status === filterStatus
    return matchTab && matchSearch && matchCat && matchStatus
  }), [events, search, filterCategory, filterStatus, activeTab])

  const upcomingCount = events.filter(e => e.status === "upcoming").length
  const totalCapacity = events.filter(e => e.status === "upcoming" && e.capacity).reduce((s, e) => s + (e.capacity ?? 0), 0)

  // attendance count helper (derived from attendees only when panel is open)
  const getAttendeeCount = (ev: ChurchEvent) => {
    if (attendeeEvent?.id === ev.id) return attendees.length
    return null
  }

  const formatDate = (d: string) => {
    try { return format(parseISO(d), "MMM d, yyyy") } catch { return d }
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground mt-1">Create and manage church events open for registration.</p>
          </div>
          <Button
            onClick={openAdd}
            className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
          >
            <Plus className="w-4 h-4" /> Create Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Upcoming Events", value: upcomingCount, icon: Calendar, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
            { label: "Total Events", value: events.length, icon: Star, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/10" },
            { label: "Total Capacity", value: totalCapacity || "—", icon: Users, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
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

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Activities</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterCategory === "All" ? "All Categories" : filterCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["All", ...CATEGORIES].map(c => (
                  <DropdownMenuItem key={c} onClick={() => setFilterCategory(c)}>{c}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Clock className="w-4 h-4" />
                  {filterStatus === "All" ? "All Status" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["All", "upcoming", "ongoing", "completed", "cancelled"].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)} className="capitalize">{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>{search || filterCategory !== "All" || filterStatus !== "All" ? "No events match your filters." : "No events yet. Create your first one!"}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(ev => {
              const catColor = CATEGORY_COLORS[ev.category] ?? CATEGORY_COLORS.General
              const statusColor = STATUS_COLORS[ev.status] ?? STATUS_COLORS.upcoming
              const acCount = getAttendeeCount(ev)
              return (
                <Card key={ev.id} className="flex flex-col overflow-hidden">
                  {ev.image_url && (
                    <div className="w-full h-32 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={ev.image_url} 
                        alt={ev.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <Badge className={`${catColor} text-xs`}>{ev.category}</Badge>
                      <div className="flex items-center gap-1.5">
                        {ev.status === "completed" && ev.is_featured_past && (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Featured Past</Badge>
                        )}
                        {!ev.is_published && <Badge variant="secondary" className="text-xs bg-slate-200 text-slate-600">Hidden</Badge>}
                        <Badge className={`${statusColor} text-xs capitalize`}>{ev.status}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-base mt-2">{ev.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    {ev.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{ev.description}</p>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-[var(--church-primary)]" />
                        {formatDate(ev.date)} · {ev.time}{ev.end_time ? ` – ${ev.end_time}` : ""}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-[var(--church-primary)]" />
                        {ev.location}
                      </div>
                      {ev.capacity && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="w-3.5 h-3.5 text-[var(--church-primary)]" />
                          {acCount !== null ? `${acCount} registered` : "—"} / {ev.capacity} capacity
                        </div>
                      )}
                    </div>
                    {ev.capacity && acCount !== null && (
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-[var(--church-primary)] h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (acCount / ev.capacity) * 100)}%` }}
                        />
                      </div>
                    )}
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline" size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={() => openAttendees(ev)}
                      >
                        <Users className="w-3 h-3" /> Attendees
                      </Button>
                      <Button
                        variant="outline" size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => openEdit(ev)}
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        className="gap-1 text-xs text-destructive hover:text-destructive px-2"
                        onClick={() => setConfirmDelete(ev)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            ADD / EDIT DIALOG
        ════════════════════════════════════════════════════════════ */}
        <Dialog open={dialogOpen} onOpenChange={open => { if (!open) setDialogOpen(false) }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId !== null ? "Edit Event" : "Create New Event"}</DialogTitle>
              <DialogDescription>Fill in the event details. Fields marked * are required.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {/* Title */}
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Event title" />
              </div>

              {/* Date / Time / End Time */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Date *</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Start Time *</Label>
                  <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>End Time</Label>
                  <Input type="time" value={form.end_time ?? ""} onChange={e => setForm(p => ({ ...p, end_time: e.target.value || null }))} />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label>Location *</Label>
                <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Main Sanctuary" />
              </div>

              {/* Category / Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <select
                    className="w-full border border-input rounded-md h-9 px-3 text-sm bg-background"
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select
                    className="w-full border border-input rounded-md h-9 px-3 text-sm bg-background"
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value as EventForm["status"] }))}
                  >
                    {["upcoming", "ongoing", "completed", "cancelled"].map(s => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-1.5">
                <Label>Capacity (optional)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.capacity ?? ""}
                  onChange={e => setForm(p => ({ ...p, capacity: e.target.value ? parseInt(e.target.value) : null }))}
                  placeholder="Maximum attendees (leave blank for unlimited)"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <Label>Event Picture URL (for promotion)</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-1.5">
                    <Input 
                      value={form.image_url ?? ""} 
                      onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} 
                      placeholder="https://example.com/image.jpg" 
                    />
                    <p className="text-[10px] text-muted-foreground">Provide a URL for the event&apos;s promotional poster or image.</p>
                  </div>
                  {form.image_url && (
                    <div className="w-24 h-24 rounded-md overflow-hidden border border-border flex-shrink-0 bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={form.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Invalid+Image"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description ?? ""}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the event..."
                  rows={3}
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-border flex-wrap">
                <div className="flex items-center gap-2">
                  <Switch id="reg" checked={form.open_registration} onCheckedChange={v => setForm(p => ({ ...p, open_registration: v }))} />
                  <Label htmlFor="reg" className="cursor-pointer">Open Registration</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="pub" checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} />
                  <Label htmlFor="pub" className="cursor-pointer font-semibold text-[var(--church-primary)]">Display on Website</Label>
                </div>
              </div>

              {/* Past Event Features (only if status is completed) */}
              {form.status === "completed" && (
                <div className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-bold text-slate-900">Past Activity Page</Label>
                      <p className="text-xs text-muted-foreground">Feature this event on the past activities page.</p>
                    </div>
                    <Switch 
                      id="feat-past" 
                      checked={form.is_featured_past} 
                      onCheckedChange={v => setForm(p => ({ ...p, is_featured_past: v }))} 
                    />
                  </div>
                  
                  {form.is_featured_past && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <Label className="text-sm font-semibold">Activity Highlights</Label>
                      <div className="space-y-2">
                        {form.highlights.map((h, i) => (
                          <div key={i} className="flex gap-2">
                            <Input 
                              value={h} 
                              onChange={e => {
                                const next = [...form.highlights]
                                next[i] = e.target.value
                                setForm(p => ({ ...p, highlights: next }))
                              }}
                              placeholder="e.g. 500+ attendees"
                              className="h-8 text-sm"
                            />
                            <Button 
                              variant="ghost" size="sm" className="h-8 px-2 text-destructive"
                              onClick={() => setForm(p => ({ ...p, highlights: p.highlights.filter((_, idx) => idx !== i) }))}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" size="sm" className="w-full h-8 border-dashed border-slate-300 text-slate-500 hover:text-slate-600"
                          onClick={() => setForm(p => ({ ...p, highlights: [...p.highlights, ""] }))}
                        >
                          <Plus className="w-3 h-3 mr-2" /> Add Highlight
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId !== null ? "Save Changes" : "Create Event"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ════════════════════════════════════════════════════════════
            ATTENDEES DIALOG
        ════════════════════════════════════════════════════════════ */}
        <Dialog open={attendeeEvent !== null} onOpenChange={open => { if (!open) { setAttendeeEvent(null); setAttendees([]) } }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--church-primary)]" />
                Attendees — {attendeeEvent?.title}
              </DialogTitle>
              <DialogDescription>
                {attendeeEvent && `${formatDate(attendeeEvent.date)} · ${attendeeEvent.location}`}
              </DialogDescription>
            </DialogHeader>

            {/* Summary */}
            {attendeeEvent && (
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border border-border text-sm flex-wrap">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-foreground">{attendees.length}</span>
                  <span className="text-muted-foreground">registered</span>
                </div>
                {attendeeEvent.capacity && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[var(--church-primary)]" />
                    <span className="font-semibold text-foreground">{attendeeEvent.capacity - attendees.length}</span>
                    <span className="text-muted-foreground">slots left</span>
                  </div>
                )}
                <Badge className={`ml-auto ${attendeeEvent.open_registration ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                  {attendeeEvent.open_registration ? "Registration Open" : "Registration Closed"}
                </Badge>
              </div>
            )}

            {/* Attendee list */}
            {attendeesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--church-primary)]" />
              </div>
            ) : attendees.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-10 h-10 text-muted-foreground opacity-20 mx-auto mb-3" />
                <p className="text-muted-foreground">No attendees registered yet.</p>
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                {attendees.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[var(--church-primary)]">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{a.name}</p>
                      <div className="flex items-center gap-3 flex-wrap mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />{a.email}
                        </span>
                        {a.phone && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />{a.phone}
                          </span>
                        )}
                      </div>
                      {a.notes && <p className="text-xs text-muted-foreground italic mt-0.5">{a.notes}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(a.registered_at), "MMM d, yyyy")}
                      </span>
                      <Button
                        variant="ghost" size="sm"
                        className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                        onClick={() => setConfirmRemoveAttendee(a)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ════════════════════════════════════════════════════════════
            CONFIRM DELETE EVENT
        ════════════════════════════════════════════════════════════ */}
        <AlertDialog open={confirmDelete !== null} onOpenChange={open => { if (!open) setConfirmDelete(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{confirmDelete?.title}&rdquo; and all its attendee registrations will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                disabled={deleteLoading}
                onClick={handleDelete}
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ════════════════════════════════════════════════════════════
            CONFIRM REMOVE ATTENDEE
        ════════════════════════════════════════════════════════════ */}
        <AlertDialog open={confirmRemoveAttendee !== null} onOpenChange={open => { if (!open) setConfirmRemoveAttendee(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Attendee?</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{confirmRemoveAttendee?.name}</strong> ({confirmRemoveAttendee?.email}) will be removed from this event&apos;s registration list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={removeAttendeeLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                disabled={removeAttendeeLoading}
                onClick={handleRemoveAttendee}
              >
                {removeAttendeeLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
