"use client"

import { useState, useEffect, useMemo } from "react"
import {
  BookOpen, Plus, Edit, Trash2, Search, Calendar, Eye,
  Save, Star, ChevronLeft, ChevronRight, Archive, Inbox,
  Clock, Loader2, X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { toast } from "sonner"
import {
  format, isWithinInterval, parseISO, isToday, isSameDay, isSameMonth,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
} from "date-fns"

// ─────────────────────────────────────────────────────────────────────────────
// Reading Plan Types
// ─────────────────────────────────────────────────────────────────────────────

interface ReadingPlanEntry {
  id: number
  week_start: string
  day_of_week: string
  reading: string
  notes?: string | null
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Devotional {
  id: number
  date: string
  title: string
  scripture: string
  scripture_text: string
  reflection: string
  featured_verse: string
  featured_verse_ref: string
  published: boolean
  featured: boolean
  author: string
  status: "active" | "archived"
  schedule_start?: string | null
  schedule_end?: string | null
}

type FormData = Omit<Devotional, "id">

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5

function today() {
  return new Date().toISOString().split("T")[0]
}

function isLiveNow(d: Devotional) {
  if (!d.schedule_start || !d.schedule_end) return false
  try {
    const now = new Date(); now.setHours(0, 0, 0, 0)
    return isWithinInterval(now, { start: parseISO(d.schedule_start), end: parseISO(d.schedule_end) })
  } catch { return false }
}

function isUpcoming(d: Devotional) {
  if (!d.schedule_start) return false
  try {
    const now = new Date(); now.setHours(0, 0, 0, 0)
    return parseISO(d.schedule_start) > now
  } catch { return false }
}

function blankForm(): FormData {
  return {
    date: today(),
    title: "",
    scripture: "",
    scripture_text: "",
    reflection: "",
    featured_verse: "",
    featured_verse_ref: "",
    published: false,
    featured: false,
    author: "",
    status: "active",
    schedule_start: null,
    schedule_end: null,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────

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

export default function AdminDevotionPage() {
  // ── data ──
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)

  // ── list controls ──
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [view, setView] = useState<"active" | "archived">("active")

  // ── add / edit dialog ──
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>(blankForm())
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [saving, setSaving] = useState(false)

  // ── preview dialog ──
  const [previewItem, setPreviewItem] = useState<Devotional | null>(null)

  // ── calendar ──
  const [calView, setCalView] = useState<"month" | "week" | "day">("month")
  const [calCurrent, setCalCurrent] = useState(new Date())
  const [calSelected, setCalSelected] = useState<Date>(new Date())

  // ── reading plan ──
  const [rpEntries, setRpEntries] = useState<ReadingPlanEntry[]>([])
  const [rpWeek, setRpWeek] = useState<Date>(() => {
    // Monday of the current week
    const d = new Date()
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [rpDialogOpen, setRpDialogOpen] = useState(false)
  const [rpEditEntry, setRpEditEntry] = useState<ReadingPlanEntry | null>(null)
  const [rpEditDay, setRpEditDay] = useState<string>("")
  const [rpForm, setRpForm] = useState({ reading: "", notes: "" })
  const [rpSaving, setRpSaving] = useState(false)
  const [rpDeleteEntry, setRpDeleteEntry] = useState<ReadingPlanEntry | null>(null)
  const [rpActionLoading, setRpActionLoading] = useState(false)

  const rpWeekStart = format(rpWeek, "yyyy-MM-dd")

  const fetchReadingPlan = async (weekStart: string) => {
    try {
      const data = await apiFetch(`/api/reading-plan?week=${weekStart}`)
      setRpEntries(data)
    } catch (e: unknown) {
      toast.error("Failed to load reading plan: " + (e instanceof Error ? e.message : String(e)))
    }
  }

  useEffect(() => { fetchReadingPlan(rpWeekStart) }, [rpWeekStart])

  const openRpDialog = (day: string, existing?: ReadingPlanEntry) => {
    setRpEditDay(day)
    setRpEditEntry(existing ?? null)
    setRpForm({ reading: existing?.reading ?? "", notes: existing?.notes ?? "" })
    setRpDialogOpen(true)
  }

  const handleRpSave = async () => {
    if (!rpForm.reading.trim()) return toast.error("Reading text is required.")
    setRpSaving(true)
    try {
      if (rpEditEntry) {
        await apiFetch(`/api/reading-plan/${rpEditEntry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reading: rpForm.reading, notes: rpForm.notes || null }),
        })
        toast.success("Reading updated.")
      } else {
        await apiFetch("/api/reading-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            week_start: rpWeekStart,
            day_of_week: rpEditDay,
            reading: rpForm.reading,
            notes: rpForm.notes || null,
          }),
        })
        toast.success("Reading added.")
      }
      setRpDialogOpen(false)
      fetchReadingPlan(rpWeekStart)
    } catch (e: unknown) {
      toast.error("Save failed: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setRpSaving(false)
    }
  }

  const handleRpDelete = async () => {
    if (!rpDeleteEntry) return
    setRpActionLoading(true)
    try {
      await apiFetch(`/api/reading-plan/${rpDeleteEntry.id}`, { method: "DELETE" })
      toast.success("Reading removed.")
      setRpDeleteEntry(null)
      fetchReadingPlan(rpWeekStart)
    } catch (e: unknown) {
      toast.error("Delete failed: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setRpActionLoading(false)
    }
  }

  const prevRpWeek = () => setRpWeek(w => { const d = new Date(w); d.setDate(d.getDate() - 7); return d })
  const nextRpWeek = () => setRpWeek(w => { const d = new Date(w); d.setDate(d.getDate() + 7); return d })
  const goThisWeek = () => {
    const d = new Date()
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    setRpWeek(d)
  }

  // ── confirm dialogs ──
  const [confirmDelete, setConfirmDelete] = useState<Devotional | null>(null)
  const [confirmArchive, setConfirmArchive] = useState<Devotional | null>(null)
  const [confirmClearSchedule, setConfirmClearSchedule] = useState<Devotional | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch
  // ─────────────────────────────────────────────────────────────────────────

  const fetchAll = async () => {
    setLoading(true)
    try {
      const data = await apiFetch("/api/devotions")
      setDevotionals(data)
    } catch (e: unknown) {
      toast.error("Failed to load devotionals: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Open add / edit
  // ─────────────────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditingId(null)
    setForm(blankForm())
    setScheduleEnabled(false)
    setDialogOpen(true)
  }

  const openEdit = (d: Devotional) => {
    setEditingId(d.id)
    setForm({
      date: d.date,
      title: d.title,
      scripture: d.scripture,
      scripture_text: d.scripture_text,
      reflection: d.reflection,
      featured_verse: d.featured_verse,
      featured_verse_ref: d.featured_verse_ref,
      published: d.published,
      featured: d.featured,
      author: d.author,
      status: d.status,
      schedule_start: d.schedule_start ?? null,
      schedule_end: d.schedule_end ?? null,
    })
    setScheduleEnabled(!!(d.schedule_start || d.schedule_end))
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingId(null)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Save (create or update)
  // ─────────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    // Validate
    if (!form.date) return toast.error("Date is required.")
    if (!form.author.trim()) return toast.error("Author is required.")
    if (!form.title.trim()) return toast.error("Title is required.")
    if (!form.scripture.trim()) return toast.error("Scripture reference is required.")
    if (!form.reflection.trim()) return toast.error("Reflection is required.")
    if (scheduleEnabled) {
      if (!form.schedule_start) return toast.error("Schedule start date is required.")
      if (!form.schedule_end) return toast.error("Schedule end date is required.")
      if (parseISO(form.schedule_end) < parseISO(form.schedule_start))
        return toast.error("End date must be after start date.")
    }

    const payload: FormData = {
      ...form,
      schedule_start: scheduleEnabled ? (form.schedule_start || null) : null,
      schedule_end: scheduleEnabled ? (form.schedule_end || null) : null,
    }

    setSaving(true)
    try {
      if (editingId !== null) {
        await apiFetch(`/api/devotions/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        toast.success("Devotional updated.")
      } else {
        await apiFetch("/api/devotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        toast.success("Devotional created.")
      }
      closeDialog()
      fetchAll()
    } catch (e: unknown) {
      toast.error((editingId ? "Update" : "Create") + " failed: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setSaving(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!confirmDelete) return
    setActionLoading(true)
    try {
      await apiFetch(`/api/devotions/${confirmDelete.id}`, { method: "DELETE" })
      toast.success(`"${confirmDelete.title}" deleted.`)
      setConfirmDelete(null)
      fetchAll()
    } catch (e: unknown) {
      toast.error("Delete failed: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setActionLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Archive / Restore
  // ─────────────────────────────────────────────────────────────────────────

  const handleArchive = async () => {
    if (!confirmArchive) return
    const newStatus = confirmArchive.status === "active" ? "archived" : "active"
    setActionLoading(true)
    try {
      await apiFetch(`/api/devotions/${confirmArchive.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      toast.success(newStatus === "archived" ? "Devotional archived." : "Devotional restored.")
      setConfirmArchive(null)
      fetchAll()
    } catch (e: unknown) {
      toast.error("Action failed: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setActionLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Clear schedule
  // ─────────────────────────────────────────────────────────────────────────

  const handleClearSchedule = async () => {
    if (!confirmClearSchedule) return
    setActionLoading(true)
    try {
      await apiFetch(`/api/devotions/${confirmClearSchedule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule_start: null, schedule_end: null }),
      })
      toast.success("Schedule cleared.")
      setConfirmClearSchedule(null)
      fetchAll()
    } catch (e: unknown) {
      toast.error("Failed to clear schedule: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setActionLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Toggle published / featured (inline switches — optimistic)
  // ─────────────────────────────────────────────────────────────────────────

  const toggleField = async (id: number, field: "published" | "featured", current: boolean) => {
    // Optimistic
    setDevotionals(prev => prev.map(d => d.id === id ? { ...d, [field]: !current } : d))
    try {
      await apiFetch(`/api/devotions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !current }),
      })
    } catch (e: unknown) {
      // Revert on failure
      setDevotionals(prev => prev.map(d => d.id === id ? { ...d, [field]: current } : d))
      toast.error("Update failed: " + (e instanceof Error ? e.message : String(e)))
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Derived state
  // ─────────────────────────────────────────────────────────────────────────

  const filtered = devotionals.filter(d =>
    d.status === view &&
    [d.title, d.scripture, d.author].some(f =>
      f.toLowerCase().includes(search.toLowerCase())
    )
  )
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const scheduledList = devotionals
    .filter(d => d.status === "active" && (d.schedule_start || d.schedule_end))
    .sort((a, b) => (a.schedule_start ?? "").localeCompare(b.schedule_start ?? ""))

  const activeScheduled = scheduledList.find(isLiveNow)
  const todaysDevo =
    activeScheduled ??
    devotionals.find(d => d.published && d.featured && d.status === "active") ??
    devotionals.find(d => d.published && d.status === "active")

  const stats = [
    { label: "Total", value: devotionals.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10", icon: BookOpen },
    { label: "Published", value: devotionals.filter(d => d.published && d.status === "active").length, color: "text-emerald-600", bg: "bg-emerald-500/10", icon: Eye },
    { label: "Archived", value: devotionals.filter(d => d.status === "archived").length, color: "text-slate-500", bg: "bg-slate-500/10", icon: Archive },
    { label: "Scheduled", value: scheduledList.length, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15", icon: Clock },
  ]

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Daily Devotional</h1>
          <p className="text-muted-foreground mt-1">Create, manage, and publish daily devotionals for the website.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
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

        {/* Tabs */}
        <Tabs defaultValue="calendar">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="calendar" className="gap-2"><Calendar className="w-4 h-4" />Daily Devotion Calendar</TabsTrigger>
            <TabsTrigger value="list" className="gap-2"><BookOpen className="w-4 h-4" />All Devotionals</TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              <Clock className="w-4 h-4" />Scheduled
              {scheduledList.length > 0 && (
                <Badge className="ml-1 bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30 text-xs">{scheduledList.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="today" className="gap-2"><Star className="w-4 h-4" />Today&apos;s Devotional</TabsTrigger>
            <TabsTrigger value="reading-plan" className="gap-2"><BookOpen className="w-4 h-4" />Weekly Reading Plan</TabsTrigger>
          </TabsList>

          {/* ── DAILY DEVOTION CALENDAR ── */}
          <TabsContent value="calendar">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
              </div>
            ) : (
              <CalendarTab
                devotionals={devotionals}
                calView={calView}
                setCalView={setCalView}
                calCurrent={calCurrent}
                setCalCurrent={setCalCurrent}
                calSelected={calSelected}
                setCalSelected={setCalSelected}
                onEdit={openEdit}
                onPreview={d => setPreviewItem(d)}
              />
            )}
          </TabsContent>

          {/* ── ALL DEVOTIONALS ── */}
          <TabsContent value="list">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, scripture, author..."
                    className="pl-9"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                  />
                </div>
                <div className="flex border rounded-lg overflow-hidden bg-background">
                  <Button variant={view === "active" ? "secondary" : "ghost"} size="sm" className="rounded-none h-auto py-2 px-4" onClick={() => { setView("active"); setPage(1) }}>Active</Button>
                  <Button variant={view === "archived" ? "secondary" : "ghost"} size="sm" className="rounded-none h-auto py-2 px-4" onClick={() => { setView("archived"); setPage(1) }}>Archived</Button>
                </div>
              </div>
              <Button onClick={openAdd} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" /> New Devotional
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
              </div>
            ) : paginated.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  {search ? `No results for "${search}".` : `No ${view} devotionals found.`}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {paginated.map(d => (
                  <DevotionalCard
                    key={d.id}
                    d={d}
                    liveNow={isLiveNow(d)}
                    onEdit={() => openEdit(d)}
                    onPreview={() => setPreviewItem(d)}
                    onArchive={() => setConfirmArchive(d)}
                    onDelete={() => setConfirmDelete(d)}
                    onTogglePublish={() => toggleField(d.id, "published", d.published)}
                    onToggleFeatured={() => toggleField(d.id, "featured", d.featured)}
                    onClearSchedule={() => setConfirmClearSchedule(d)}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            )}
          </TabsContent>

          {/* ── SCHEDULED ── */}
          <TabsContent value="scheduled">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Devotionals with a scheduled display window. The active one overrides the featured devotional on the website.
              </p>
              <Button onClick={openAdd} size="sm" className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" /> New Scheduled
              </Button>
            </div>

            {scheduledList.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground mb-4">No scheduled devotionals yet.</p>
                  <Button onClick={openAdd} size="sm" className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                    <Plus className="w-4 h-4" /> Schedule a Devotional
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {scheduledList.map(d => {
                  const live = isLiveNow(d)
                  const upcoming = isUpcoming(d)
                  return (
                    <Card key={d.id} className={live ? "border-[var(--church-gold)]/40 bg-[var(--church-gold)]/5" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${live ? "bg-[var(--church-gold)]/20" : "bg-[var(--church-primary)]/10"}`}>
                            <Clock className={`w-5 h-5 ${live ? "text-[var(--church-gold)]" : "text-[var(--church-primary)]"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-semibold text-foreground">{d.title}</p>
                              {live && <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30 text-xs">Live Now</Badge>}
                              {!live && upcoming && <Badge className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20 text-xs">Upcoming</Badge>}
                              {!live && !upcoming && <Badge variant="outline" className="text-xs text-muted-foreground">Ended</Badge>}
                            </div>
                            <p className="text-xs text-[var(--church-primary)] font-medium">{d.scripture}</p>
                            <p className="text-xs text-muted-foreground">By {d.author}</p>
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              {d.schedule_start ? format(parseISO(d.schedule_start), "MMM d, yyyy") : "—"}
                              {" → "}
                              {d.schedule_end ? format(parseISO(d.schedule_end), "MMM d, yyyy") : "—"}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(d)} title="Edit">
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive" onClick={() => setConfirmClearSchedule(d)} title="Clear Schedule">
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* ── TODAY'S DEVOTIONAL ── */}
          <TabsContent value="today">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
              </div>
            ) : todaysDevo ? (
              <div className="max-w-2xl space-y-4">
                {activeScheduled && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--church-gold)]/10 border border-[var(--church-gold)]/30 text-sm text-[var(--church-gold)]">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    Showing via schedule: {format(parseISO(activeScheduled.schedule_start!), "MMM d")} – {format(parseISO(activeScheduled.schedule_end!), "MMM d, yyyy")}
                  </div>
                )}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {todaysDevo.date}
                      {todaysDevo.featured && (
                        <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30 text-xs ml-1">Featured</Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{todaysDevo.title}</CardTitle>
                    <CardDescription>By {todaysDevo.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Scripture — {todaysDevo.scripture}</p>
                      <blockquote className="border-l-4 border-[var(--church-primary)] pl-4 italic text-foreground leading-relaxed">
                        {todaysDevo.scripture_text}
                      </blockquote>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Reflection</p>
                      <p className="text-foreground leading-relaxed">{todaysDevo.reflection}</p>
                    </div>
                    <div className="bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/20 rounded-xl p-5">
                      <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide mb-2">Featured Verse</p>
                      <p className="text-lg font-serif italic text-foreground leading-relaxed">&ldquo;{todaysDevo.featured_verse}&rdquo;</p>
                      <p className="text-sm font-semibold text-[var(--church-primary)] mt-2">— {todaysDevo.featured_verse_ref}</p>
                    </div>
                    <Button onClick={() => openEdit(todaysDevo)} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                      <Edit className="w-4 h-4" /> Edit This Devotional
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground">No published devotional found.</p>
                  <Button onClick={openAdd} className="mt-4 gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                    <Plus className="w-4 h-4" /> Create Today&apos;s Devotional
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── WEEKLY READING PLAN ── */}
          <TabsContent value="reading-plan">
            <ReadingPlanTab
              entries={rpEntries}
              rpWeek={rpWeek}
              rpWeekStart={rpWeekStart}
              onPrev={prevRpWeek}
              onNext={nextRpWeek}
              onThisWeek={goThisWeek}
              onAdd={(day) => openRpDialog(day)}
              onEdit={(day, entry) => openRpDialog(day, entry)}
              onDelete={(entry) => setRpDeleteEntry(entry)}
            />
          </TabsContent>
        </Tabs>

        {/* ══════════════════════════════════════════════════════════════════
            READING PLAN — ADD / EDIT DIALOG
        ══════════════════════════════════════════════════════════════════ */}
        <Dialog open={rpDialogOpen} onOpenChange={open => { if (!open) setRpDialogOpen(false) }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{rpEditEntry ? "Edit Reading" : "Add Reading"}</DialogTitle>
              <DialogDescription>
                {rpEditDay} — {format(rpWeek, "MMM d")} – {format(new Date(rpWeek.getTime() + 6 * 86400000), "MMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Bible Chapters / Passage *</Label>
                <Textarea
                  value={rpForm.reading}
                  onChange={e => setRpForm(p => ({ ...p, reading: e.target.value }))}
                  placeholder="e.g. Genesis 1-2, Matthew 1"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">List the chapters or passages to read for this day.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Notes (optional)</Label>
                <Textarea
                  value={rpForm.notes}
                  onChange={e => setRpForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any additional notes or context..."
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setRpDialogOpen(false)} disabled={rpSaving}>Cancel</Button>
                <Button
                  onClick={handleRpSave}
                  disabled={rpSaving}
                  className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                >
                  {rpSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {rpEditEntry ? "Save Changes" : "Add Reading"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ══════════════════════════════════════════════════════════════════
            READING PLAN — CONFIRM DELETE
        ══════════════════════════════════════════════════════════════════ */}
        <AlertDialog open={rpDeleteEntry !== null} onOpenChange={open => { if (!open) setRpDeleteEntry(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Reading?</AlertDialogTitle>
              <AlertDialogDescription>
                The reading for <strong>{rpDeleteEntry?.day_of_week}</strong> will be removed from this week&apos;s plan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={rpActionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                disabled={rpActionLoading}
                onClick={handleRpDelete}
              >
                {rpActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ══════════════════════════════════════════════════════════════════
            ADD / EDIT DIALOG
        ══════════════════════════════════════════════════════════════════ */}
        <Dialog open={dialogOpen} onOpenChange={open => { if (!open) closeDialog() }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId !== null ? "Edit Devotional" : "New Devotional"}</DialogTitle>
              <DialogDescription>Fill in the devotional content below. Fields marked * are required.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Date + Author */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Author *</Label>
                  <Input
                    value={form.author}
                    onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                    placeholder="e.g. Ptr. Ysrael Coyoy"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Devotional title"
                />
              </div>

              {/* Scripture Reference */}
              <div className="space-y-1.5">
                <Label>Scripture Reference *</Label>
                <Input
                  value={form.scripture}
                  onChange={e => setForm(p => ({ ...p, scripture: e.target.value }))}
                  placeholder="e.g. John 3:16"
                />
              </div>

              {/* Scripture Text */}
              <div className="space-y-1.5">
                <Label>Scripture Text</Label>
                <Textarea
                  value={form.scripture_text}
                  onChange={e => setForm(p => ({ ...p, scripture_text: e.target.value }))}
                  placeholder="Full Bible verse text..."
                  rows={3}
                />
              </div>

              {/* Reflection */}
              <div className="space-y-1.5">
                <Label>Reflection *</Label>
                <Textarea
                  value={form.reflection}
                  onChange={e => setForm(p => ({ ...p, reflection: e.target.value }))}
                  placeholder="Write the devotional reflection..."
                  rows={5}
                />
              </div>

              {/* Featured Verse + Reference */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Featured Verse</Label>
                  <Textarea
                    value={form.featured_verse}
                    onChange={e => setForm(p => ({ ...p, featured_verse: e.target.value }))}
                    placeholder="Key verse to highlight..."
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Verse Reference</Label>
                  <Input
                    value={form.featured_verse_ref}
                    onChange={e => setForm(p => ({ ...p, featured_verse_ref: e.target.value }))}
                    placeholder="e.g. Psalm 119:105"
                  />
                </div>
              </div>

              {/* Publish / Feature */}
              <div className="flex items-center gap-6 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch id="form-pub" checked={form.published} onCheckedChange={v => setForm(p => ({ ...p, published: v }))} />
                  <Label htmlFor="form-pub" className="cursor-pointer">Publish</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="form-feat" checked={form.featured} onCheckedChange={v => setForm(p => ({ ...p, featured: v }))} />
                  <Label htmlFor="form-feat" className="cursor-pointer">Feature on Website</Label>
                </div>
              </div>

              {/* Schedule */}
              <div className="border border-border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Schedule on Website</p>
                    <p className="text-xs text-muted-foreground">Override featured devotional during a specific date range.</p>
                  </div>
                  <Switch
                    id="form-schedule"
                    checked={scheduleEnabled}
                    onCheckedChange={v => {
                      setScheduleEnabled(v)
                      if (!v) setForm(p => ({ ...p, schedule_start: null, schedule_end: null }))
                    }}
                  />
                </div>
                {scheduleEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={form.schedule_start ?? ""}
                        onChange={e => setForm(p => ({ ...p, schedule_start: e.target.value || null }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>End Date *</Label>
                      <Input
                        type="date"
                        value={form.schedule_end ?? ""}
                        min={form.schedule_start ?? undefined}
                        onChange={e => setForm(p => ({ ...p, schedule_end: e.target.value || null }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={closeDialog} disabled={saving}>Cancel</Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId !== null ? "Save Changes" : "Create Devotional"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ══════════════════════════════════════════════════════════════════
            PREVIEW DIALOG
        ══════════════════════════════════════════════════════════════════ */}
        <Dialog open={previewItem !== null} onOpenChange={open => { if (!open) setPreviewItem(null) }}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview: {previewItem?.title}</DialogTitle>
              <DialogDescription>{previewItem?.date} · By {previewItem?.author}</DialogDescription>
            </DialogHeader>
            {previewItem && (
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{previewItem.scripture}</p>
                  <blockquote className="border-l-4 border-[var(--church-primary)] pl-4 italic text-foreground text-sm leading-relaxed">
                    {previewItem.scripture_text}
                  </blockquote>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{previewItem.reflection}</p>
                {previewItem.featured_verse && (
                  <div className="bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide mb-2">Featured Verse</p>
                    <p className="font-serif italic text-foreground">&ldquo;{previewItem.featured_verse}&rdquo;</p>
                    {previewItem.featured_verse_ref && (
                      <p className="text-sm font-semibold text-[var(--church-primary)] mt-1">— {previewItem.featured_verse_ref}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ══════════════════════════════════════════════════════════════════
            CONFIRM — DELETE
        ══════════════════════════════════════════════════════════════════ */}
        <AlertDialog open={confirmDelete !== null} onOpenChange={open => { if (!open) setConfirmDelete(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Devotional?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{confirmDelete?.title}&rdquo; will be permanently deleted. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                disabled={actionLoading}
                onClick={handleDelete}
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ══════════════════════════════════════════════════════════════════
            CONFIRM — ARCHIVE / RESTORE
        ══════════════════════════════════════════════════════════════════ */}
        <AlertDialog open={confirmArchive !== null} onOpenChange={open => { if (!open) setConfirmArchive(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmArchive?.status === "active" ? "Archive Devotional?" : "Restore Devotional?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmArchive?.status === "active"
                  ? `"${confirmArchive?.title}" will be moved to archives and hidden from the website.`
                  : `"${confirmArchive?.title}" will be restored to the active list.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={actionLoading} onClick={handleArchive}>
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {confirmArchive?.status === "active" ? "Archive" : "Restore"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ══════════════════════════════════════════════════════════════════
            CONFIRM — CLEAR SCHEDULE
        ══════════════════════════════════════════════════════════════════ */}
        <AlertDialog open={confirmClearSchedule !== null} onOpenChange={open => { if (!open) setConfirmClearSchedule(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Schedule?</AlertDialogTitle>
              <AlertDialogDescription>
                The scheduled date range for &ldquo;{confirmClearSchedule?.title}&rdquo; will be removed. The devotional will remain published.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={actionLoading} onClick={handleClearSchedule}>
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Clear Schedule
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DevotionalCard sub-component
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  d: Devotional
  liveNow: boolean
  onEdit: () => void
  onPreview: () => void
  onArchive: () => void
  onDelete: () => void
  onTogglePublish: () => void
  onToggleFeatured: () => void
  onClearSchedule: () => void
}

function DevotionalCard({
  d, liveNow,
  onEdit, onPreview, onArchive, onDelete,
  onTogglePublish, onToggleFeatured, onClearSchedule,
}: CardProps) {
  const hasSchedule = !!(d.schedule_start || d.schedule_end)

  return (
    <Card className={liveNow ? "border-[var(--church-gold)]/40 bg-[var(--church-gold)]/5" : ""}>
      <CardContent className="p-4">
        {/* Top row */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <BookOpen className="w-5 h-5 text-[var(--church-primary)]" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Badges + title */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-semibold text-foreground">{d.title}</p>
              {d.featured && d.status === "active" && (
                <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30 text-xs">Featured</Badge>
              )}
              <Badge className={d.published
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                : "bg-muted text-muted-foreground text-xs"}>
                {d.published ? "Published" : "Draft"}
              </Badge>
              {hasSchedule && (
                liveNow
                  ? <Badge className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />Scheduled Live</Badge>
                  : <Badge variant="outline" className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Scheduled</Badge>
              )}
              {d.status === "archived" && (
                <Badge variant="outline" className="text-xs text-muted-foreground">Archived</Badge>
              )}
            </div>

            {/* Meta */}
            <p className="text-xs text-[var(--church-primary)] font-medium">{d.scripture}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{d.date} · By {d.author}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{d.reflection}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onPreview} title="Preview">
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onEdit} title="Edit">
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onArchive}
              title={d.status === "active" ? "Archive" : "Restore"}>
              {d.status === "active" ? <Archive className="w-3.5 h-3.5" /> : <Inbox className="w-3.5 h-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={onDelete} title="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Bottom bar — only for active devotionals */}
        {d.status === "active" && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border flex-wrap">
            <div className="flex items-center gap-2">
              <Switch checked={d.published} onCheckedChange={onTogglePublish} id={`pub-${d.id}`} />
              <Label htmlFor={`pub-${d.id}`} className="text-xs text-muted-foreground cursor-pointer">Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={d.featured} onCheckedChange={onToggleFeatured} id={`feat-${d.id}`} />
              <Label htmlFor={`feat-${d.id}`} className="text-xs text-muted-foreground cursor-pointer">Featured on Website</Label>
            </div>
            {hasSchedule && (
              <div className="flex items-center gap-2 ml-auto">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${liveNow ? "bg-[var(--church-primary)]/10 text-[var(--church-primary)]" : "bg-muted text-muted-foreground"}`}>
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  {d.schedule_start ? format(parseISO(d.schedule_start), "MMM d, yyyy") : "—"}
                  {" → "}
                  {d.schedule_end ? format(parseISO(d.schedule_end), "MMM d, yyyy") : "—"}
                </div>
                <Button
                  variant="ghost" size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onClick={onClearSchedule}
                  title="Clear schedule"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CalendarTab sub-component
// ─────────────────────────────────────────────────────────────────────────────

interface CalendarTabProps {
  devotionals: Devotional[]
  calView: "month" | "week" | "day"
  setCalView: (v: "month" | "week" | "day") => void
  calCurrent: Date
  setCalCurrent: (d: Date) => void
  calSelected: Date
  setCalSelected: (d: Date) => void
  onEdit: (d: Devotional) => void
  onPreview: (d: Devotional) => void
}

function CalendarTab({
  devotionals, calView, setCalView,
  calCurrent, setCalCurrent,
  calSelected, setCalSelected,
  onEdit, onPreview,
}: CalendarTabProps) {

  // Map date string → devotional (prefer published over draft on same day)
  const byDate = useMemo(() => {
    const m = new Map<string, Devotional>()
    devotionals.forEach(d => {
      const existing = m.get(d.date)
      if (!existing || (!existing.published && d.published)) m.set(d.date, d)
    })
    return m
  }, [devotionals])

  // Navigation
  const prev = () => {
    if (calView === "month") setCalCurrent(subMonths(calCurrent, 1))
    else if (calView === "week") setCalCurrent(subWeeks(calCurrent, 1))
    else setCalCurrent(subDays(calCurrent, 1))
  }
  const next = () => {
    if (calView === "month") setCalCurrent(addMonths(calCurrent, 1))
    else if (calView === "week") setCalCurrent(addWeeks(calCurrent, 1))
    else setCalCurrent(addDays(calCurrent, 1))
  }
  const goToday = () => {
    const now = new Date()
    setCalCurrent(now)
    setCalSelected(now)
  }

  const periodLabel = () => {
    if (calView === "month") return format(calCurrent, "MMMM yyyy")
    if (calView === "week") {
      const ws = startOfWeek(calCurrent, { weekStartsOn: 0 })
      const we = endOfWeek(calCurrent, { weekStartsOn: 0 })
      return `${format(ws, "MMM d")} – ${format(we, "MMM d, yyyy")}`
    }
    return format(calCurrent, "EEEE, MMMM d, yyyy")
  }

  // Month grid days (fills Sun–Sat rows)
  const monthGridDays = useMemo(() => {
    const ms = startOfMonth(calCurrent)
    const me = endOfMonth(calCurrent)
    return eachDayOfInterval({
      start: startOfWeek(ms, { weekStartsOn: 0 }),
      end: endOfWeek(me, { weekStartsOn: 0 }),
    })
  }, [calCurrent])

  // Week days
  const weekDays = useMemo(() => {
    const ws = startOfWeek(calCurrent, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: ws, end: addDays(ws, 6) })
  }, [calCurrent])

  // Dot color per devotion status
  const dotColor = (d?: Devotional) => {
    if (!d) return null
    if (d.featured && d.published) return "bg-[var(--church-gold)]"
    if (d.published) return "bg-emerald-500"
    return "bg-slate-400"
  }

  const cellBg = (d?: Devotional) => {
    if (!d) return ""
    if (d.featured && d.published) return "border-[var(--church-gold)]/40 bg-[var(--church-gold)]/5"
    if (d.published) return "border-emerald-500/30 bg-emerald-500/5"
    return "border-slate-300/60 bg-muted/30"
  }

  // Stats for the current month
  const monthStats = useMemo(() => {
    const ms = startOfMonth(calCurrent)
    const me = endOfMonth(calCurrent)
    const days = eachDayOfInterval({ start: ms, end: me })
    const total = days.length
    const filled = days.filter(d => byDate.has(format(d, "yyyy-MM-dd"))).length
    const published = days.filter(d => {
      const devo = byDate.get(format(d, "yyyy-MM-dd"))
      return devo?.published
    }).length
    return { total, filled, published, coverage: Math.round((filled / total) * 100) }
  }, [calCurrent, byDate])

  const selectedDevo = byDate.get(format(calSelected, "yyyy-MM-dd"))

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="w-8 h-8" onClick={prev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold text-foreground min-w-[220px] text-center text-sm">
            {periodLabel()}
          </span>
          <Button variant="outline" size="icon" className="w-8 h-8" onClick={next}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost" size="sm"
            className="text-[var(--church-primary)] text-xs px-2"
            onClick={goToday}
          >
            Today
          </Button>
        </div>
        <div className="flex border rounded-lg overflow-hidden bg-background">
          {(["month", "week", "day"] as const).map(v => (
            <Button
              key={v}
              variant={calView === v ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none h-auto py-1.5 px-3 capitalize text-xs"
              onClick={() => setCalView(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {/* Month stats bar */}
      {calView === "month" && (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--church-gold)]" />
            <span className="text-muted-foreground">Featured</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Published</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-muted-foreground">Draft</span>
          </div>
          <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
            <span><span className="font-semibold text-foreground">{monthStats.filled}</span>/{monthStats.total} days filled</span>
            <span><span className="font-semibold text-emerald-600">{monthStats.published}</span> published</span>
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[var(--church-primary)] rounded-full transition-all"
                  style={{ width: `${monthStats.coverage}%` }}
                />
              </div>
              <span className="font-semibold text-[var(--church-primary)]">{monthStats.coverage}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── MONTH VIEW ── */}
      {calView === "month" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-xs font-semibold text-muted-foreground text-center py-2">
                  {d}
                </div>
              ))}
            </div>
            {/* Grid */}
            <div className="grid grid-cols-7 border-l border-t border-border rounded-b-lg overflow-hidden">
              {monthGridDays.map(day => {
                const ds = format(day, "yyyy-MM-dd")
                const devo = byDate.get(ds)
                const inMonth = isSameMonth(day, calCurrent)
                const sel = isSameDay(day, calSelected)
                const now = isToday(day)
                const dot = dotColor(devo)
                return (
                  <div
                    key={ds}
                    onClick={() => setCalSelected(day)}
                    className={`
                      border-r border-b border-border p-1.5 min-h-[76px] cursor-pointer transition-colors
                      ${!inMonth ? "bg-muted/20" : "hover:bg-muted/30"}
                      ${sel ? "ring-2 ring-inset ring-[var(--church-primary)]" : ""}
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mx-auto mb-1
                      ${now ? "bg-[var(--church-primary)] text-white" : inMonth ? "text-foreground" : "text-muted-foreground"}
                    `}>
                      {format(day, "d")}
                    </div>
                    {devo && (
                      <div className={`rounded px-1 py-0.5 border text-xs truncate ${cellBg(devo)}`}>
                        <div className="flex items-center gap-1">
                          {dot && <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />}
                          <span className="truncate leading-tight">{devo.title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            <DevoDetailPanel
              devo={selectedDevo}
              date={calSelected}
              onEdit={onEdit}
              onPreview={onPreview}
            />
          </div>
        </div>
      )}

      {/* ── WEEK VIEW ── */}
      {calView === "week" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(day => {
                const ds = format(day, "yyyy-MM-dd")
                const devo = byDate.get(ds)
                const sel = isSameDay(day, calSelected)
                const now = isToday(day)
                const dot = dotColor(devo)
                return (
                  <div
                    key={ds}
                    onClick={() => setCalSelected(day)}
                    className={`
                      cursor-pointer rounded-xl border border-border p-2 min-h-[130px]
                      transition-colors hover:bg-muted/30
                      ${sel ? "ring-2 ring-[var(--church-primary)] border-[var(--church-primary)]/30" : ""}
                    `}
                  >
                    <div className="text-center mb-2">
                      <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
                      <div className={`
                        w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mx-auto
                        ${now ? "bg-[var(--church-primary)] text-white" : "text-foreground"}
                      `}>
                        {format(day, "d")}
                      </div>
                    </div>
                    {devo ? (
                      <div className={`rounded-lg border p-1.5 ${cellBg(devo)}`}>
                        {dot && <div className={`w-2 h-2 rounded-full mb-1 ${dot}`} />}
                        <p className="text-xs font-medium line-clamp-2 leading-tight">{devo.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{devo.scripture}</p>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted rounded-lg flex items-center justify-center" style={{ minHeight: 56 }}>
                        <span className="text-xs text-muted-foreground">—</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            <DevoDetailPanel
              devo={selectedDevo}
              date={calSelected}
              onEdit={onEdit}
              onPreview={onPreview}
            />
          </div>
        </div>
      )}

      {/* ── DAY VIEW ── */}
      {calView === "day" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Day navigator: prev / current / next */}
          <div className="space-y-2">
            {[-1, 0, 1].map(offset => {
              const day = addDays(calCurrent, offset)
              const ds = format(day, "yyyy-MM-dd")
              const devo = byDate.get(ds)
              const now = isToday(day)
              const isCurr = offset === 0
              const dot = dotColor(devo)
              return (
                <div
                  key={ds}
                  onClick={() => { setCalCurrent(day); setCalSelected(day) }}
                  className={`
                    p-3 rounded-xl border cursor-pointer transition-colors
                    ${isCurr
                      ? "border-[var(--church-primary)] bg-[var(--church-primary)]/5"
                      : "border-border hover:bg-muted/30"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${now ? "bg-[var(--church-primary)] text-white" : "bg-muted text-foreground"}
                    `}>
                      {format(day, "d")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{format(day, "EEEE")}</p>
                      <p className="text-xs text-muted-foreground">{format(day, "MMMM d, yyyy")}</p>
                    </div>
                    {dot && <div className={`w-2.5 h-2.5 rounded-full ml-auto flex-shrink-0 ${dot}`} />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Full detail */}
          <div className="lg:col-span-2">
            <DevoDetailPanel
              devo={byDate.get(format(calCurrent, "yyyy-MM-dd"))}
              date={calCurrent}
              onEdit={onEdit}
              onPreview={onPreview}
              full
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DevoDetailPanel sub-component
// ─────────────────────────────────────────────────────────────────────────────

function DevoDetailPanel({
  devo, date, onEdit, onPreview, full = false,
}: {
  devo: Devotional | undefined
  date: Date
  onEdit: (d: Devotional) => void
  onPreview: (d: Devotional) => void
  full?: boolean
}) {
  return (
    <div className="border border-border rounded-xl p-4 bg-background h-full flex flex-col">
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-semibold text-foreground">{format(date, "MMMM d, yyyy")}</span>
        {isToday(date) && (
          <Badge className="text-xs bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20 ml-auto">
            Today
          </Badge>
        )}
      </div>

      {devo ? (
        <div className="space-y-3 flex-1">
          {/* Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {devo.featured && devo.published && (
              <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30 text-xs">Featured</Badge>
            )}
            <Badge className={devo.published
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
              : "bg-muted text-muted-foreground text-xs"}>
              {devo.published ? "Published" : "Draft"}
            </Badge>
            {devo.status === "archived" && (
              <Badge variant="outline" className="text-xs text-muted-foreground">Archived</Badge>
            )}
            {devo.schedule_start && devo.schedule_end && (
              <Badge variant="outline" className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />Scheduled
              </Badge>
            )}
          </div>

          {/* Title + meta */}
          <div>
            <p className="font-semibold text-foreground leading-snug">{devo.title}</p>
            <p className="text-xs text-[var(--church-primary)] font-medium mt-0.5">{devo.scripture}</p>
            <p className="text-xs text-muted-foreground mt-0.5">By {devo.author}</p>
          </div>

          {/* Scripture quote */}
          {devo.scripture_text && (
            <blockquote className="border-l-4 border-[var(--church-primary)] pl-3 italic text-sm text-foreground leading-relaxed line-clamp-3">
              {devo.scripture_text}
            </blockquote>
          )}

          {/* Reflection (full in day view, clipped otherwise) */}
          <p className={`text-sm text-muted-foreground leading-relaxed ${full ? "whitespace-pre-wrap" : "line-clamp-4"}`}>
            {devo.reflection}
          </p>

          {/* Featured verse (day view only) */}
          {full && devo.featured_verse && (
            <div className="bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide mb-1">Featured Verse</p>
              <p className="text-sm font-serif italic text-foreground">&ldquo;{devo.featured_verse}&rdquo;</p>
              {devo.featured_verse_ref && (
                <p className="text-xs font-semibold text-[var(--church-primary)] mt-1">— {devo.featured_verse_ref}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1 mt-auto">
            <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs" onClick={() => onPreview(devo)}>
              <Eye className="w-3.5 h-3.5" />Preview
            </Button>
            <Button
              size="sm"
              className="flex-1 gap-1.5 text-xs bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
              onClick={() => onEdit(devo)}
            >
              <Edit className="w-3.5 h-3.5" />Edit
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground opacity-25 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No devotional for this day</p>
          <p className="text-xs text-muted-foreground mt-1">Select a day with a devotional or create one.</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ReadingPlanTab sub-component
// ─────────────────────────────────────────────────────────────────────────────

interface ReadingPlanTabProps {
  entries: ReadingPlanEntry[]
  rpWeek: Date
  rpWeekStart: string
  onPrev: () => void
  onNext: () => void
  onThisWeek: () => void
  onAdd: (day: string) => void
  onEdit: (day: string, entry: ReadingPlanEntry) => void
  onDelete: (entry: ReadingPlanEntry) => void
}

function ReadingPlanTab({
  entries, rpWeek, rpWeekStart,
  onPrev, onNext, onThisWeek,
  onAdd, onEdit, onDelete,
}: ReadingPlanTabProps) {
  const byDay = useMemo(() => {
    const m = new Map<string, ReadingPlanEntry>()
    entries.forEach(e => m.set(e.day_of_week, e))
    return m
  }, [entries])

  // Build the 7 calendar dates for this week (Mon – Sun)
  const weekDates = useMemo(() => {
    return DAYS_OF_WEEK.map((_, i) => {
      const d = new Date(rpWeek)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [rpWeek])

  const sundayEnd = new Date(rpWeek.getTime() + 6 * 86400000)
  const weekLabel = `${format(rpWeek, "MMM d")} – ${format(sundayEnd, "MMM d, yyyy")}`
  const filledCount = entries.length

  const isCurrentWeek = (() => {
    const today = new Date()
    const day = today.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const mon = new Date(today)
    mon.setDate(mon.getDate() + diff)
    mon.setHours(0, 0, 0, 0)
    return format(mon, "yyyy-MM-dd") === rpWeekStart
  })()

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="w-8 h-8" onClick={onPrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-[220px] text-center">
            <span className="font-semibold text-foreground text-sm flex-1">{weekLabel}</span>
            {isCurrentWeek && (
              <Badge className="text-xs bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20">
                This Week
              </Badge>
            )}
          </div>
          <Button variant="outline" size="icon" className="w-8 h-8" onClick={onNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost" size="sm"
            className="text-[var(--church-primary)] text-xs px-2"
            onClick={onThisWeek}
          >
            This Week
          </Button>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{filledCount}</span> / 7 days filled
          </span>
        </div>
      </div>

      {/* Coverage bar */}
      <div className="bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--church-primary)] transition-all"
          style={{ width: `${Math.round((filledCount / 7) * 100)}%` }}
        />
      </div>

      {/* Day cards — calendar grid Mon–Sun */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DAYS_OF_WEEK.map((day, i) => {
          const entry = byDay.get(day)
          const date = weekDates[i]
          const isToday_ = isToday(date)

          return (
            <Card
              key={day}
              className={`relative transition-shadow hover:shadow-md ${
                isToday_ ? "border-[var(--church-primary)]/40 bg-[var(--church-primary)]/5" : ""
              }`}
            >
              <CardContent className="p-4 flex flex-col gap-3">
                {/* Day header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${isToday_ ? "bg-[var(--church-primary)] text-white" : "bg-muted text-foreground"}
                    `}>
                      {format(date, "d")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{day}</p>
                      <p className="text-xs text-muted-foreground">{format(date, "MMM d")}</p>
                    </div>
                  </div>
                  {isToday_ && (
                    <Badge className="text-xs bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20">
                      Today
                    </Badge>
                  )}
                </div>

                {/* Reading content */}
                {entry ? (
                  <div className="flex-1 space-y-2">
                    <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Reading</p>
                      <p className="text-sm text-foreground font-medium leading-snug">{entry.reading}</p>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-muted-foreground italic leading-relaxed">{entry.notes}</p>
                    )}
                    {/* Actions */}
                    <div className="flex gap-1.5 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5 text-xs h-7"
                        onClick={() => onEdit(day, entry)}
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => onDelete(entry)}
                        title="Remove reading"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex-1 flex flex-col items-center justify-center py-4 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-[var(--church-primary)]/40 hover:bg-[var(--church-primary)]/5 transition-colors"
                    onClick={() => onAdd(day)}
                  >
                    <Plus className="w-5 h-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Add reading</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Info callout */}
      <Card className="bg-[var(--church-light-blue)] border-[var(--church-primary)]/20">
        <CardContent className="p-4 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">How this works</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Readings you add here are displayed on the public <strong>Bible Reading</strong> page under &ldquo;This Week&apos;s Reading Plan&rdquo;. Navigate to other weeks to manage future or past plans.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
