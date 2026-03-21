"use client"

import { useState } from "react"
import {
  MapPin, Plus, Edit, Trash2, Clock, Users, Church,
  Calendar, ChevronDown, X, Check, User
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Pastor {
  id: number
  name: string
  role: string
}

interface ServiceSchedule {
  id: number
  branchId: number
  day: string
  time: string
  type: string
  description: string
}

interface Branch {
  id: number
  name: string
  location: string
  region: string
  pastorIds: number[]
  status: "active" | "inactive"
  memberCount: number
  established: string
}

const allPastors: Pastor[] = [
  { id: 1, name: "Ptr. Ysrael Coyoy", role: "Senior Pastor" },
  { id: 2, name: "Ptr. Fhey Coyoy", role: "Associate Pastor" },
  { id: 3, name: "Ptr. Julio Coyoy", role: "Pastor" },
  { id: 4, name: "Ptr. Ernesto Paleyan", role: "Pastor" },
  { id: 5, name: "Ptr. Domingo Coyoy", role: "Pastor" },
  { id: 6, name: "Ptr. Dionisio Balangyao", role: "Pastor" },
  { id: 7, name: "Ptr. Elmo Salingbay", role: "Pastor" },
  { id: 8, name: "Ptr. Isidra Pait", role: "Pastora" },
  { id: 9, name: "Ptr. Josie Perilla-Cayto", role: "Pastora" },
  { id: 10, name: "Ptr. Maria Fe Teneza", role: "Pastora" },
  { id: 11, name: "Ptr. Rolando Teneza", role: "Pastor" },
  { id: 12, name: "Ptr. Gerry Teneza", role: "Pastor" },
  { id: 13, name: "Ptr. Rosel Montero", role: "Pastora" },
  { id: 14, name: "Ptr. Marvin Anno", role: "Pastor" },
  { id: 15, name: "Ptr. Mirriam Anno", role: "Pastora" },
  { id: 16, name: "Ptr. Dacanay Isidre", role: "Pastor" },
  { id: 17, name: "Ptr. Frederick Dangilan", role: "Pastor" },
  { id: 18, name: "Ptr. Divina Dangilan", role: "Pastora" },
  { id: 19, name: "Ptr. Billy Antero", role: "Pastor" },
  { id: 20, name: "Ptr. Emannuel Marbella", role: "Pastor" },
]

const initialBranches: Branch[] = [
  { id: 1, name: "ABCMI Main Church", location: "East Quirino Hill, Baguio City", region: "CAR", pastorIds: [1, 2], status: "active", memberCount: 245, established: "2001" },
  { id: 2, name: "Camp 8 Branch", location: "Camp 8, Baguio City", region: "CAR", pastorIds: [3], status: "active", memberCount: 87, established: "2005" },
  { id: 3, name: "San Carlos Branch", location: "San Carlos, Baguio City", region: "CAR", pastorIds: [4], status: "active", memberCount: 64, established: "2008" },
  { id: 4, name: "Kias Branch", location: "Kias, Baguio City", region: "CAR", pastorIds: [5], status: "active", memberCount: 53, established: "2010" },
  { id: 5, name: "Patiacan Branch", location: "Patiacan, Quirino, Ilocos Sur", region: "Region I", pastorIds: [6], status: "active", memberCount: 41, established: "2012" },
  { id: 6, name: "Villa Conchita Branch", location: "Villa Conchita, Manabo, Abra", region: "CAR", pastorIds: [7, 8, 9], status: "active", memberCount: 78, established: "2009" },
  { id: 7, name: "Casacgudan Branch", location: "Casacgudan, Manabo, Abra", region: "CAR", pastorIds: [10, 11, 12], status: "active", memberCount: 92, established: "2007" },
  { id: 8, name: "San Juan Branch", location: "San Juan, Abra", region: "CAR", pastorIds: [13], status: "active", memberCount: 35, established: "2015" },
  { id: 9, name: "Dianawan Branch", location: "Dianawan, Maria Aurora, Aurora", region: "Region III", pastorIds: [14, 15], status: "active", memberCount: 48, established: "2013" },
  { id: 10, name: "Lower Decoliat Branch", location: "Lower Decoliat, Alfonso Castaneda, Nueva Vizcaya", region: "Region II", pastorIds: [16], status: "active", memberCount: 31, established: "2016" },
  { id: 11, name: "Dalic Branch", location: "Dalic, Bontoc, Mt. Province", region: "CAR", pastorIds: [17, 18], status: "active", memberCount: 56, established: "2011" },
  { id: 12, name: "Ansagan Branch", location: "Ansagan, Tuba, Benguet", region: "CAR", pastorIds: [19], status: "active", memberCount: 44, established: "2014" },
  { id: 13, name: "Vientiane Mission", location: "Vientiane, Laos", region: "International", pastorIds: [20], status: "active", memberCount: 22, established: "2019" },
]

const initialSchedules: ServiceSchedule[] = [
  { id: 1, branchId: 1, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Main worship service with praise and sermon" },
  { id: 2, branchId: 1, day: "Wednesday", time: "7:00 PM", type: "Bible Study", description: "Midweek Bible study and prayer meeting" },
  { id: 3, branchId: 1, day: "Friday", time: "6:00 PM", type: "Youth Fellowship", description: "Youth praise and fellowship" },
  { id: 4, branchId: 2, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Morning worship service" },
  { id: 5, branchId: 2, day: "Thursday", time: "6:30 PM", type: "Bible Study", description: "Weekly Bible study" },
  { id: 6, branchId: 3, day: "Sunday", time: "8:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 7, branchId: 4, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Sunday morning service" },
  { id: 8, branchId: 4, day: "Tuesday", time: "7:00 PM", type: "Prayer Meeting", description: "Corporate prayer and intercession" },
  { id: 9, branchId: 5, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Morning service" },
  { id: 10, branchId: 6, day: "Sunday", time: "8:00 AM", type: "Sunday Worship", description: "Early morning worship" },
  { id: 11, branchId: 6, day: "Friday", time: "7:00 PM", type: "Cell Group", description: "Home cell group meetings" },
  { id: 12, branchId: 7, day: "Sunday", time: "9:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 13, branchId: 8, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Sunday service" },
  { id: 14, branchId: 9, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Morning worship" },
  { id: 15, branchId: 10, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Weekly service" },
  { id: 16, branchId: 11, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Sunday service" },
  { id: 17, branchId: 12, day: "Sunday", time: "8:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 18, branchId: 13, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "International mission service" },
]

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const serviceTypes = ["Sunday Worship", "Bible Study", "Prayer Meeting", "Youth Fellowship", "Cell Group", "Fasting Prayer", "Missions Meeting", "Other"]
const regions = ["CAR", "Region I", "Region II", "Region III", "International"]

const emptyBranch: Omit<Branch, "id"> = { name: "", location: "", region: "CAR", pastorIds: [], status: "active", memberCount: 0, established: "" }
const emptySchedule: Omit<ServiceSchedule, "id"> = { branchId: 0, day: "Sunday", time: "", type: "Sunday Worship", description: "" }

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [schedules, setSchedules] = useState<ServiceSchedule[]>(initialSchedules)

  // Branch dialog
  const [branchDialog, setBranchDialog] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [branchForm, setBranchForm] = useState<Omit<Branch, "id">>(emptyBranch)
  const [deleteBranchId, setDeleteBranchId] = useState<number | null>(null)

  // Schedule dialog
  const [scheduleDialog, setScheduleDialog] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ServiceSchedule | null>(null)
  const [scheduleForm, setScheduleForm] = useState<Omit<ServiceSchedule, "id">>(emptySchedule)
  const [deleteScheduleId, setDeleteScheduleId] = useState<number | null>(null)
  const [scheduleBranchFilter, setScheduleBranchFilter] = useState<number | "all">("all")

  // Helpers
  const openAddBranch = () => { setEditingBranch(null); setBranchForm(emptyBranch); setBranchDialog(true) }
  const openEditBranch = (b: Branch) => { setEditingBranch(b); setBranchForm({ name: b.name, location: b.location, region: b.region, pastorIds: b.pastorIds, status: b.status, memberCount: b.memberCount, established: b.established }); setBranchDialog(true) }

  const saveBranch = () => {
    if (editingBranch) {
      setBranches(prev => prev.map(b => b.id === editingBranch.id ? { ...b, ...branchForm } : b))
    } else {
      setBranches(prev => [...prev, { id: Date.now(), ...branchForm }])
    }
    setBranchDialog(false)
  }

  const deleteBranch = (id: number) => {
    setBranches(prev => prev.filter(b => b.id !== id))
    setSchedules(prev => prev.filter(s => s.branchId !== id))
    setDeleteBranchId(null)
  }

  const togglePastor = (pastorId: number) => {
    setBranchForm(prev => ({
      ...prev,
      pastorIds: prev.pastorIds.includes(pastorId)
        ? prev.pastorIds.filter(id => id !== pastorId)
        : [...prev.pastorIds, pastorId]
    }))
  }

  const openAddSchedule = (branchId?: number) => {
    setEditingSchedule(null)
    setScheduleForm({ ...emptySchedule, branchId: branchId || 0 })
    setScheduleDialog(true)
  }
  const openEditSchedule = (s: ServiceSchedule) => { setEditingSchedule(s); setScheduleForm({ branchId: s.branchId, day: s.day, time: s.time, type: s.type, description: s.description }); setScheduleDialog(true) }

  const saveSchedule = () => {
    if (editingSchedule) {
      setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? { ...s, ...scheduleForm } : s))
    } else {
      setSchedules(prev => [...prev, { id: Date.now(), ...scheduleForm }])
    }
    setScheduleDialog(false)
  }

  const deleteSchedule = (id: number) => { setSchedules(prev => prev.filter(s => s.id !== id)); setDeleteScheduleId(null) }

  const getPastorNames = (ids: number[]) => ids.map(id => allPastors.find(p => p.id === id)?.name || "").filter(Boolean)
  const getBranchName = (id: number) => branches.find(b => b.id === id)?.name || "Unknown"

  const filteredSchedules = scheduleBranchFilter === "all"
    ? schedules
    : schedules.filter(s => s.branchId === scheduleBranchFilter)

  const typeColor: Record<string, string> = {
    "Sunday Worship": "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
    "Bible Study": "bg-emerald-500/10 text-emerald-600",
    "Prayer Meeting": "bg-rose-500/10 text-rose-600",
    "Youth Fellowship": "bg-orange-500/10 text-orange-600",
    "Cell Group": "bg-[var(--church-gold)]/15 text-[var(--church-gold)]",
    "Fasting Prayer": "bg-purple-500/10 text-purple-600",
    "Missions Meeting": "bg-blue-500/10 text-blue-600",
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Branches & Service Schedules</h1>
          <p className="text-muted-foreground mt-1">
            Manage church branches, assign pastors, and configure service schedules.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Branches", value: branches.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10", icon: Church },
            { label: "Active Branches", value: branches.filter(b => b.status === "active").length, color: "text-emerald-600", bg: "bg-emerald-500/10", icon: Check },
            { label: "Total Members", value: branches.reduce((s, b) => s + b.memberCount, 0), color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15", icon: Users },
            { label: "Service Schedules", value: schedules.length, color: "text-rose-500", bg: "bg-rose-500/10", icon: Calendar },
          ].map(s => (
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

        <Tabs defaultValue="branches">
          <TabsList className="mb-6">
            <TabsTrigger value="branches" className="gap-2"><Church className="w-4 h-4" /> Branches</TabsTrigger>
            <TabsTrigger value="schedules" className="gap-2"><Calendar className="w-4 h-4" /> Service Schedules</TabsTrigger>
          </TabsList>

          {/* BRANCHES TAB */}
          <TabsContent value="branches">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{branches.length} branches across all regions</p>
              <Button onClick={openAddBranch} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" /> Add Branch
              </Button>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {branches.map(branch => (
                <Card key={branch.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                          <Church className="w-5 h-5 text-[var(--church-primary)]" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm leading-tight">{branch.name}</CardTitle>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs text-muted-foreground truncate">{branch.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditBranch(branch)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteBranchId(branch.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={branch.status === "active" ? "border-emerald-500/30 text-emerald-600" : "border-muted text-muted-foreground"}>
                        {branch.status}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{branch.region}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">Est. {branch.established}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-xs">{branch.memberCount} members</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pastors</p>
                      {getPastorNames(branch.pastorIds).map(name => (
                        <div key={name} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center">
                            <User className="w-3 h-3 text-[var(--church-gold)]" />
                          </div>
                          <span className="text-xs text-foreground">{name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Schedules</p>
                      {schedules.filter(s => s.branchId === branch.id).length === 0 ? (
                        <p className="text-xs text-muted-foreground">No schedules added</p>
                      ) : (
                        schedules.filter(s => s.branchId === branch.id).map(s => (
                          <div key={s.id} className="flex items-center gap-2 text-xs mb-1">
                            <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">{s.day}</span>
                            <span className="text-muted-foreground">{s.time}</span>
                            <span className="text-muted-foreground truncate">— {s.type}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SCHEDULES TAB */}
          <TabsContent value="schedules">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <Select value={scheduleBranchFilter === "all" ? "all" : String(scheduleBranchFilter)} onValueChange={v => setScheduleBranchFilter(v === "all" ? "all" : Number(v))}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => openAddSchedule()} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" /> Add Schedule
              </Button>
            </div>

            <div className="space-y-3">
              {filteredSchedules.length === 0 ? (
                <Card><CardContent className="p-12 text-center text-muted-foreground">No schedules found.</CardContent></Card>
              ) : (
                filteredSchedules.map(s => (
                  <Card key={s.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[var(--church-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-sm text-foreground">{s.day} — {s.time}</p>
                          <Badge variant="secondary" className={`text-xs ${typeColor[s.type] || "bg-muted text-muted-foreground"}`}>
                            {s.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{getBranchName(s.branchId)}</p>
                        {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEditSchedule(s)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteScheduleId(s.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Branch Dialog */}
        <Dialog open={branchDialog} onOpenChange={setBranchDialog}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBranch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
              <DialogDescription>Fill in the branch details and assign pastors.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-2">
                  <Label>Branch Name</Label>
                  <Input placeholder="e.g. Main Church" value={branchForm.name} onChange={e => setBranchForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Location / Address</Label>
                  <Input placeholder="e.g. East Quirino Hill, Baguio City" value={branchForm.location} onChange={e => setBranchForm(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={branchForm.region} onValueChange={v => setBranchForm(p => ({ ...p, region: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year Established</Label>
                  <Input placeholder="e.g. 2001" value={branchForm.established} onChange={e => setBranchForm(p => ({ ...p, established: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Member Count</Label>
                  <Input type="number" value={branchForm.memberCount} onChange={e => setBranchForm(p => ({ ...p, memberCount: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={branchForm.status} onValueChange={v => setBranchForm(p => ({ ...p, status: v as "active" | "inactive" }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assigned Pastors</Label>
                <div className="border border-border rounded-lg p-3 max-h-48 overflow-y-auto space-y-1">
                  {allPastors.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-1.5 rounded hover:bg-muted/50 cursor-pointer" onClick={() => togglePastor(p.id)}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${branchForm.pastorIds.includes(p.id) ? "bg-[var(--church-primary)] border-[var(--church-primary)]" : "border-border"}`}>
                        {branchForm.pastorIds.includes(p.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-foreground">{p.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{p.role}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setBranchDialog(false)}>Cancel</Button>
                <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={saveBranch} disabled={!branchForm.name || !branchForm.location}>
                  {editingBranch ? "Save Changes" : "Add Branch"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Dialog */}
        <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add Service Schedule"}</DialogTitle>
              <DialogDescription>Set the day, time, and service type.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={scheduleForm.branchId ? String(scheduleForm.branchId) : ""} onValueChange={v => setScheduleForm(p => ({ ...p, branchId: Number(v) }))}>
                  <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>{branches.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select value={scheduleForm.day} onValueChange={v => setScheduleForm(p => ({ ...p, day: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input placeholder="e.g. 9:00 AM" value={scheduleForm.time} onChange={e => setScheduleForm(p => ({ ...p, time: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select value={scheduleForm.type} onValueChange={v => setScheduleForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{serviceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Input placeholder="Brief description of the service" value={scheduleForm.description} onChange={e => setScheduleForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setScheduleDialog(false)}>Cancel</Button>
                <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={saveSchedule} disabled={!scheduleForm.branchId || !scheduleForm.time}>
                  {editingSchedule ? "Save Changes" : "Add Schedule"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Branch Confirm */}
        <AlertDialog open={deleteBranchId !== null} onOpenChange={open => !open && setDeleteBranchId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this branch?</AlertDialogTitle>
              <AlertDialogDescription>This will also remove all service schedules for this branch. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={() => deleteBranchId !== null && deleteBranch(deleteBranchId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Schedule Confirm */}
        <AlertDialog open={deleteScheduleId !== null} onOpenChange={open => !open && setDeleteScheduleId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this schedule?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={() => deleteScheduleId !== null && deleteSchedule(deleteScheduleId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
