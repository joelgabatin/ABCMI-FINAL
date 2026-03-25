"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  MapPin, Plus, Edit, Trash2, Clock, Users, Church,
  Calendar, X, Check, User, UserCheck, UserX, Search,
  Eye, ChevronRight, Phone, Mail, Shield, UserPlus, RefreshCw,
  Settings, Tag, ExternalLink, Map,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// ── Types ──────────────────────────────────────────────────────────────────
interface Branch {
  id: number
  name: string
  location: string
  region_id: number
  status: "active" | "inactive"
  member_count: number
  established: string
  maps_url: string | null
}

interface Pastor {
  id: number
  name: string
  role: string
  email: string
  phone: string
  branch_id: number | null
  status: "active" | "inactive"
  joined_year: string
}

interface ServiceSchedule {
  id: number
  branch_id: number
  day: string
  time: string
  type: string
  description: string
}

interface BranchMember {
  id: number
  branch_id: number
  profile_id: string | null
  name: string
  email: string
  phone: string
  joined_date: string
  status: "active" | "pending" | "inactive"
}

interface Region {
  id: number
  name: string
}

// ── Constants ──────────────────────────────────────────────────────────────
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const serviceTypes = ["Sunday Worship", "Bible Study", "Prayer Meeting", "Youth Fellowship", "Cell Group", "Fasting Prayer", "Missions Meeting", "Other"]
const pastorRoles = ["Senior Pastor", "Associate Pastor", "Pastor", "Pastora", "District Pastor", "Mission Pastor"]

const emptyBranch: Omit<Branch, "id"> = { name: "", location: "", region_id: 0, status: "active", member_count: 0, established: "", maps_url: "" }
const emptySchedule: Omit<ServiceSchedule, "id"> = { branch_id: 0, day: "Sunday", time: "", type: "Sunday Worship", description: "" }
const emptyPastor: Omit<Pastor, "id"> = { name: "", role: "Pastor", email: "", phone: "", branch_id: null, status: "active", joined_year: "" }

const typeColor: Record<string, string> = {
  "Sunday Worship":  "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  "Bible Study":     "bg-emerald-500/10 text-emerald-600",
  "Prayer Meeting":  "bg-rose-500/10 text-rose-600",
  "Youth Fellowship":"bg-orange-500/10 text-orange-600",
  "Cell Group":      "bg-[var(--church-gold)]/15 text-[var(--church-gold)]",
  "Fasting Prayer":  "bg-purple-500/10 text-purple-600",
  "Missions Meeting":"bg-blue-500/10 text-blue-600",
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function AdminBranchesPage() {
  return (
    <Suspense>
      <BranchesPageInner />
    </Suspense>
  )
}

function BranchesPageInner() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "branches"

  const [branches, setBranches]   = useState<Branch[]>([])
  const [pastors, setPastors]     = useState<Pastor[]>([])
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([])
  const [members, setMembers]     = useState<BranchMember[]>([])
  const [regions, setRegions]     = useState<Region[]>([])
  const [loading, setLoading]     = useState(true)

  // Branch UI state
  const [branchDialog, setBranchDialog]       = useState(false)
  const [editingBranch, setEditingBranch]     = useState<Branch | null>(null)
  const [branchForm, setBranchForm]           = useState<Omit<Branch, "id">>(emptyBranch)
  const [deleteBranchId, setDeleteBranchId]   = useState<number | null>(null)
  const [viewBranch, setViewBranch]           = useState<Branch | null>(null)

  // Schedule UI state
  const [scheduleDialog, setScheduleDialog]       = useState(false)
  const [editingSchedule, setEditingSchedule]     = useState<ServiceSchedule | null>(null)
  const [scheduleForm, setScheduleForm]           = useState<Omit<ServiceSchedule, "id">>(emptySchedule)
  const [deleteScheduleId, setDeleteScheduleId]   = useState<number | null>(null)
  const [scheduleBranchFilter, setScheduleBranchFilter] = useState<number | "all">("all")

  // Pastor UI state
  const [pastorDialog, setPastorDialog]     = useState(false)
  const [editingPastor, setEditingPastor]   = useState<Pastor | null>(null)
  const [pastorForm, setPastorForm]         = useState<Omit<Pastor, "id">>(emptyPastor)
  const [deletePastorId, setDeletePastorId] = useState<number | null>(null)
  const [pastorSearch, setPastorSearch]     = useState("")

  // Assign member as pastor
  const [assignDialog, setAssignDialog]      = useState(false)
  const [assignQuery, setAssignQuery]        = useState("")
  const [selectedMember, setSelectedMember] = useState<BranchMember | null>(null)
  const [assignRole, setAssignRole]          = useState("Pastor")
  const [assignBranchId, setAssignBranchId] = useState<number | "">("")

  // Member view state
  const [memberSearch, setMemberSearch]             = useState("")
  const [memberStatusFilter, setMemberStatusFilter] = useState<"all" | "active" | "pending">("all")

  // Region UI state
  const [regionDialog, setRegionDialog]     = useState(false)
  const [editingRegion, setEditingRegion]   = useState<Region | null>(null)
  const [regionName, setRegionName]         = useState("")
  const [deleteRegionId, setDeleteRegionId] = useState<number | null>(null)

  // ── Fetch all data ──────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [b, p, s, m, r] = await Promise.all([
      supabase.from("branches").select("*").order("id"),
      supabase.from("pastors").select("*").order("id"),
      supabase.from("service_schedules").select("*").order("id"),
      supabase.from("branch_members").select("*").order("id"),
      supabase.from("regions").select("*").order("id"),
    ])
    if (b.error) console.error("branches error:", b.error)
    if (p.error) console.error("pastors error:", p.error)
    if (s.error) console.error("schedules error:", s.error)
    if (m.error) console.error("members error:", m.error)
    if (r.error) console.error("regions error:", r.error)
    if (b.data) setBranches(b.data as Branch[])
    if (p.data) setPastors(p.data as Pastor[])
    if (s.data) setSchedules(s.data as ServiceSchedule[])
    if (m.data) setMembers(m.data as BranchMember[])
    if (r.data) setRegions(r.data as Region[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Branch helpers ──────────────────────────────────────────────────────
  const openAddBranch  = () => {
    setEditingBranch(null)
    setBranchForm({ ...emptyBranch, region_id: regions[0]?.id || 0 })
    setBranchDialog(true)
  }
  const openEditBranch = (b: Branch) => {
    setEditingBranch(b)
    setBranchForm({ name: b.name, location: b.location, region_id: b.region_id, status: b.status, member_count: b.member_count, established: b.established, maps_url: b.maps_url ?? "" })
    setBranchDialog(true)
  }

  const saveBranch = async () => {
    const payload = { ...branchForm, maps_url: branchForm.maps_url?.trim() || null }
    if (editingBranch) {
      const { error } = await supabase.from("branches").update(payload).eq("id", editingBranch.id)
      if (error) { toast.error("Failed to update branch."); return }
      setBranches(prev => prev.map(b => b.id === editingBranch.id ? { ...b, ...payload } : b))
    } else {
      const { data, error } = await supabase.from("branches").insert(payload).select().single()
      if (error) { toast.error("Failed to add branch."); return }
      setBranches(prev => [...prev, data as Branch])
    }
    toast.success(editingBranch ? "Branch updated." : "Branch added.")
    setBranchDialog(false)
  }

  const deleteBranch = async (id: number) => {
    const { error } = await supabase.from("branches").delete().eq("id", id)
    if (error) { toast.error("Failed to delete branch."); return }
    setBranches(prev => prev.filter(b => b.id !== id))
    setSchedules(prev => prev.filter(s => s.branch_id !== id))
    setDeleteBranchId(null)
    toast.success("Branch deleted.")
  }

  // ── Schedule helpers ────────────────────────────────────────────────────
  const openAddSchedule  = (branch_id?: number) => {
    setEditingSchedule(null)
    setScheduleForm({ ...emptySchedule, branch_id: branch_id || 0 })
    setScheduleDialog(true)
  }
  const openEditSchedule = (s: ServiceSchedule) => {
    setEditingSchedule(s)
    setScheduleForm({ branch_id: s.branch_id, day: s.day, time: s.time, type: s.type, description: s.description })
    setScheduleDialog(true)
  }

  const saveSchedule = async () => {
    if (editingSchedule) {
      const { error } = await supabase.from("service_schedules").update(scheduleForm).eq("id", editingSchedule.id)
      if (error) { toast.error("Failed to update schedule."); return }
      setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? { ...s, ...scheduleForm } : s))
    } else {
      const { data, error } = await supabase.from("service_schedules").insert(scheduleForm).select().single()
      if (error) { toast.error("Failed to add schedule."); return }
      setSchedules(prev => [...prev, data as ServiceSchedule])
    }
    toast.success(editingSchedule ? "Schedule updated." : "Schedule added.")
    setScheduleDialog(false)
  }

  const deleteSchedule = async (id: number) => {
    const { error } = await supabase.from("service_schedules").delete().eq("id", id)
    if (error) { toast.error("Failed to delete schedule."); return }
    setSchedules(prev => prev.filter(s => s.id !== id))
    setDeleteScheduleId(null)
    toast.success("Schedule deleted.")
  }

  // ── Pastor helpers ──────────────────────────────────────────────────────
  const openAddPastor  = () => { setEditingPastor(null); setPastorForm(emptyPastor); setPastorDialog(true) }
  const openEditPastor = (p: Pastor) => {
    setEditingPastor(p)
    setPastorForm({ name: p.name, role: p.role, email: p.email, phone: p.phone, branch_id: p.branch_id, status: p.status, joined_year: p.joined_year })
    setPastorDialog(true)
  }
  // Pre-fill branch when assigning from branch card
  const openAssignPastorToBranch = (branch: Branch) => {
    setEditingPastor(null)
    setPastorForm({ ...emptyPastor, branch_id: branch.id })
    setPastorDialog(true)
  }

  const savePastor = async () => {
    const targetBranchId = pastorForm.branch_id

    // If assigning to a branch, unassign the current pastor of that branch first
    if (targetBranchId) {
      const displaced = pastors.find(
        p => p.branch_id === targetBranchId && p.id !== editingPastor?.id
      )
      if (displaced) {
        const { error } = await supabase.from("pastors").update({ branch_id: null }).eq("id", displaced.id)
        if (error) { toast.error("Failed to transfer pastor."); return }
        setPastors(prev => prev.map(p => p.id === displaced.id ? { ...p, branch_id: null } : p))
        toast.info(`${displaced.name} unassigned from ${branches.find(b => b.id === targetBranchId)?.name}.`)
      }
    }

    if (editingPastor) {
      const { error } = await supabase.from("pastors").update(pastorForm).eq("id", editingPastor.id)
      if (error) { toast.error("Failed to update pastor."); return }
      setPastors(prev => prev.map(p => p.id === editingPastor.id ? { ...p, ...pastorForm } : p))
    } else {
      const { data, error } = await supabase.from("pastors").insert(pastorForm).select().single()
      if (error) { toast.error("Failed to add pastor."); return }
      setPastors(prev => [...prev, data as Pastor])
    }
    toast.success(editingPastor ? "Pastor updated." : "Pastor added.")
    setPastorDialog(false)
  }

  const deletePastor = async (id: number) => {
    const { error } = await supabase.from("pastors").delete().eq("id", id)
    if (error) { toast.error("Failed to remove pastor."); return }
    setPastors(prev => prev.filter(p => p.id !== id))
    setDeletePastorId(null)
    toast.success("Pastor removed.")
  }

  // ── Member helpers ──────────────────────────────────────────────────────
  const acceptMember = async (id: number) => {
    const { error } = await supabase.from("branch_members").update({ status: "active" }).eq("id", id)
    if (error) { toast.error("Failed to accept member."); return }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "active" } : m))
    toast.success("Member accepted.")
  }
  const rejectMember = async (id: number) => {
    const { error } = await supabase.from("branch_members").update({ status: "inactive" }).eq("id", id)
    if (error) { toast.error("Failed to decline member."); return }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "inactive" } : m))
    toast.success("Member declined.")
  }

  // ── Assign member as pastor ─────────────────────────────────────────────
  const openAssignDialog = () => { setAssignQuery(""); setSelectedMember(null); setAssignRole("Pastor"); setAssignBranchId(""); setAssignDialog(true) }

  const memberQueryResults = assignQuery.trim().length > 0
    ? members.filter(m =>
        m.name.toLowerCase().includes(assignQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(assignQuery.toLowerCase())
      )
    : []

  const confirmAssign = async () => {
    if (!selectedMember || assignBranchId === "") return

    // Unassign current pastor of that branch first
    const displaced = pastors.find(p => p.branch_id === assignBranchId)
    if (displaced) {
      const { error } = await supabase.from("pastors").update({ branch_id: null }).eq("id", displaced.id)
      if (error) { toast.error("Failed to transfer pastor."); return }
      setPastors(prev => prev.map(p => p.id === displaced.id ? { ...p, branch_id: null } : p))
      toast.info(`${displaced.name} unassigned from branch.`)
    }

    const payload = {
      name: selectedMember.name,
      role: assignRole,
      email: selectedMember.email,
      phone: selectedMember.phone,
      branch_id: assignBranchId as number,
      status: "active" as const,
      joined_year: new Date().getFullYear().toString(),
    }
    const { data, error } = await supabase.from("pastors").insert(payload).select().single()
    if (error) { toast.error("Failed to assign pastor."); return }
    setPastors(prev => [...prev, data as Pastor])
    toast.success(`${selectedMember.name} assigned as ${assignRole}.`)
    setAssignDialog(false)
  }

  // ── Region helpers ──────────────────────────────────────────────────────
  const openAddRegion  = () => { setEditingRegion(null); setRegionName(""); setRegionDialog(true) }
  const openEditRegion = (r: Region) => { setEditingRegion(r); setRegionName(r.name); setRegionDialog(true) }

  const saveRegion = async () => {
    if (!regionName.trim()) { toast.error("Region name cannot be empty."); return }
    if (editingRegion) {
      const { error } = await supabase.from("regions").update({ name: regionName.trim() }).eq("id", editingRegion.id)
      if (error) { toast.error("Failed to update region."); return }
      setRegions(prev => prev.map(r => r.id === editingRegion.id ? { ...r, name: regionName.trim() } : r))
      toast.success("Region updated.")
    } else {
      const { data, error } = await supabase.from("regions").insert({ name: regionName.trim() }).select().single()
      if (error) { toast.error(error.message.includes("unique") ? "Region already exists." : "Failed to add region."); return }
      setRegions(prev => [...prev, data as Region])
      toast.success("Region added.")
    }
    setRegionDialog(false)
  }

  const deleteRegion = async (id: number) => {
    const { error } = await supabase.from("regions").delete().eq("id", id)
    if (error) { toast.error("Failed to delete region."); return }
    setRegions(prev => prev.filter(r => r.id !== id))
    setDeleteRegionId(null)
    toast.success("Region deleted.")
  }

  // ── Derived data ────────────────────────────────────────────────────────
  const getBranchPastors  = (branchId: number) => pastors.filter(p => p.branch_id === branchId)
  const getBranchName     = (id: number)       => branches.find(b => b.id === id)?.name || "Unknown"
  const filteredSchedules = scheduleBranchFilter === "all" ? schedules : schedules.filter(s => s.branch_id === scheduleBranchFilter)
  const filteredPastors   = pastors.filter(p =>
    p.name.toLowerCase().includes(pastorSearch.toLowerCase()) ||
    p.role.toLowerCase().includes(pastorSearch.toLowerCase()) ||
    getBranchName(p.branch_id ?? 0).toLowerCase().includes(pastorSearch.toLowerCase())
  )
  const branchMembers     = viewBranch
    ? members
        .filter(m => m.branch_id === viewBranch.id && (memberStatusFilter === "all" || m.status === memberStatusFilter))
        .filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()))
    : []
  const pendingCount = viewBranch ? members.filter(m => m.branch_id === viewBranch.id && m.status === "pending").length : 0

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Branches, Pastors &amp; Schedules</h1>
            <p className="text-muted-foreground mt-1">Manage branches, assign pastors, view members, and configure service schedules.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchAll} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Branches",   value: branches.length,                                   color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10", icon: Church },
            { label: "Total Pastors",    value: pastors.length,                                    color: "text-[var(--church-gold)]",    bg: "bg-[var(--church-gold)]/15",    icon: Shield },
            { label: "Total Members",    value: members.filter(m => m.status === "active").length, color: "text-emerald-600",             bg: "bg-emerald-500/10",             icon: Users },
            { label: "Pending Requests", value: members.filter(m => m.status === "pending").length,color: "text-rose-500",               bg: "bg-rose-500/10",                icon: UserCheck },
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

        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-6 flex flex-wrap gap-1">
            <TabsTrigger value="branches"       className="gap-2"><Church className="w-4 h-4" /> Branches</TabsTrigger>
            <TabsTrigger value="members"        className="gap-2"><Users className="w-4 h-4" /> Members</TabsTrigger>
            <TabsTrigger value="pastors"        className="gap-2"><Shield className="w-4 h-4" /> Pastors</TabsTrigger>
            <TabsTrigger value="schedules"      className="gap-2"><Calendar className="w-4 h-4" /> Schedules</TabsTrigger>
            <TabsTrigger value="branch-settings" className="gap-2"><Settings className="w-4 h-4" /> Branch Settings</TabsTrigger>
          </TabsList>

          {/* ── BRANCHES TAB ─────────────────────────────────────────── */}
          <TabsContent value="branches">
            {viewBranch ? (
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
                          <p className="text-xs text-muted-foreground mt-0.5">Registered: {m.joined_date}</p>
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
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">{branches.length} branches across all regions</p>
                  <Button onClick={openAddBranch} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                    <Plus className="w-4 h-4" /> Add Branch
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {branches.map(branch => {
                    const branchPastors = getBranchPastors(branch.id)
                    const seniorPastor = branchPastors.find(p => p.role === "Senior Pastor") || branchPastors[0] || null
                    const branchSchedules = schedules.filter(s => s.branch_id === branch.id)
                    return (
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
                                  {branch.maps_url && (
                                    <a href={branch.maps_url} target="_blank" rel="noopener noreferrer" title="View on Google Maps" className="flex-shrink-0 ml-1 text-[var(--church-primary)] hover:text-[var(--church-primary-deep)]">
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditBranch(branch)}><Edit className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteBranchId(branch.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={branch.status === "active" ? "border-emerald-500/30 text-emerald-600" : "border-muted text-muted-foreground"}>{branch.status}</Badge>
                            <Badge variant="secondary" className="text-xs">{regions.find(r => r.id === branch.region_id)?.name ?? ""}</Badge>
                            <span className="text-xs text-muted-foreground ml-auto">Est. {branch.established}</span>
                          </div>

                          {/* Pastor in Charge */}
                          <div className="rounded-lg border border-border p-2.5 space-y-1.5">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pastor in Charge</p>
                            {seniorPastor ? (
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-6 h-6 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center flex-shrink-0">
                                    <User className="w-3 h-3 text-[var(--church-gold)]" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">{seniorPastor.name}</p>
                                    <p className="text-xs text-muted-foreground">{seniorPastor.role}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="w-6 h-6 flex-shrink-0" onClick={() => openEditPastor(seniorPastor)}>
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-1.5 h-7 text-xs border-dashed border-[var(--church-primary)]/40 text-[var(--church-primary)] hover:bg-[var(--church-primary)]/5"
                                onClick={() => openAssignPastorToBranch(branch)}
                              >
                                <UserPlus className="w-3 h-3" /> Assign Pastor
                              </Button>
                            )}
                          </div>

                          {/* Schedules summary */}
                          <div className="pt-1">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Schedules</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs gap-1 text-[var(--church-primary)] hover:text-[var(--church-primary)] hover:bg-[var(--church-primary)]/10 px-2"
                                onClick={() => openAddSchedule(branch.id)}
                              >
                                <Plus className="w-3 h-3" /> Add
                              </Button>
                            </div>
                            {branchSchedules.length === 0 ? (
                              <p className="text-xs text-muted-foreground">No schedules added</p>
                            ) : branchSchedules.map(s => (
                              <div key={s.id} className="flex items-center gap-2 text-xs mb-1 group">
                                <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">{s.day}</span>
                                <span className="text-muted-foreground">{s.time}</span>
                                <span className="text-muted-foreground truncate flex-1">— {s.type}</span>
                                <div className="hidden group-hover:flex gap-0.5 flex-shrink-0">
                                  <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => openEditSchedule(s)}><Edit className="w-2.5 h-2.5" /></Button>
                                  <Button variant="ghost" size="icon" className="w-5 h-5 text-destructive" onClick={() => setDeleteScheduleId(s.id)}><Trash2 className="w-2.5 h-2.5" /></Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Footer buttons */}
                          <div className="flex gap-2 pt-1">
                            <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => { setViewBranch(branch); setMemberSearch(""); setMemberStatusFilter("all") }}>
                              <Eye className="w-3.5 h-3.5" /> Members
                              {members.filter(m => m.branch_id === branch.id && m.status === "pending").length > 0 && (
                                <Badge className="ml-auto bg-rose-500 text-white text-xs px-1.5 py-0.5">
                                  {members.filter(m => m.branch_id === branch.id && m.status === "pending").length}
                                </Badge>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => openAssignPastorToBranch(branch)}
                              title="Add another pastor"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── MEMBERS TAB ──────────────────────────────────────────── */}
          <TabsContent value="members">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search members..." className="pl-9" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} />
              </div>
              <Select value={scheduleBranchFilter === "all" ? "all" : String(scheduleBranchFilter)} onValueChange={v => setScheduleBranchFilter(v === "all" ? "all" : Number(v))}>
                <SelectTrigger className="w-52"><SelectValue placeholder="All Branches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={memberStatusFilter} onValueChange={(v: "all" | "active" | "pending") => setMemberStatusFilter(v)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(() => {
              const allMembers = members
                .filter(m => scheduleBranchFilter === "all" || m.branch_id === scheduleBranchFilter)
                .filter(m => memberStatusFilter === "all" || m.status === memberStatusFilter)
                .filter(m =>
                  m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                  m.email.toLowerCase().includes(memberSearch.toLowerCase())
                )
              return (
                <div className="space-y-3">
                  {allMembers.length === 0 ? (
                    <Card><CardContent className="p-12 text-center text-muted-foreground">No members found.</CardContent></Card>
                  ) : allMembers.map(m => (
                    <Card key={m.id} className={m.status === "pending" ? "border-[var(--church-gold)]/40 bg-[var(--church-gold)]/5" : ""}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                            {getInitials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{m.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</span>
                            <span className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</span>
                            <span className="flex items-center gap-1"><Church className="w-3 h-3" />{getBranchName(m.branch_id)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">Registered: {m.joined_date}</p>
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
              )
            })()}
          </TabsContent>

          {/* ── PASTORS TAB ──────────────────────────────────────────── */}
          <TabsContent value="pastors">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search pastors..." className="pl-9" value={pastorSearch} onChange={e => setPastorSearch(e.target.value)} />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={openAssignDialog} className="gap-2 flex-1 sm:flex-none">
                  <UserPlus className="w-4 h-4" /> Assign from Members
                </Button>
                <Button onClick={openAddPastor} className="gap-2 flex-1 sm:flex-none bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <Plus className="w-4 h-4" /> Add Pastor
                </Button>
              </div>
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
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditPastor(pastor)}><Edit className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeletePastorId(pastor.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2"><Church className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{pastor.branch_id ? getBranchName(pastor.branch_id) : "Unassigned"}</span></div>
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{pastor.email}</span></div>
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 flex-shrink-0" /><span>{pastor.phone}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 flex-shrink-0" /><span>Joined {pastor.joined_year}</span></div>
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

          {/* ── SCHEDULES TAB ────────────────────────────────────────── */}
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
                      <p className="text-xs text-muted-foreground mt-0.5">{getBranchName(s.branch_id)} &middot; {s.description}</p>
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

          {/* ── BRANCH SETTINGS TAB ──────────────────────────────────── */}
          <TabsContent value="branch-settings">
            <div className="max-w-2xl space-y-6">

              {/* Regions */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-[var(--church-primary)]" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Regions</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage region categories for branch assignment.</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={openAddRegion} className="gap-1.5 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                      <Plus className="w-3.5 h-3.5" /> Add Region
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {regions.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No regions found. Add a region to get started.</p>
                  ) : (
                    <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                      {regions.map(region => {
                        const usedBy = branches.filter(b => b.region_id === region.id).length
                        return (
                          <div key={region.id} className="flex items-center justify-between px-4 py-3 bg-background hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-[var(--church-primary)]" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{region.name}</p>
                                <p className="text-xs text-muted-foreground">{usedBy} branch{usedBy !== 1 ? "es" : ""}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditRegion(region)}>
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7 text-destructive hover:text-destructive"
                                onClick={() => setDeleteRegionId(region.id)}
                                disabled={usedBy > 0}
                                title={usedBy > 0 ? "Cannot delete: region is in use" : "Delete region"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        </Tabs>

        {/* ── Branch Dialog ─────────────────────────────────────────── */}
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
                  <Select value={String(branchForm.region_id)} onValueChange={v => setBranchForm(p => ({ ...p, region_id: Number(v) }))}>
                    <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                    <SelectContent>
                      {regions.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                    </SelectContent>
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
                <div className="col-span-2 space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Map className="w-3.5 h-3.5" /> Google Maps Embed URL
                  </Label>
                  <Input
                    value={branchForm.maps_url ?? ""}
                    onChange={e => setBranchForm(p => ({ ...p, maps_url: e.target.value }))}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    In Google Maps: Share → Embed a map → copy the <code className="bg-muted px-1 rounded">src</code> URL from the iframe code.
                  </p>
                </div>
              </div>
              {/* Google Maps Preview — only for embed URLs */}
              {branchForm.maps_url && branchForm.maps_url.includes("google.com/maps/embed") && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <iframe
                    src={branchForm.maps_url}
                    width="100%"
                    height="240"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setBranchDialog(false)}>Cancel</Button>
                <Button onClick={saveBranch} className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  {editingBranch ? "Save Changes" : "Add Branch"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Pastor Dialog ─────────────────────────────────────────── */}
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
                  <Input value={pastorForm.joined_year} onChange={e => setPastorForm(p => ({ ...p, joined_year: e.target.value }))} placeholder="e.g. 2010" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Assigned Branch</Label>
                  <Select value={pastorForm.branch_id ? String(pastorForm.branch_id) : ""} onValueChange={v => setPastorForm(p => ({ ...p, branch_id: Number(v) }))}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.map(b => {
                        const current = pastors.find(p => p.branch_id === b.id && p.id !== editingPastor?.id)
                        return (
                          <SelectItem key={b.id} value={String(b.id)}>
                            {b.name}{current ? ` (has: ${current.name})` : ""}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  {pastorForm.branch_id && pastors.find(p => p.branch_id === pastorForm.branch_id && p.id !== editingPastor?.id) && (
                    <p className="text-xs text-amber-600">
                      ⚠ This branch already has a pastor. Saving will transfer them out.
                    </p>
                  )}
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

        {/* ── Schedule Dialog ───────────────────────────────────────── */}
        <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add Service Schedule"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Branch</Label>
                <Select value={scheduleForm.branch_id ? String(scheduleForm.branch_id) : ""} onValueChange={v => setScheduleForm(p => ({ ...p, branch_id: Number(v) }))}>
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

        {/* ── Region Dialog ─────────────────────────────────────────── */}
        <Dialog open={regionDialog} onOpenChange={setRegionDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{editingRegion ? "Edit Region" : "Add New Region"}</DialogTitle>
              <DialogDescription>Enter a region name (e.g. Region IV, Overseas).</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Region Name</Label>
                <Input
                  value={regionName}
                  onChange={e => setRegionName(e.target.value)}
                  placeholder="e.g. Region IV"
                  onKeyDown={e => e.key === "Enter" && saveRegion()}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRegionDialog(false)}>Cancel</Button>
                <Button onClick={saveRegion} className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  {editingRegion ? "Save Changes" : "Add Region"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Assign Member as Pastor Dialog ───────────────────────── */}
        <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Member as Pastor</DialogTitle>
              <DialogDescription>Search a member by name or email, then assign them a role and branch.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Search Member</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Type a name or email..." value={assignQuery}
                    onChange={e => { setAssignQuery(e.target.value); setSelectedMember(null) }} autoFocus />
                </div>
              </div>
              {assignQuery.trim().length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  {memberQueryResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No members found for &quot;{assignQuery}&quot;</div>
                  ) : (
                    <div className="divide-y divide-border max-h-48 overflow-y-auto">
                      {memberQueryResults.map(m => (
                        <button key={m.id} type="button" onClick={() => setSelectedMember(m)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left ${selectedMember?.id === m.id ? "bg-[var(--church-primary)]/10" : ""}`}>
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-xs font-semibold">{getInitials(m.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{m.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">{getBranchName(m.branch_id)}</Badge>
                            {selectedMember?.id === m.id && <Check className="w-4 h-4 text-[var(--church-primary)]" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {selectedMember && (
                <div className="rounded-lg border border-[var(--church-primary)]/30 bg-[var(--church-primary)]/5 p-3 flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[var(--church-primary)]/20 text-[var(--church-primary)] font-semibold">{getInitials(selectedMember.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{selectedMember.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMember.email} · {selectedMember.phone}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="w-7 h-7 flex-shrink-0" onClick={() => { setSelectedMember(null); setAssignQuery("") }}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
              {selectedMember && (
                <>
                  <div className="space-y-1.5">
                    <Label>Pastor Role</Label>
                    <Select value={assignRole} onValueChange={setAssignRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{pastorRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Assign to Branch</Label>
                    <Select value={assignBranchId === "" ? "" : String(assignBranchId)} onValueChange={v => setAssignBranchId(Number(v))}>
                      <SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger>
                      <SelectContent>{branches.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAssignDialog(false)}>Cancel</Button>
                <Button onClick={confirmAssign} disabled={!selectedMember || assignBranchId === ""}
                  className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <UserPlus className="w-4 h-4" /> Assign as Pastor
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Confirm Dialogs ───────────────────────────────────────── */}
        <AlertDialog open={deleteBranchId !== null} onOpenChange={() => setDeleteBranchId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Branch?</AlertDialogTitle>
              <AlertDialogDescription>This will also remove all service schedules and member records for this branch. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteBranchId && deleteBranch(deleteBranchId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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

        <AlertDialog open={deleteRegionId !== null} onOpenChange={() => setDeleteRegionId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Region?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this region. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteRegionId && deleteRegion(deleteRegionId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
    </DashboardLayout>
  )
}
