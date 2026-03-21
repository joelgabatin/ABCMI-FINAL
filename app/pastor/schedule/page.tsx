"use client"

import { useState } from "react"
import { Clock, Calendar, MapPin, Plus, Edit, Trash2, Users, Church } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Schedule {
  id: number
  day: string
  time: string
  type: string
  description: string
  location: string
  leader: string
  attendees: number
}

const initialSchedules: Schedule[] = [
  { id: 1, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Main morning worship service for all members and visitors.", location: "Camp 8 Hall", leader: "Ptr. Julio Coyoy", attendees: 64 },
  { id: 2, day: "Thursday", time: "6:30 PM", type: "Bible Study", description: "Weekly midweek Bible study for all interested members.", location: "Camp 8 Hall", leader: "Ptr. Julio Coyoy", attendees: 28 },
  { id: 3, day: "Saturday", time: "5:00 PM", type: "Youth Fellowship", description: "Weekly gathering for the youth group with worship and discussion.", location: "Camp 8 Hall", leader: "Youth Leader", attendees: 18 },
  { id: 4, day: "Tuesday", time: "6:00 PM", type: "Prayer Meeting", description: "Corporate prayer and intercession for the branch and community.", location: "Camp 8 Hall", leader: "Ptr. Julio Coyoy", attendees: 15 },
]

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const serviceTypes = ["Sunday Worship", "Bible Study", "Prayer Meeting", "Youth Fellowship", "Cell Group", "Fasting Prayer", "Missions Meeting", "Other"]
const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const emptySchedule: Omit<Schedule, "id"> = {
  day: "Sunday", time: "", type: "Sunday Worship", description: "", location: "Camp 8 Hall", leader: "Ptr. Julio Coyoy", attendees: 0
}

const typeColor: Record<string, string> = {
  "Sunday Worship": "bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20",
  "Bible Study": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Prayer Meeting": "bg-rose-500/10 text-rose-600 border-rose-500/20",
  "Youth Fellowship": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "Cell Group": "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30",
  "Fasting Prayer": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "Missions Meeting": "bg-blue-500/10 text-blue-600 border-blue-500/20",
}

export default function PastorSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)
  const [dialog, setDialog] = useState(false)
  const [editing, setEditing] = useState<Schedule | null>(null)
  const [form, setForm] = useState<Omit<Schedule, "id">>(emptySchedule)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptySchedule); setDialog(true) }
  const openEdit = (s: Schedule) => {
    setEditing(s)
    setForm({ day: s.day, time: s.time, type: s.type, description: s.description, location: s.location, leader: s.leader, attendees: s.attendees })
    setDialog(true)
  }
  const save = () => {
    if (editing) setSchedules(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s))
    else setSchedules(prev => [...prev, { id: Date.now(), ...form }])
    setDialog(false)
  }
  const deleteSchedule = (id: number) => { setSchedules(prev => prev.filter(s => s.id !== id)); setDeleteId(null) }

  const sorted = [...schedules].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))

  return (
    <DashboardLayout variant="pastor">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service Schedule</h1>
            <p className="text-muted-foreground mt-1">Manage your branch's weekly service and activity schedules.</p>
          </div>
          <Button onClick={openAdd} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white flex-shrink-0">
            <Plus className="w-4 h-4" /> Add Schedule
          </Button>
        </div>

        {/* Branch Banner */}
        <Card className="mb-6 bg-[var(--church-primary)]/5 border-[var(--church-primary)]/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
              <Church className="w-5 h-5 text-[var(--church-primary)]" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Camp 8 Branch</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Camp 8, Baguio City</p>
            </div>
            <div className="ml-auto flex gap-6 text-center hidden sm:flex">
              <div>
                <p className="text-xl font-bold text-[var(--church-primary)]">{schedules.length}</p>
                <p className="text-xs text-muted-foreground">Schedules</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-600">{schedules.reduce((s, r) => s + r.attendees, 0)}</p>
                <p className="text-xs text-muted-foreground">Avg. Weekly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats by day */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Services/Week", value: schedules.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
            { label: "Avg. Sunday Attendance", value: schedules.find(s => s.type === "Sunday Worship")?.attendees || 0, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Bible Study Groups", value: schedules.filter(s => s.type === "Bible Study").length, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15" },
            { label: "Prayer Sessions/Week", value: schedules.filter(s => s.type === "Prayer Meeting" || s.type === "Fasting Prayer").length, color: "text-rose-500", bg: "bg-rose-500/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${typeColor[s.type] || "bg-muted text-muted-foreground"}`}>{s.type}</Badge>
                    </div>
                    <CardTitle className="text-base">{s.day}</CardTitle>
                    <p className="text-sm text-[var(--church-primary)] font-semibold">{s.time}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(s)}><Edit className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(s.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 text-sm">
                <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                <div className="space-y-1 pt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{s.location}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />Led by: {s.leader}</div>
                  <div className="flex items-center gap-1.5"><Users className="w-3 h-3" />Avg. attendance: <span className="text-foreground font-medium">{s.attendees}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
          {schedules.length === 0 && (
            <div className="col-span-full">
              <Card><CardContent className="p-12 text-center text-muted-foreground">No schedules yet. Click "Add Schedule" to get started.</CardContent></Card>
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Schedule" : "Add Service Schedule"}</DialogTitle>
              <DialogDescription>Fill in the service or activity details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Day</Label>
                  <Select value={form.day} onValueChange={v => setForm(p => ({ ...p, day: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} placeholder="e.g. 9:00 AM" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Service Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{serviceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Camp 8 Hall" />
              </div>
              <div className="space-y-1.5">
                <Label>Led By</Label>
                <Input value={form.leader} onChange={e => setForm(p => ({ ...p, leader: e.target.value }))} placeholder="e.g. Ptr. Julio Coyoy" />
              </div>
              <div className="space-y-1.5">
                <Label>Avg. Attendance</Label>
                <Input type="number" value={form.attendees} onChange={e => setForm(p => ({ ...p, attendees: Number(e.target.value) }))} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of this service or activity..." />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={save} disabled={!form.day || !form.time || !form.type}>
                  {editing ? "Save Changes" : "Add Schedule"}
                </Button>
                <Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Schedule?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this service schedule from your branch.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={() => deleteId && deleteSchedule(deleteId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
