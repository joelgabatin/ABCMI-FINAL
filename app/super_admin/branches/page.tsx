"use client"

import { useState } from "react"
import {
  MapPin, Plus, Edit, Trash2, Clock, Users, Church,
  Calendar, X, Check, User, UserCheck, UserX, Search,
  Eye, ChevronRight, Phone, Mail, Shield
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Pastor {
  id: number
  name: string
  role: string
  email: string
  phone: string
  branch: string
  status: "active" | "inactive"
  joinedYear: string
}

interface ServiceSchedule {
  id: number
  branchId: number
  day: string
  time: string
  type: string
  description: string
}

interface BranchMember {
  id: number
  name: string
  email: string
  phone: string
  joinedDate: string
  status: "active" | "pending" | "inactive"
  branchId: number
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

const initialPastors: Pastor[] = [
  { id: 1, name: "Ptr. Ysrael Coyoy", role: "Senior Pastor", email: "ysrael@abcmi.org", phone: "+63 912 345 6789", branch: "ABCMI Main Church", status: "active", joinedYear: "2001" },
  { id: 2, name: "Ptr. Fhey Coyoy", role: "Associate Pastor", email: "fhey@abcmi.org", phone: "+63 912 345 6790", branch: "ABCMI Main Church", status: "active", joinedYear: "2001" },
  { id: 3, name: "Ptr. Julio Coyoy", role: "Pastor", email: "julio@abcmi.org", phone: "+63 912 345 6791", branch: "Camp 8 Branch", status: "active", joinedYear: "2005" },
  { id: 4, name: "Ptr. Ernesto Paleyan", role: "Pastor", email: "ernesto@abcmi.org", phone: "+63 912 345 6792", branch: "San Carlos Branch", status: "active", joinedYear: "2008" },
  { id: 5, name: "Ptr. Domingo Coyoy", role: "Pastor", email: "domingo@abcmi.org", phone: "+63 912 345 6793", branch: "Kias Branch", status: "active", joinedYear: "2010" },
  { id: 6, name: "Ptr. Dionisio Balangyao", role: "Pastor", email: "dionisio@abcmi.org", phone: "+63 912 345 6794", branch: "Patiacan Branch", status: "active", joinedYear: "2012" },
  { id: 7, name: "Ptr. Elmo Salingbay", role: "Pastor", email: "elmo@abcmi.org", phone: "+63 912 345 6795", branch: "Villa Conchita Branch", status: "active", joinedYear: "2009" },
  { id: 8, name: "Ptr. Isidra Pait", role: "Pastora", email: "isidra@abcmi.org", phone: "+63 912 345 6796", branch: "Villa Conchita Branch", status: "active", joinedYear: "2009" },
  { id: 9, name: "Ptr. Josie Perilla-Cayto", role: "Pastora", email: "josie@abcmi.org", phone: "+63 912 345 6797", branch: "Villa Conchita Branch", status: "active", joinedYear: "2010" },
  { id: 10, name: "Ptr. Maria Fe Teneza", role: "Pastora", email: "mariafe@abcmi.org", phone: "+63 912 345 6798", branch: "Casacgudan Branch", status: "active", joinedYear: "2007" },
  { id: 11, name: "Ptr. Rolando Teneza", role: "Pastor", email: "rolando@abcmi.org", phone: "+63 912 345 6799", branch: "Casacgudan Branch", status: "active", joinedYear: "2007" },
  { id: 12, name: "Ptr. Gerry Teneza", role: "Pastor", email: "gerry@abcmi.org", phone: "+63 912 345 6800", branch: "Casacgudan Branch", status: "active", joinedYear: "2008" },
  { id: 13, name: "Ptr. Rosel Montero", role: "Pastora", email: "rosel@abcmi.org", phone: "+63 912 345 6801", branch: "San Juan Branch", status: "active", joinedYear: "2015" },
  { id: 14, name: "Ptr. Marvin Anno", role: "Pastor", email: "marvin@abcmi.org", phone: "+63 912 345 6802", branch: "Dianawan Branch", status: "active", joinedYear: "2013" },
  { id: 15, name: "Ptr. Mirriam Anno", role: "Pastora", email: "mirriam@abcmi.org", phone: "+63 912 345 6803", branch: "Dianawan Branch", status: "active", joinedYear: "2013" },
  { id: 16, name: "Ptr. Dacanay Isidre", role: "Pastor", email: "dacanay@abcmi.org", phone: "+63 912 345 6804", branch: "Lower Decoliat Branch", status: "active", joinedYear: "2016" },
  { id: 17, name: "Ptr. Frederick Dangilan", role: "Pastor", email: "frederick@abcmi.org", phone: "+63 912 345 6805", branch: "Dalic Branch", status: "active", joinedYear: "2011" },
  { id: 18, name: "Ptr. Divina Dangilan", role: "Pastora", email: "divina@abcmi.org", phone: "+63 912 345 6806", branch: "Dalic Branch", status: "active", joinedYear: "2011" },
  { id: 19, name: "Ptr. Billy Antero", role: "Pastor", email: "billy@abcmi.org", phone: "+63 912 345 6807", branch: "Ansagan Branch", status: "active", joinedYear: "2014" },
  { id: 20, name: "Ptr. Emannuel Marbella", role: "Pastor", email: "emannuel@abcmi.org", phone: "+63 912 345 6808", branch: "Vientiane Mission", status: "active", joinedYear: "2019" },
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

const initialMembers: BranchMember[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", phone: "+63 912 111 1111", joinedDate: "2024-01-15", status: "active", branchId: 1 },
  { id: 2, name: "Mark dela Cruz", email: "mark@example.com", phone: "+63 912 222 2222", joinedDate: "2024-02-10", status: "active", branchId: 1 },
  { id: 3, name: "Grace Reyes", email: "grace@example.com", phone: "+63 912 333 3333", joinedDate: "2024-03-05", status: "pending", branchId: 1 },
  { id: 4, name: "John Santos", email: "john@example.com", phone: "+63 912 444 4444", joinedDate: "2024-03-20", status: "pending", branchId: 1 },
  { id: 5, name: "Anna Bautista", email: "anna@example.com", phone: "+63 912 555 5555", joinedDate: "2024-01-20", status: "active", branchId: 2 },
  { id: 6, name: "Pedro Villanueva", email: "pedro@example.com", phone: "+63 912 666 6666", joinedDate: "2024-02-28", status: "pending", branchId: 2 },
  { id: 7, name: "Maria Garcia", email: "maria@example.com", phone: "+63 912 777 7777", joinedDate: "2024-01-10", status: "active", branchId: 3 },
  { id: 8, name: "Jose Fernandez", email: "jose@example.com", phone: "+63 912 888 8888", joinedDate: "2024-03-15", status: "pending", branchId: 3 },
  { id: 9, name: "Elena Ramos", email: "elena@example.com", phone: "+63 912 999 9999", joinedDate: "2024-02-05", status: "active", branchId: 4 },
  { id: 10, name: "Carlos Mendoza", email: "carlos@example.com", phone: "+63 912 000 0001", joinedDate: "2024-03-25", status: "pending", branchId: 5 },
]

const initialSchedules: ServiceSchedule[] = [
  { id: 1, branchId: 1, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Main worship service" },
  { id: 2, branchId: 1, day: "Wednesday", time: "7:00 PM", type: "Bible Study", description: "Midweek Bible study" },
  { id: 3, branchId: 1, day: "Friday", time: "6:00 PM", type: "Youth Fellowship", description: "Youth fellowship" },
  { id: 4, branchId: 2, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Morning worship" },
  { id: 5, branchId: 2, day: "Thursday", time: "6:30 PM", type: "Bible Study", description: "Weekly Bible study" },
  { id: 6, branchId: 3, day: "Sunday", time: "8:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 7, branchId: 4, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Sunday morning service" },
  { id: 8, branchId: 4, day: "Tuesday", time: "7:00 PM", type: "Prayer Meeting", description: "Corporate prayer" },
  { id: 9, branchId: 5, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Morning service" },
  { id: 10, branchId: 6, day: "Sunday", time: "8:00 AM", type: "Sunday Worship", description: "Early morning worship" },
  { id: 11, branchId: 6, day: "Friday", time: "7:00 PM", type: "Cell Group", description: "Home cell group" },
  { id: 12, branchId: 7, day: "Sunday", time: "9:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 13, branchId: 8, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Sunday service" },
  { id: 14, branchId: 9, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Morning worship" },
  { id: 15, branchId: 10, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Weekly service" },
  { id: 16, branchId: 11, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Sunday service" },
  { id: 17, branchId: 12, day: "Sunday", time: "8:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 18, branchId: 13, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "International service" },
]

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const serviceTypes = ["Sunday Worship", "Bible Study", "Prayer Meeting", "Youth Fellowship", "Cell Group", "Fasting Prayer", "Missions Meeting", "Other"]
const regions = ["CAR", "Region I", "Region II", "Region III", "International"]
const pastorRoles = ["Senior Pastor", "Associate Pastor", "Pastor", "Pastora", "District Pastor", "Mission Pastor"]
const emptyBranch: Omit<Branch, "id"> = { name: "", location: "", region: "CAR", pastorIds: [], status: "active", memberCount: 0, established: "" }
const emptySchedule: Omit<ServiceSchedule, "id"> = { branchId: 0, day: "Sunday", time: "", type: "Sunday Worship", description: "" }
const emptyPastor: Omit<Pastor, "id"> = { name: "", role: "Pastor", email: "", phone: "", branch: "", status: "active", joinedYear: "" }

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [schedules, setSchedules] = useState<ServiceSchedule[]>(initialSchedules)
  const [pastors, setPastors] = useState<Pastor[]>(initialPastors)
  const [members, setMembers] = useState<BranchMember[]>(initialMembers)

  // Branch
  const [branchDialog, setBranchDialog] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [branchForm, setBranchForm] = useState<Omit<Branch, "id">>(emptyBranch)
  const [deleteBranchId, setDeleteBranchId] = useState<number | null>(null)
  const [viewBranch, setViewBranch] = useState<Branch | null>(null)

  // Schedule
  const [scheduleDialog, setScheduleDialog] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ServiceSchedule | null>(null)
  const [scheduleForm, setScheduleForm] = useState<Omit<ServiceSchedule, "id">>(emptySchedule)
  const [deleteScheduleId, setDeleteScheduleId] = useState<number | null>(null)
  const [scheduleBranchFilter, setScheduleBranchFilter] = useState<number | "all">("all")

  // Pastor
  const [pastorDialog, setPastorDialog] = useState(false)
  const [editingPastor, setEditingPastor] = useState<Pastor | null>(null)
  const [pastorForm, setPastorForm] = useState<Omit<Pastor, "id">>(emptyPastor)
  const [deletePastorId, setDeletePastorId] = useState<number | null>(null)
  const [pastorSearch, setPastorSearch] = useState("")

  // Member
  const [memberSearch, setMemberSearch] = useState("")
  const [memberStatusFilter, setMemberStatusFilter] = useState<"all" | "active" | "pending">("all")

  // Branch helpers
  const openAddBranch = () => { setEditingBranch(null); setBranchForm(emptyBranch); setBranchDialog(true) }
  const openEditBranch = (b: Branch) => { setEditingBranch(b); setBranchForm({ name: b.name, location: b.location, region: b.region, pastorIds: b.pastorIds, status: b.status, memberCount: b.memberCount, established: b.established }); setBranchDialog(true) }
  const saveBranch = () => {
    if (editingBranch) setBranches(prev => prev.map(b => b.id === editingBranch.id ? { ...b, ...branchForm } : b))
    else setBranches(prev => [...prev, { id: Date.now(), ...branchForm }])
    setBranchDialog(false)
  }
  const deleteBranch = (id: number) => { setBranches(prev => prev.filter(b => b.id !== id)); setSchedules(prev => prev.filter(s => s.branchId !== id)); setDeleteBranchId(null) }
  const togglePastor = (pid: number) => setBranchForm(prev => ({ ...prev, pastorIds: prev.pastorIds.includes(pid) ? prev.pastorIds.filter(id => id !== pid) : [...prev.pastorIds, pid] }))

  // Schedule helpers
  const openAddSchedule = (branchId?: number) => { setEditingSchedule(null); setScheduleForm({ ...emptySchedule, branchId: branchId || 0 }); setScheduleDialog(true) }
  const openEditSchedule = (s: ServiceSchedule) => { setEditingSchedule(s); setScheduleForm({ branchId: s.branchId, day: s.day, time: s.time, type: s.type, description: s.description }); setScheduleDialog(true) }
  const saveSchedule = () => {
    if (editingSchedule) setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? { ...s, ...scheduleForm } : s))
    else setSchedules(prev => [...prev, { id: Date.now(), ...scheduleForm }])
    setScheduleDialog(false)
  }
  const deleteSchedule = (id: number) => { setSchedules(prev => prev.filter(s => s.id !== id)); setDeleteScheduleId(null) }

  // Pastor helpers
  const openAddPastor = () => { setEditingPastor(null); setPastorForm(emptyPastor); setPastorDialog(true) }
  const openEditPastor = (p: Pastor) => { setEditingPastor(p); setPastorForm({ name: p.name, role: p.role, email: p.email, phone: p.phone, branch: p.branch, status: p.status, joinedYear: p.joinedYear }); setPastorDialog(true) }
  const savePastor = () => {
    if (editingPastor) setPastors(prev => prev.map(p => p.id === editingPastor.id ? { ...p, ...pastorForm } : p))
    else setPastors(prev => [...prev, { id: Date.now(), ...pastorForm }])
    setPastorDialog(false)
  }
  const deletePastor = (id: number) => { setPastors(prev => prev.filter(p => p.id !== id)); setDeletePastorId(null) }

  // Member helpers
  const acceptMember = (id: number) => setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "active" } : m))
  const rejectMember = (id: number) => setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "inactive" } : m))

  const getPastorNames = (ids: number[]) => ids.map(id => pastors.find(p => p.id === id)?.name || "").filter(Boolean)
  const getBranchName = (id: number) => branches.find(b => b.id === id)?.name || "Unknown"
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  const filteredSchedules = scheduleBranchFilter === "all" ? schedules : schedules.filter(s => s.branchId === scheduleBranchFilter)
  const filteredPastors = pastors.filter(p => p.name.toLowerCase().includes(pastorSearch.toLowerCase()) || p.role.toLowerCase().includes(pastorSearch.toLowerCase()) || p.branch.toLowerCase().includes(pastorSearch.toLowerCase()))

  const branchMembers = viewBranch ? members.filter(m => m.branchId === viewBranch.id && (memberStatusFilter === "all" || m.status === memberStatusFilter)).filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase())) : []
  const pendingCount = viewBranch ? members.filter(m => m.branchId === viewBranch.id && m.status === "pending").length : 0

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
          <h1 className="text-3xl font-bold text-foreground">Branches, Pastors & Schedules</h1>
          <p className="text-muted-foreground mt-1">Manage branches, assign pastors, view members, and configure service schedules.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Branches", value: branches.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10", icon: Church },
            { label: "Total Pastors", value: pastors.length, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15", icon: Shield },
            { label: "Total Members", value: members.filter(m => m.status === "active").length, color: "text-emerald-600", bg: "bg-emerald-500/10", icon: Users },
            { label: "Pending Requests", value: members.filter(m => m.status === "pending").length, color: "text-rose-500", bg: "bg-rose-500/10", icon: UserCheck },
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
          <TabsList className="mb-6 flex flex-wrap gap-1">
            <TabsTrigger value="branches" className="gap-2"><Church className="w-4 h-4" /> Branches</TabsTrigger>
            <TabsTrigger value="pastors" className="gap-2"><Shield className="w-4 h-4" /> Pastors</TabsTrigger>
            <TabsTrigger value="schedules" className="gap-2"><Calendar className="w-4 h-4" /> Service Schedules</TabsTrigger>
          </TabsList>

          {/* BRANCHES TAB */}
          <TabsContent value="branches">
            {viewBranch ? (
              /* Branch Detail — Members */
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" onClick={() => { setViewBranch(null); setMemberSearch(""); setMemberStatusFilter("all") }} className="gap-2">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Branches
                  </Button>
                  <div className="h-5 w-px bg-border" />
                  <h2 className="text-xl font-semibold text-foreground">{viewBranch.name} — Members</h2>
                  {pendingCount > 0 && <Badge className="bg-rose-500 text-white">{pendingCount} pending</Badge>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search members..." className="pl-9" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} />
                  </div>
                  <Select value={memberStatusFilter} onValueChange={(v: "all" | "active" | "pending") => setMemberStatusFilter(v)}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Members</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {branchMembers.length === 0 ? (
                    <Card><CardContent className="p-12 text-center text-muted-foreground">No members found.</CardContent></Card>
                  ) : branchMembers.map(m => (
                    <Card key={m.id} className={m.status === "pending" ? "border-[var(--church-gold)]/40 bg-[var(--church-gold)]/5" : ""}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                            {getInitials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{m.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</span>
                            <span className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">Registered: {m.joinedDate}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {m.status === "pending" ? (
                            <>
                              <Badge variant="outline" className="border-[var(--church-gold)]/40 text-[var(--church-gold)] bg-[var(--church-gold)]/10">Pending</Badge>
                              <Button size="sm" className="gap-1 bg-emerald-500 hover:bg-emerald-600 text-white h-8" onClick={() => acceptMember(m.id)}>
                                <UserCheck className="w-3.5 h-3.5" /> Accept
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1 border-destructive text-destructive hover:bg-destructive/10 h-8" onClick={() => rejectMember(m.id)}>
                                <UserX className="w-3.5 h-3.5" /> Decline
                              </Button>
                            </>
                          ) : m.status === "active" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-muted-foreground">Declined</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              /* Branch List */
              <div>
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
                            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditBranch(branch)} title="Edit branch">
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteBranchId(branch.id)} title="Delete branch">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={branch.status === "active" ? "border-emerald-500/30 text-emerald-600" : "border-muted text-muted-foreground"}>{branch.status}</Badge>
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
                          ) : schedules.filter(s => s.branchId === branch.id).map(s => (
                            <div key={s.id} className="flex items-center gap-2 text-xs mb-1">
                              <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium">{s.day}</span>
                              <span className="text-muted-foreground">{s.time}</span>
                              <span className="text-muted-foreground truncate">— {s.type}</span>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full gap-2 mt-1" onClick={() => { setViewBranch(branch); setMemberSearch(""); setMemberStatusFilter("all") }}>
                          <Eye className="w-3.5 h-3.5" /> View Members
                          {members.filter(m => m.branchId === branch.id && m.status === "pending").length > 0 && (
                            <Badge className="ml-auto bg-rose-500 text-white text-xs px-1.5 py-0.5">
                              {members.filter(m => m.branchId === branch.id && m.status === "pending").length}
                            </Badge>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* PASTORS TAB */}
          <TabsContent value="pastors">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search pastors..." className="pl-9" value={pastorSearch} onChange={e => setPastorSearch(e.target.value)} />
              </div>
              <Button onClick={openAddPastor} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white w-full sm:w-auto">
                <Plus className="w-4 h-4" /> Add Pastor
              </Button>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPastors.map(pastor => (
                <Card key={pastor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-[var(--church-gold)]/20 text-[var(--church-gold)] font-semibold">
                            {getInitials(pastor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground text-sm leading-tight">{pastor.name}</p>
                          <p className="text-xs text-[var(--church-primary)] font-medium">{pastor.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditPastor(pastor)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeletePastorId(pastor.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2"><Church className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{pastor.branch}</span></div>
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{pastor.email}</span></div>
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 flex-shrink-0" /><span>{pastor.phone}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 flex-shrink-0" /><span>Joined {pastor.joinedYear}</span></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <Badge className={pastor.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground"}>
                        {pastor.status}
                      </Badge>
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
                <SelectTrigger className="w-64"><SelectValue placeholder="Filter by branch" /></SelectTrigger>
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
              ) : filteredSchedules.map(s => (
                <Card key={s.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[var(--church-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground text-sm">{s.day} — {s.time}</p>
                        <Badge className={`text-xs ${typeColor[s.type] || "bg-muted text-muted-foreground"}`}>{s.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{getBranchName(s.branchId)} &middot; {s.description}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEditSchedule(s)}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteScheduleId(s.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Branch Dialog */}
        <Dialog open={branchDialog} onOpenChange={setBranchDialog}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBranch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
              <DialogDescription>Fill in the branch details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Branch Name</Label>
                  <Input value={branchForm.name} onChange={e => setBranchForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. ABCMI Main Church" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Location / Address</Label>
                  <Input value={branchForm.location} onChange={e => setBranchForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. East Quirino Hill, Baguio City" />
                </div>
                <div className="space-y-1.5">
                  <Label>Region</Label>
                  <Select value={branchForm.region} onValueChange={v => setBranchForm(p => ({ ...p, region: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={branchForm.status} onValueChange={(v: "active" | "inactive") => setBranchForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Year Established</Label>
                  <Input value={branchForm.established} onChange={e => setBranchForm(p => ({ ...p, established: e.target.value }))} placeholder="e.g. 2001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign Pastors</Label>
                <div className="border border-border rounded-lg max-h-48 overflow-y-auto divide-y divide-border">
                  {pastors.map(p => (
                    <button key={p.id} type="button" onClick={() => togglePastor(p.id)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${branchForm.pastorIds.includes(p.id) ? "bg-[var(--church-primary)] border-[var(--church-primary)]" : "border-border"}`}>
                        {branchForm.pastorIds.includes(p.id) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setBranchDialog(false)}>Cancel</Button>
                <Button onClick={saveBranch} className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  {editingBranch ? "Save Changes" : "Add Branch"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pastor Dialog */}
        <Dialog open={pastorDialog} onOpenChange={setPastorDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPastor ? "Edit Pastor" : "Add New Pastor"}</DialogTitle>
              <DialogDescription>Fill in the pastor details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Full Name</Label>
                  <Input value={pastorForm.name} onChange={e => setPastorForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Ptr. Juan dela Cruz" />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={pastorForm.role} onValueChange={v => setPastorForm(p => ({ ...p, role: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{pastorRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={pastorForm.status} onValueChange={(v: "active" | "inactive") => setPastorForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={pastorForm.email} onChange={e => setPastorForm(p => ({ ...p, email: e.target.value }))} placeholder="pastor@abcmi.org" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={pastorForm.phone} onChange={e => setPastorForm(p => ({ ...p, phone: e.target.value }))} placeholder="+63 912 345 6789" />
                </div>
                <div className="space-y-1.5">
                  <Label>Year Joined</Label>
                  <Input value={pastorForm.joinedYear} onChange={e => setPastorForm(p => ({ ...p, joinedYear: e.target.value }))} placeholder="e.g. 2010" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Assigned Branch</Label>
                  <Select value={pastorForm.branch} onValueChange={v => setPastorForm(p => ({ ...p, branch: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setPastorDialog(false)}>Cancel</Button>
                <Button onClick={savePastor} className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  {editingPastor ? "Save Changes" : "Add Pastor"}
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
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Branch</Label>
                <Select value={scheduleForm.branchId ? String(scheduleForm.branchId) : ""} onValueChange={v => setScheduleForm(p => ({ ...p, branchId: Number(v) }))}>
                  <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>{branches.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Day</Label>
                  <Select value={scheduleForm.day} onValueChange={v => setScheduleForm(p => ({ ...p, day: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Input value={scheduleForm.time} onChange={e => setScheduleForm(p => ({ ...p, time: e.target.value }))} placeholder="e.g. 9:00 AM" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Service Type</Label>
                <Select value={scheduleForm.type} onValueChange={v => setScheduleForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{serviceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={scheduleForm.description} onChange={e => setScheduleForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the service..." rows={2} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setScheduleDialog(false)}>Cancel</Button>
                <Button onClick={saveSchedule} className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  {editingSchedule ? "Save Changes" : "Add Schedule"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Branch Confirm */}
        <AlertDialog open={deleteBranchId !== null} onOpenChange={() => setDeleteBranchId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Branch?</AlertDialogTitle>
              <AlertDialogDescription>This will also remove all service schedules for this branch. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteBranchId && deleteBranch(deleteBranchId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Pastor Confirm */}
        <AlertDialog open={deletePastorId !== null} onOpenChange={() => setDeletePastorId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Pastor?</AlertDialogTitle>
              <AlertDialogDescription>This will remove the pastor record from the system. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deletePastorId && deletePastor(deletePastorId)}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Schedule Confirm */}
        <AlertDialog open={deleteScheduleId !== null} onOpenChange={() => setDeleteScheduleId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Schedule?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this service schedule.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteScheduleId && deleteSchedule(deleteScheduleId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
