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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  GraduationCap, Plus, Eye, EyeOff, Pencil, Trash2,
  Calendar, MapPin, Users, Clock, CheckCircle, Archive,
  BookOpen, List, X
} from "lucide-react"
import { cn } from "@/lib/utils"

type Module = { id: number; module: string; title: string; description: string }
type ScheduleDay = { id: number; day: string; activities: string }
type Requirement = { id: number; text: string }

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
  registrations: number
}

const sampleTrainings: Training[] = [
  {
    id: 1,
    title: "Church Planting & Missions Training",
    subtitle: "Equipping Faithful Servants for Local and Global Church Planting",
    startDate: "2025-07-14",
    endDate: "2025-07-21",
    registrationDeadline: "2025-06-30",
    location: "ABCMI Main Church, East Quirino Hill, Baguio City (with Online Option)",
    slots: 40,
    overview: "This intensive one-week Missions Training is designed to teach, train, and equip men and women called to plant churches, lead house groups, or serve in cross-cultural missions.",
    curriculum: [
      { id: 1, module: "Module 1", title: "Biblical Basis of Missions", description: "Understanding God's heart for the nations through Scripture." },
      { id: 2, module: "Module 2", title: "Church Planting Principles", description: "Methods, models, and challenges of establishing local and house churches." },
      { id: 3, module: "Module 3", title: "Evangelism & Discipleship", description: "How to lead people to Christ and disciple them toward maturity." },
      { id: 4, module: "Module 4", title: "Cross-Cultural Ministry", description: "Navigating culture, language, and contextualization in missions." },
      { id: 5, module: "Module 5", title: "Leadership in Ministry", description: "Servant leadership, team dynamics, and pastoral care basics." },
      { id: 6, module: "Module 6", title: "Practical Field Work", description: "Supervised outreach and community ministry in Baguio City." },
    ],
    schedule: [
      { id: 1, day: "Day 1 — Mon", activities: "Orientation, Opening Worship, Module 1: Biblical Basis of Missions" },
      { id: 2, day: "Day 2 — Tue", activities: "Module 2: Church Planting Principles, Workshop & Case Studies" },
      { id: 3, day: "Day 3 — Wed", activities: "Module 3: Evangelism & Discipleship, Role Play & Practicum" },
      { id: 4, day: "Day 4 — Thu", activities: "Module 4: Cross-Cultural Ministry, Panel Discussion" },
      { id: 5, day: "Day 5 — Fri", activities: "Module 5: Leadership in Ministry, Group Projects" },
      { id: 6, day: "Day 6 — Sat", activities: "Module 6: Field Work — Community Outreach & Evangelism" },
      { id: 7, day: "Day 7 — Sun", activities: "Commissioning Service, Certificate Awarding, Closing Worship" },
    ],
    requirements: [
      { id: 1, text: "Must be a committed Christian with a minimum of 1 year church attendance" },
      { id: 2, text: "Letter of recommendation from your local pastor or church leader" },
      { id: 3, text: "Willingness to participate in all training sessions" },
      { id: 4, text: "For in-person: Ability to attend all 7 days on-site in Baguio City" },
      { id: 5, text: "For online: Stable internet connection and Zoom access" },
    ],
    visible: true,
    archived: false,
    registrations: 23,
  },
  {
    id: 2,
    title: "Evangelism & Discipleship Intensive",
    subtitle: "Practical Training for Reaching Your Community",
    startDate: "2025-09-08",
    endDate: "2025-09-12",
    registrationDeadline: "2025-08-25",
    location: "ABCMI Main Church, Baguio City",
    slots: 30,
    overview: "A 5-day intensive focused on personal evangelism methods, one-on-one discipleship, and leading small group Bible studies. Perfect for cell group leaders and lay ministers.",
    curriculum: [
      { id: 1, module: "Module 1", title: "Understanding the Gospel", description: "Clearly presenting the message of salvation." },
      { id: 2, module: "Module 2", title: "Sharing Your Faith", description: "Practical tools for personal evangelism in everyday contexts." },
      { id: 3, module: "Module 3", title: "One-on-One Discipleship", description: "How to walk alongside a new believer toward spiritual maturity." },
      { id: 4, module: "Module 4", title: "Leading Small Groups", description: "Facilitating effective Bible study groups in homes and communities." },
    ],
    schedule: [
      { id: 1, day: "Day 1 — Mon", activities: "Orientation, Module 1: Understanding the Gospel" },
      { id: 2, day: "Day 2 — Tue", activities: "Module 2: Sharing Your Faith, Outreach Practicum" },
      { id: 3, day: "Day 3 — Wed", activities: "Module 3: One-on-One Discipleship, Role Play Sessions" },
      { id: 4, day: "Day 4 — Thu", activities: "Module 4: Leading Small Groups, Group Workshop" },
      { id: 5, day: "Day 5 — Fri", activities: "Field Evangelism, Closing Ceremony & Commissioning" },
    ],
    requirements: [
      { id: 1, text: "Active member of a local church or ministry" },
      { id: 2, text: "Heart for evangelism and reaching the lost" },
      { id: 3, text: "Willingness to participate in outreach activities" },
    ],
    visible: true,
    archived: false,
    registrations: 8,
  },
  {
    id: 3,
    title: "2024 Church Planting Cohort",
    subtitle: "Annual Church Planting and Leadership Training",
    startDate: "2024-07-08",
    endDate: "2024-07-15",
    registrationDeadline: "2024-06-20",
    location: "ABCMI Main Church, Baguio City",
    slots: 35,
    overview: "Completed training cohort from 2024 with 38 participants from 5 provinces.",
    curriculum: [],
    schedule: [],
    requirements: [],
    visible: false,
    archived: true,
    registrations: 38,
  },
]

const emptyTraining = (): Omit<Training, "id" | "registrations"> => ({
  title: "",
  subtitle: "",
  startDate: "",
  endDate: "",
  registrationDeadline: "",
  location: "",
  slots: 30,
  overview: "",
  curriculum: [],
  schedule: [],
  requirements: [],
  visible: true,
  archived: false,
})

function nextId(arr: { id: number }[]) {
  return arr.length > 0 ? Math.max(...arr.map(x => x.id)) + 1 : 1
}

function TrainingForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Training, "id" | "registrations">
  onSave: (t: Omit<Training, "id" | "registrations">) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [newModule, setNewModule] = useState({ module: "", title: "", description: "" })
  const [newDay, setNewDay] = useState({ day: "", activities: "" })
  const [newReq, setNewReq] = useState("")

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function addModule() {
    if (!newModule.title) return
    set("curriculum", [...form.curriculum, { id: nextId(form.curriculum), ...newModule }])
    setNewModule({ module: "", title: "", description: "" })
  }

  function removeModule(id: number) {
    set("curriculum", form.curriculum.filter(m => m.id !== id))
  }

  function addDay() {
    if (!newDay.day) return
    set("schedule", [...form.schedule, { id: nextId(form.schedule), ...newDay }])
    setNewDay({ day: "", activities: "" })
  }

  function removeDay(id: number) {
    set("schedule", form.schedule.filter(d => d.id !== id))
  }

  function addReq() {
    if (!newReq.trim()) return
    set("requirements", [...form.requirements, { id: nextId(form.requirements), text: newReq.trim() }])
    setNewReq("")
  }

  function removeReq(id: number) {
    set("requirements", form.requirements.filter(r => r.id !== id))
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">Basic Information</h3>
        <div className="space-y-2">
          <Label>Training Title *</Label>
          <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Church Planting & Missions Training" />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="Short tagline for the training" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>End Date *</Label>
            <Input type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Registration Deadline</Label>
            <Input type="date" value={form.registrationDeadline} onChange={e => set("registrationDeadline", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Total Slots</Label>
            <Input type="number" value={form.slots} onChange={e => set("slots", Number(e.target.value))} min={1} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. ABCMI Main Church, Baguio City" />
        </div>
        <div className="space-y-2">
          <Label>Overview / Description</Label>
          <Textarea value={form.overview} onChange={e => set("overview", e.target.value)} rows={4} placeholder="Brief description of the training program..." />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm text-foreground">Visible on Website</p>
            <p className="text-xs text-muted-foreground">Show this training to public visitors</p>
          </div>
          <Switch checked={form.visible} onCheckedChange={v => set("visible", v)} />
        </div>
      </div>

      <Separator />

      {/* Curriculum */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><BookOpen className="w-4 h-4 text-[var(--church-primary)]" /> Curriculum Breakdown</h3>
        <div className="space-y-2">
          {form.curriculum.map(m => (
            <div key={m.id} className="flex items-start gap-2 bg-[var(--church-soft-gray)] rounded-lg px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--church-primary)] font-semibold">{m.module}</p>
                <p className="font-medium text-sm text-foreground">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500 flex-shrink-0" onClick={() => removeModule(m.id)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          <Input placeholder="Module label (e.g. Module 1)" value={newModule.module} onChange={e => setNewModule(p => ({ ...p, module: e.target.value }))} />
          <Input placeholder="Module title" value={newModule.title} onChange={e => setNewModule(p => ({ ...p, title: e.target.value }))} />
          <Input placeholder="Short description" value={newModule.description} onChange={e => setNewModule(p => ({ ...p, description: e.target.value }))} />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={addModule}><Plus className="w-3.5 h-3.5" /> Add Module</Button>
      </div>

      <Separator />

      {/* Schedule */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--church-primary)]" /> Training Schedule</h3>
        <div className="space-y-2">
          {form.schedule.map(d => (
            <div key={d.id} className="flex items-start gap-2 bg-[var(--church-soft-gray)] rounded-lg px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--church-primary)]">{d.day}</p>
                <p className="text-sm text-muted-foreground">{d.activities}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500 flex-shrink-0" onClick={() => removeDay(d.id)}>
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
      </div>

      <Separator />

      {/* Requirements */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><List className="w-4 h-4 text-[var(--church-primary)]" /> Requirements</h3>
        <div className="space-y-2">
          {form.requirements.map(r => (
            <div key={r.id} className="flex items-center gap-2 bg-[var(--church-soft-gray)] rounded-lg px-4 py-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-muted-foreground flex-1">{r.text}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500 flex-shrink-0" onClick={() => removeReq(r.id)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Add a requirement..." value={newReq} onChange={e => setNewReq(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addReq())} />
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={addReq}><Plus className="w-3.5 h-3.5" /> Add</Button>
        </div>
      </div>

      <DialogFooter className="pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
          onClick={() => onSave(form)}
          disabled={!form.title || !form.startDate || !form.endDate}
        >
          <CheckCircle className="w-4 h-4 mr-1.5" /> Save Training
        </Button>
      </DialogFooter>
    </div>
  )
}

export default function AdminMissionsTrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>(sampleTrainings)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Training | null>(null)
  const [tab, setTab] = useState("active")

  const active = trainings.filter(t => !t.archived)
  const archived = trainings.filter(t => t.archived)

  function handleCreate(data: Omit<Training, "id" | "registrations">) {
    const id = trainings.length > 0 ? Math.max(...trainings.map(t => t.id)) + 1 : 1
    setTrainings(p => [...p, { ...data, id, registrations: 0 }])
    setCreateOpen(false)
  }

  function handleEdit(data: Omit<Training, "id" | "registrations">) {
    if (!editTarget) return
    setTrainings(p => p.map(t => t.id === editTarget.id ? { ...t, ...data } : t))
    setEditTarget(null)
  }

  function toggleVisible(id: number) {
    setTrainings(p => p.map(t => t.id === id ? { ...t, visible: !t.visible } : t))
  }

  function toggleArchive(id: number) {
    setTrainings(p => p.map(t => t.id === id ? { ...t, archived: !t.archived, visible: t.archived ? t.visible : false } : t))
  }

  function deleteTraining(id: number) {
    setTrainings(p => p.filter(t => t.id !== id))
  }

  function formatDate(d: string) {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  function TrainingCard({ t }: { t: Training }) {
    return (
      <Card className={cn("border border-border shadow-sm", t.archived && "opacity-60")}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-foreground text-base leading-snug">{t.title}</h3>
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
              <span>{t.registrations} / {t.slots} registered</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
              <span>{t.curriculum.length} modules · {t.schedule.length} days</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Edit */}
            <Dialog open={editTarget?.id === t.id} onOpenChange={open => !open && setEditTarget(null)}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditTarget(t)}>
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Training</DialogTitle>
                </DialogHeader>
                {editTarget?.id === t.id && (
                  <TrainingForm
                    initial={{ title: t.title, subtitle: t.subtitle, startDate: t.startDate, endDate: t.endDate, registrationDeadline: t.registrationDeadline, location: t.location, slots: t.slots, overview: t.overview, curriculum: t.curriculum, schedule: t.schedule, requirements: t.requirements, visible: t.visible, archived: t.archived }}
                    onSave={handleEdit}
                    onCancel={() => setEditTarget(null)}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Visible toggle */}
            {!t.archived && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toggleVisible(t.id)}>
                {t.visible ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Show</>}
              </Button>
            )}

            {/* Archive toggle */}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toggleArchive(t.id)}>
              <Archive className="w-3.5 h-3.5" />
              {t.archived ? "Unarchive" : "Archive"}
            </Button>

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Training?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{t.title}" and all its data including registrations. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteTraining(t.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = [
    { label: "Total Trainings", value: trainings.length, icon: GraduationCap, color: "text-[var(--church-primary)]" },
    { label: "Active / Visible", value: trainings.filter(t => t.visible && !t.archived).length, icon: Eye, color: "text-green-600" },
    { label: "Hidden", value: trainings.filter(t => !t.visible && !t.archived).length, icon: EyeOff, color: "text-yellow-600" },
    { label: "Archived", value: archived.length, icon: Archive, color: "text-gray-500" },
  ]

  return (
    <DashboardLayout variant="admin" title="Missions Training" description="Create and manage training programs visible on the website">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <Card key={i} className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--church-soft-gray)] flex items-center justify-center flex-shrink-0">
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">All Trainings</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2">
              <Plus className="w-4 h-4" /> Create Training
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Training</DialogTitle>
            </DialogHeader>
            <TrainingForm initial={emptyTraining()} onSave={handleCreate} onCancel={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archived.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {active.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-16 text-center text-muted-foreground">
                No active trainings. Click "Create Training" to add one.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {active.map(t => <TrainingCard key={t.id} t={t} />)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="archived">
          {archived.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-16 text-center text-muted-foreground">No archived trainings.</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {archived.map(t => <TrainingCard key={t.id} t={t} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
