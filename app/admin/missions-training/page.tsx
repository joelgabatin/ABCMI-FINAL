"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  GraduationCap, Plus, Eye, EyeOff, Pencil, Trash2,
  Calendar, MapPin, Users, Clock, CheckCircle, Archive,
  BookOpen, List, X, ArrowLeft, UserCheck, UserX, Phone, Mail, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Module = { id: number; module: string; title: string; description: string }
type ScheduleDay = { id: number; day: string; activities: string }
type Requirement = { id: number; text: string }
type Registration = {
  id: number
  name: string
  email: string
  phone: string
  experience: string
  availability: string
  submittedAt: string
  status: "pending" | "accepted" | "denied"
}

type Training = {
  id: number
  title: string
  subtitle: string
  startDate: string
  endDate: string
  registrationDeadline: string
  location: string
  slots: number
  overview: string
  curriculum: Module[]
  schedule: ScheduleDay[]
  requirements: Requirement[]
  visible: boolean
  archived: boolean
  registrations: Registration[]
}

const sampleRegistrations = (n: number): Registration[] =>
  [
    { id: 1, name: "Carlos Mendoza", email: "carlos@email.com", phone: "+63 912 345 6789", experience: "3 years cell group leader", availability: "In-person", submittedAt: "2025-06-01", status: "pending" },
    { id: 2, name: "Ana Reyes", email: "ana@email.com", phone: "+63 917 234 5678", experience: "New believer, 1 year", availability: "Online", submittedAt: "2025-06-03", status: "accepted" },
    { id: 3, name: "Jose Bautista", email: "jose@email.com", phone: "+63 919 876 5432", experience: "Pastor assistant, 5 years", availability: "In-person", submittedAt: "2025-06-05", status: "pending" },
    { id: 4, name: "Maria Santos", email: "maria@email.com", phone: "+63 921 111 2222", experience: "Youth leader", availability: "Online", submittedAt: "2025-06-07", status: "denied" },
    { id: 5, name: "Ramon Dela Cruz", email: "ramon@email.com", phone: "+63 932 333 4444", experience: "2 years missions volunteer", availability: "In-person", submittedAt: "2025-06-08", status: "pending" },
  ].slice(0, n)

const sampleTrainings: Training[] = [
  {
    id: 1,
    title: "Church Planting & Missions Training",
    subtitle: "Equipping Faithful Servants for Local and Global Church Planting",
    startDate: "2025-07-14", endDate: "2025-07-21",
    registrationDeadline: "2025-06-30",
    location: "ABCMI Main Church, East Quirino Hill, Baguio City",
    slots: 40, overview: "Intensive one-week Missions Training designed to teach, train, and equip men and women called to plant churches.",
    curriculum: [
      { id: 1, module: "Module 1", title: "Biblical Basis of Missions", description: "Understanding God's heart for the nations through Scripture." },
      { id: 2, module: "Module 2", title: "Church Planting Principles", description: "Methods, models, and challenges of establishing local and house churches." },
      { id: 3, module: "Module 3", title: "Evangelism & Discipleship", description: "How to lead people to Christ and disciple them toward maturity." },
    ],
    schedule: [
      { id: 1, day: "Day 1 — Mon", activities: "Orientation, Opening Worship, Module 1" },
      { id: 2, day: "Day 2 — Tue", activities: "Module 2: Church Planting Principles, Workshop" },
      { id: 3, day: "Day 7 — Sun", activities: "Commissioning Service, Certificate Awarding" },
    ],
    requirements: [
      { id: 1, text: "Committed Christian with minimum 1 year church attendance" },
      { id: 2, text: "Letter of recommendation from local pastor" },
    ],
    visible: true, archived: false,
    registrations: sampleRegistrations(5),
  },
  {
    id: 2,
    title: "Evangelism & Discipleship Intensive",
    subtitle: "Practical Training for Reaching Your Community",
    startDate: "2025-09-08", endDate: "2025-09-12",
    registrationDeadline: "2025-08-25",
    location: "ABCMI Main Church, Baguio City",
    slots: 30, overview: "5-day intensive focused on personal evangelism methods and one-on-one discipleship.",
    curriculum: [
      { id: 1, module: "Module 1", title: "Understanding the Gospel", description: "Clearly presenting the message of salvation." },
      { id: 2, module: "Module 2", title: "Sharing Your Faith", description: "Practical tools for personal evangelism." },
    ],
    schedule: [
      { id: 1, day: "Day 1 — Mon", activities: "Orientation, Module 1" },
      { id: 2, day: "Day 5 — Fri", activities: "Field Evangelism, Closing Ceremony" },
    ],
    requirements: [{ id: 1, text: "Active member of a local church or ministry" }],
    visible: true, archived: false,
    registrations: sampleRegistrations(2),
  },
  {
    id: 3,
    title: "2024 Church Planting Cohort",
    subtitle: "Annual Church Planting and Leadership Training",
    startDate: "2024-07-08", endDate: "2024-07-15",
    registrationDeadline: "2024-06-20",
    location: "ABCMI Main Church, Baguio City",
    slots: 35, overview: "Completed training cohort from 2024 with 38 participants from 5 provinces.",
    curriculum: [], schedule: [], requirements: [],
    visible: false, archived: true,
    registrations: sampleRegistrations(5),
  },
]

function nextId(arr: { id: number }[]) {
  return arr.length > 0 ? Math.max(...arr.map(x => x.id)) + 1 : 1
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ── Inline Training Form ────────────────────────────────────────────────────
function TrainingFormPanel({
  initial,
  onSave,
  onCancel,
  isNew,
}: {
  initial: Omit<Training, "id" | "registrations">
  onSave: (t: Omit<Training, "id" | "registrations">) => void
  onCancel: () => void
  isNew: boolean
}) {
  const [form, setForm] = useState(initial)
  const [newModule, setNewModule] = useState({ module: "", title: "", description: "" })
  const [newDay, setNewDay] = useState({ day: "", activities: "" })
  const [newReq, setNewReq] = useState("")

  function set(field: string, value: unknown) { setForm(f => ({ ...f, [field]: value })) }
  function addModule() {
    if (!newModule.title) return
    set("curriculum", [...form.curriculum, { id: nextId(form.curriculum), ...newModule }])
    setNewModule({ module: "", title: "", description: "" })
  }
  function addDay() {
    if (!newDay.day) return
    set("schedule", [...form.schedule, { id: nextId(form.schedule), ...newDay }])
    setNewDay({ day: "", activities: "" })
  }
  function addReq() {
    if (!newReq.trim()) return
    set("requirements", [...form.requirements, { id: nextId(form.requirements), text: newReq.trim() }])
    setNewReq("")
  }

  return (
    <div className="max-w-4xl">
      {/* Back button */}
      <button onClick={onCancel} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Trainings
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{isNew ? "Create New Training" : "Edit Training"}</h2>
        <p className="text-muted-foreground text-sm mt-1">{isNew ? "Fill in the details to create a new missions training program." : "Update the training details below."}</p>
      </div>

      <div className="space-y-8">
        {/* ── Basic Info ── */}
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Training Title *</Label>
              <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Church Planting & Missions Training" />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="Short tagline for the training" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Registration Deadline</Label>
                <Input type="date" value={form.registrationDeadline} onChange={e => set("registrationDeadline", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. ABCMI Main Church, Baguio City" />
              </div>
              <div className="space-y-2">
                <Label>Total Slots</Label>
                <Input type="number" value={form.slots} onChange={e => set("slots", Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Overview / Description</Label>
              <Textarea value={form.overview} onChange={e => set("overview", e.target.value)} rows={4} placeholder="Brief description of the training program..." />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium text-sm text-foreground">Visible on Website</p>
                <p className="text-xs text-muted-foreground">Show this training to public visitors</p>
              </div>
              <Switch checked={form.visible} onCheckedChange={v => set("visible", v)} />
            </div>
          </CardContent>
        </Card>

        {/* ── Curriculum ── */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-[var(--church-primary)]" /> Curriculum Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {form.curriculum.map(m => (
                <div key={m.id} className="flex items-start gap-3 bg-muted/50 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--church-primary)] font-semibold uppercase tracking-wide">{m.module}</p>
                    <p className="font-medium text-sm text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 flex-shrink-0" onClick={() => set("curriculum", form.curriculum.filter(x => x.id !== m.id))}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-2">
              <Input placeholder="Label (e.g. Module 1)" value={newModule.module} onChange={e => setNewModule(p => ({ ...p, module: e.target.value }))} />
              <Input placeholder="Module title" value={newModule.title} onChange={e => setNewModule(p => ({ ...p, title: e.target.value }))} />
              <Input placeholder="Short description" value={newModule.description} onChange={e => setNewModule(p => ({ ...p, description: e.target.value }))} />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addModule}><Plus className="w-3.5 h-3.5" /> Add Module</Button>
          </CardContent>
        </Card>

        {/* ── Schedule ── */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--church-primary)]" /> Training Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {form.schedule.map(d => (
                <div key={d.id} className="flex items-start gap-3 bg-muted/50 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide">{d.day}</p>
                    <p className="text-sm text-muted-foreground">{d.activities}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 flex-shrink-0" onClick={() => set("schedule", form.schedule.filter(x => x.id !== d.id))}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <Input placeholder="Day label (e.g. Day 1 — Mon)" value={newDay.day} onChange={e => setNewDay(p => ({ ...p, day: e.target.value }))} />
              <Input placeholder="Activities for the day" value={newDay.activities} onChange={e => setNewDay(p => ({ ...p, activities: e.target.value }))} />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addDay}><Plus className="w-3.5 h-3.5" /> Add Day</Button>
          </CardContent>
        </Card>

        {/* ── Requirements ── */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><List className="w-4 h-4 text-[var(--church-primary)]" /> Requirements</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {form.requirements.map(r => (
                <div key={r.id} className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-2.5">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground flex-1">{r.text}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 flex-shrink-0" onClick={() => set("requirements", form.requirements.filter(x => x.id !== r.id))}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add a requirement..." value={newReq} onChange={e => setNewReq(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addReq())} />
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={addReq}><Plus className="w-3.5 h-3.5" /> Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 pb-8">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white px-8"
            onClick={() => onSave(form)}
            disabled={!form.title || !form.startDate || !form.endDate}
          >
            <CheckCircle className="w-4 h-4 mr-2" /> {isNew ? "Create Training" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Registrations Panel ─────────────────────────────────────────────────────
function RegistrationsPanel({ training, onClose, onUpdateStatus }: {
  training: Training
  onClose: () => void
  onUpdateStatus: (trainingId: number, regId: number, status: Registration["status"]) => void
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "denied">("all")
  const filtered = training.registrations.filter(r => filter === "all" || r.status === filter)
  const counts = {
    all: training.registrations.length,
    pending: training.registrations.filter(r => r.status === "pending").length,
    accepted: training.registrations.filter(r => r.status === "accepted").length,
    denied: training.registrations.filter(r => r.status === "denied").length,
  }

  return (
    <div className="max-w-4xl">
      <button onClick={onClose} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Trainings
      </button>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Registrations</h2>
        <p className="text-muted-foreground text-sm mt-1">{training.title}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {(["all", "pending", "accepted", "denied"] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("rounded-xl border p-4 text-left transition-all", filter === s ? "border-[var(--church-primary)] bg-[var(--church-primary)]/5" : "border-border bg-background hover:border-[var(--church-primary)]/40")}>
            <p className="text-2xl font-bold text-foreground">{counts[s]}</p>
            <p className="text-sm text-muted-foreground capitalize">{s === "all" ? "Total" : s}</p>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No {filter} registrations.</CardContent></Card>
        )}
        {filtered.map(reg => (
          <Card key={reg.id} className="border border-border">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] font-semibold text-sm">
                    {reg.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-foreground">{reg.name}</p>
                    <Badge className={cn("text-xs border-none", reg.status === "accepted" ? "bg-green-100 text-green-700" : reg.status === "denied" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
                      {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{reg.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{reg.phone}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span><span className="font-medium text-foreground">Experience:</span> {reg.experience}</span>
                    <span><span className="font-medium text-foreground">Availability:</span> {reg.availability}</span>
                    <span><span className="font-medium text-foreground">Submitted:</span> {formatDate(reg.submittedAt)}</span>
                  </div>
                </div>
                {reg.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                      onClick={() => onUpdateStatus(training.id, reg.id, "accepted")}>
                      <UserCheck className="w-3.5 h-3.5" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 gap-1.5"
                      onClick={() => onUpdateStatus(training.id, reg.id, "denied")}>
                      <UserX className="w-3.5 h-3.5" /> Deny
                    </Button>
                  </div>
                )}
                {reg.status === "accepted" && (
                  <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 gap-1.5 flex-shrink-0"
                    onClick={() => onUpdateStatus(training.id, reg.id, "denied")}>
                    <UserX className="w-3.5 h-3.5" /> Revoke
                  </Button>
                )}
                {reg.status === "denied" && (
                  <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50 gap-1.5 flex-shrink-0"
                    onClick={() => onUpdateStatus(training.id, reg.id, "accepted")}>
                    <UserCheck className="w-3.5 h-3.5" /> Accept
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── Training Card ────────────────────────────────────────────────────────────
function TrainingCard({ t, onEdit, onViewRegs, onToggleVisible, onToggleArchive, onDelete }: {
  t: Training
  onEdit: () => void
  onViewRegs: () => void
  onToggleVisible: () => void
  onToggleArchive: () => void
  onDelete: () => void
}) {
  const accepted = t.registrations.filter(r => r.status === "accepted").length
  const pending = t.registrations.filter(r => r.status === "pending").length

  return (
    <Card className={cn("border border-border shadow-sm", t.archived && "opacity-60")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-foreground text-base">{t.title}</h3>
              {t.archived ? (
                <Badge className="bg-gray-100 text-gray-600 border-none text-xs">Archived</Badge>
              ) : t.visible ? (
                <Badge className="bg-green-100 text-green-700 border-none text-xs">Visible</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-700 border-none text-xs">Hidden</Badge>
              )}
            </div>
            {t.subtitle && <p className="text-muted-foreground text-sm">{t.subtitle}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
            <span>{formatDate(t.startDate)} – {formatDate(t.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
            <span className="truncate">{t.location || "TBA"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
            <span>{accepted} accepted · {pending} pending · {t.slots} slots</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
            <span>{t.curriculum.length} modules · {t.schedule.length} days</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onEdit}>
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onViewRegs}>
            <Users className="w-3.5 h-3.5" /> Registrations
            {pending > 0 && <Badge className="bg-amber-500 text-white border-none text-xs ml-1 px-1.5 py-0">{pending}</Badge>}
          </Button>
          {!t.archived && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={onToggleVisible}>
              {t.visible ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Show</>}
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onToggleArchive}>
            <Archive className="w-3.5 h-3.5" /> {t.archived ? "Unarchive" : "Archive"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Training?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete &quot;{t.title}&quot; and all its registrations. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
type View =
  | { type: "list" }
  | { type: "create" }
  | { type: "edit"; trainingId: number }
  | { type: "registrations"; trainingId: number }

const emptyForm = (): Omit<Training, "id" | "registrations"> => ({
  title: "", subtitle: "", startDate: "", endDate: "",
  registrationDeadline: "", location: "", slots: 30, overview: "",
  curriculum: [], schedule: [], requirements: [], visible: true, archived: false,
})

export default function AdminMissionsTrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>(sampleTrainings)
  const [view, setView] = useState<View>({ type: "list" })
  const [listTab, setListTab] = useState("active")

  const active = trainings.filter(t => !t.archived)
  const archived = trainings.filter(t => t.archived)

  function handleCreate(data: Omit<Training, "id" | "registrations">) {
    const id = trainings.length > 0 ? Math.max(...trainings.map(t => t.id)) + 1 : 1
    setTrainings(p => [...p, { ...data, id, registrations: [] }])
    setView({ type: "list" })
  }

  function handleEdit(data: Omit<Training, "id" | "registrations">) {
    if (view.type !== "edit") return
    setTrainings(p => p.map(t => t.id === view.trainingId ? { ...t, ...data } : t))
    setView({ type: "list" })
  }

  function handleUpdateRegStatus(trainingId: number, regId: number, status: Registration["status"]) {
    setTrainings(p => p.map(t => t.id === trainingId
      ? { ...t, registrations: t.registrations.map(r => r.id === regId ? { ...r, status } : r) }
      : t
    ))
  }

  function toggleVisible(id: number) { setTrainings(p => p.map(t => t.id === id ? { ...t, visible: !t.visible } : t)) }
  function toggleArchive(id: number) { setTrainings(p => p.map(t => t.id === id ? { ...t, archived: !t.archived, ...(t.archived ? {} : { visible: false }) } : t)) }
  function deleteTraining(id: number) { setTrainings(p => p.filter(t => t.id !== id)) }

  // ── Render sub-views ────────────────────────────────────────────────────
  if (view.type === "create") {
    return (
      <DashboardLayout variant="admin" title="Missions Training">
        <main className="p-6">
          <TrainingFormPanel initial={emptyForm()} onSave={handleCreate} onCancel={() => setView({ type: "list" })} isNew />
        </main>
      </DashboardLayout>
    )
  }

  if (view.type === "edit") {
    const t = trainings.find(x => x.id === view.trainingId)
    if (!t) return null
    const { registrations: _r, id: _id, ...editInitial } = t
    return (
      <DashboardLayout variant="admin" title="Missions Training">
        <main className="p-6">
          <TrainingFormPanel initial={editInitial} onSave={handleEdit} onCancel={() => setView({ type: "list" })} isNew={false} />
        </main>
      </DashboardLayout>
    )
  }

  if (view.type === "registrations") {
    const t = trainings.find(x => x.id === view.trainingId)
    if (!t) return null
    return (
      <DashboardLayout variant="admin" title="Missions Training">
        <main className="p-6">
          <RegistrationsPanel training={t} onClose={() => setView({ type: "list" })} onUpdateStatus={handleUpdateRegStatus} />
        </main>
      </DashboardLayout>
    )
  }

  // ── List view ────────────────────────────────────────────────────────────
  const totalPending = trainings.reduce((acc, t) => acc + t.registrations.filter(r => r.status === "pending").length, 0)

  return (
    <DashboardLayout variant="admin" title="Missions Training">
      <main className="p-6">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Missions Training</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage training programs and registrations.</p>
          </div>
          <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2" onClick={() => setView({ type: "create" })}>
            <Plus className="w-4 h-4" /> Create Training
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Trainings", value: trainings.length, icon: GraduationCap, color: "text-[var(--church-primary)]" },
            { label: "Active", value: active.length, icon: Eye, color: "text-green-600" },
            { label: "Pending Registrations", value: totalPending, icon: Users, color: "text-amber-600" },
            { label: "Archived", value: archived.length, icon: Archive, color: "text-gray-500" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <s.icon className={cn("w-8 h-8 flex-shrink-0", s.color)} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={listTab} onValueChange={setListTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archived.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-4">
              {active.length === 0 && (
                <Card><CardContent className="py-16 text-center text-muted-foreground">No active trainings. Create one above.</CardContent></Card>
              )}
              {active.map(t => (
                <TrainingCard key={t.id} t={t}
                  onEdit={() => setView({ type: "edit", trainingId: t.id })}
                  onViewRegs={() => setView({ type: "registrations", trainingId: t.id })}
                  onToggleVisible={() => toggleVisible(t.id)}
                  onToggleArchive={() => toggleArchive(t.id)}
                  onDelete={() => deleteTraining(t.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="archived">
            <div className="space-y-4">
              {archived.length === 0 && (
                <Card><CardContent className="py-16 text-center text-muted-foreground">No archived trainings.</CardContent></Card>
              )}
              {archived.map(t => (
                <TrainingCard key={t.id} t={t}
                  onEdit={() => setView({ type: "edit", trainingId: t.id })}
                  onViewRegs={() => setView({ type: "registrations", trainingId: t.id })}
                  onToggleVisible={() => toggleVisible(t.id)}
                  onToggleArchive={() => toggleArchive(t.id)}
                  onDelete={() => deleteTraining(t.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
