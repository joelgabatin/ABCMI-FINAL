"use client"

import { useState, useEffect, useCallback } from "react"
import {
  BookOpen, Plus, Edit, Trash2, Users, MapPin, Clock,
  Search, Check, X, MessageSquare, Home, RefreshCw, Archive,
  UserCheck, Phone, Mail, Calendar, ArchiveRestore
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { toast } from "sonner"

// ── Types ──────────────────────────────────────────────────────────────────────
interface BibleStudyGroup {
  id: number
  name: string
  branch: string
  leader: string
  topic: string
  schedule: string
  time: string
  location: string
  members: number
  max_members: number
  status: "active" | "full" | "inactive" | "archived"
  description: string
  start_date: string | null
  created_at: string
}

interface StudyRequest {
  id: number
  request_type: "join" | "open_house"
  name: string
  email: string | null
  phone: string | null
  branch: string
  preferred_group: string | null
  address: string | null
  preferred_day: string | null
  preferred_time: string | null
  capacity: number | null
  message: string | null
  status: "pending" | "approved" | "declined" | "request done"
  admin_notes: string | null
  group_id: number | null
  created_at: string
}

interface BibleStudyMember {
  id: number
  group_id: number
  request_id: number | null
  name: string
  email: string | null
  phone: string | null
  created_at: string
}

// ── Constants ──────────────────────────────────────────────────────────────────
const branches = [
  "ABCMI Main Church", "Camp 8 Branch", "San Carlos Branch",
  "Kias Branch", "Patiacan Branch", "Villa Conchita Branch", "Casacgudan Branch",
]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const emptyForm = {
  name: "", branch: "ABCMI Main Church", leader: "", topic: "", schedule: "Wednesday",
  time: "", location: "", members: 0, max_members: 20,
  status: "active" as BibleStudyGroup["status"], description: "", start_date: "",
}

const emptyMemberForm = {
  name: "", email: "", phone: "",
}

const statusColor: Record<string, string> = {
  active:   "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  full:     "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30",
  inactive: "bg-muted text-muted-foreground",
  archived: "bg-slate-200 text-slate-500 border-slate-300",
}

const reqStatusColor: Record<string, string> = {
  pending:        "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30",
  approved:       "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  declined:       "bg-muted text-muted-foreground",
  "request done": "bg-blue-500/10 text-blue-600 border-blue-500/20",
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ── Components ─────────────────────────────────────────────────────────────────
function GroupCard({ 
  group, onEdit, onArchive, onDelete, onViewMembers 
}: { 
  group: BibleStudyGroup, 
  onEdit: (g: BibleStudyGroup) => void,
  onArchive: (g: BibleStudyGroup) => void,
  onDelete: (g: BibleStudyGroup) => void,
  onViewMembers: (g: BibleStudyGroup) => void
}) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${group.status === "archived" ? "opacity-70" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-[var(--church-primary)]" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm leading-tight">{group.name}</CardTitle>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{group.topic}</p>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" className="w-7 h-7" title="Edit" onClick={() => onEdit(group)}>
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="w-7 h-7 text-slate-500 hover:text-slate-700"
              title={group.status === "archived" ? "Restore" : "Archive"}
              onClick={() => onArchive(group)}
            >
              {group.status === "archived"
                ? <ArchiveRestore className="w-3.5 h-3.5" />
                : <Archive className="w-3.5 h-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" title="Delete" onClick={() => onDelete(group)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        <Badge className={`text-xs ${statusColor[group.status]}`}>{group.status}</Badge>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" />{group.branch}</div>
          <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 flex-shrink-0" />{group.schedule} &middot; {group.time}</div>
          <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" />{group.location}</div>
        </div>
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-muted-foreground truncate">Leader: <span className="text-foreground font-medium">{group.leader}</span></span>
          <span className={`font-medium ml-2 flex-shrink-0 ${group.members >= group.max_members ? "text-rose-500" : "text-emerald-600"}`}>
            {group.members}/{group.max_members}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${group.members >= group.max_members ? "bg-rose-500" : "bg-[var(--church-primary)]"}`}
            style={{ width: `${Math.min((group.members / group.max_members) * 100, 100)}%` }}
          />
        </div>

        {/* View Members button */}
        <Button
          variant="outline" size="sm"
          className="w-full mt-1 gap-2 text-xs h-8 border-[var(--church-primary)]/30 text-[var(--church-primary)] hover:bg-[var(--church-primary)]/10"
          onClick={() => onViewMembers(group)}
        >
          <Users className="w-3.5 h-3.5" /> View Members ({group.members})
        </Button>
      </CardContent>
    </Card>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AdminBibleStudyPage() {
  const [groups,   setGroups]   = useState<BibleStudyGroup[]>([])
  const [requests, setRequests] = useState<StudyRequest[]>([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)

  // group dialog
  const [groupDialog,   setGroupDialog]   = useState(false)
  const [editingGroup,  setEditingGroup]  = useState<BibleStudyGroup | null>(null)
  const [groupForm,     setGroupForm]     = useState(emptyForm)

  // delete / archive dialogs
  const [deleteTarget,  setDeleteTarget]  = useState<BibleStudyGroup | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<BibleStudyGroup | null>(null)

  // members dialog
  const [membersTarget, setMembersTarget] = useState<BibleStudyGroup | null>(null)
  const [groupMembers, setGroupMembers] = useState<BibleStudyMember[]>([])
  const [fetchingMembers, setFetchingMembers] = useState(false)

  // member add/edit dialog
  const [memberFormDialog, setMemberFormDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<BibleStudyMember | null>(null)
  const [memberForm, setMemberForm] = useState(emptyMemberForm)

  // assign group dialog
  const [assigningRequest, setAssigningRequest] = useState<StudyRequest | null>(null)
  const [selectedGroupId,  setSelectedGroupId]  = useState<string>("")

  // filters
  const [search,          setSearch]          = useState("")
  const [branchFilter,    setBranchFilter]    = useState("all")
  const [showArchived,    setShowArchived]    = useState(false)
  const [reqTypeFilter,   setReqTypeFilter]   = useState<"all" | "join" | "open_house">("all")
  const [reqStatusFilter, setReqStatusFilter] = useState("all")

  // grouping view
  const [isGroupedByBranch, setIsGroupedByBranch] = useState(false)

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [gRes, rRes] = await Promise.all([
        fetch("/api/bible-study/groups"),
        fetch("/api/bible-study/requests"),
      ])
      if (gRes.ok) setGroups(await gRes.json())
      else toast.error("Failed to load groups.")
      if (rRes.ok) setRequests(await rRes.json())
      else toast.error("Failed to load requests.")
    } catch {
      toast.error("Network error — could not load data.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Group CRUD ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingGroup(null)
    setGroupForm(emptyForm)
    setGroupDialog(true)
  }

  const openEdit = (g: BibleStudyGroup) => {
    setEditingGroup(g)
    setGroupForm({
      name: g.name, branch: g.branch, leader: g.leader, topic: g.topic,
      schedule: g.schedule, time: g.time, location: g.location,
      members: g.members, max_members: g.max_members, status: g.status,
      description: g.description, start_date: g.start_date ?? "",
    })
    setGroupDialog(true)
  }

  const saveGroup = async () => {
    if (!groupForm.name.trim())   { toast.error("Group name is required."); return }
    if (!groupForm.leader.trim()) { toast.error("Leader name is required."); return }
    if (!groupForm.topic.trim())  { toast.error("Study topic is required."); return }
    setSaving(true)
    try {
      const url    = editingGroup ? `/api/bible-study/groups/${editingGroup.id}` : "/api/bible-study/groups"
      const method = editingGroup ? "PUT" : "POST"
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...groupForm, start_date: groupForm.start_date || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Unknown error")
      toast.success(editingGroup ? "Group updated successfully." : "Group added successfully.")
      setGroupDialog(false)
      fetchAll()
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to save group.")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/bible-study/groups/${deleteTarget.id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to delete")
      toast.success(`"${deleteTarget.name}" deleted.`)
      setDeleteTarget(null)
      fetchAll()
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to delete group.")
    }
  }

  const confirmArchive = async () => {
    if (!archiveTarget) return
    const newStatus = archiveTarget.status === "archived" ? "inactive" : "archived"
    try {
      const res = await fetch(`/api/bible-study/groups/${archiveTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...archiveTarget, status: newStatus, start_date: archiveTarget.start_date || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to update")
      toast.success(newStatus === "archived" ? `"${archiveTarget.name}" archived.` : `"${archiveTarget.name}" restored.`)
      setArchiveTarget(null)
      fetchAll()
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to archive group.")
    }
  }

  // ── Request actions ──────────────────────────────────────────────────────────
  const updateRequest = async (id: number, status: "approved" | "declined", groupId?: number) => {
    try {
      const res = await fetch(`/api/bible-study/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, group_id: groupId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to update")
      toast.success(`Request ${status}${groupId ? " and assigned to group" : ""}.`)
      setAssigningRequest(null)
      setSelectedGroupId("")
      fetchAll()
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to update request.")
    }
  }

  const handleAssignGroup = () => {
    if (!assigningRequest || !selectedGroupId) return
    updateRequest(assigningRequest.id, "approved", parseInt(selectedGroupId))
  }

  const fetchMembers = useCallback(async (groupId: number) => {
    setFetchingMembers(true)
    try {
      const res = await fetch(`/api/bible-study/members?group_id=${groupId}`)
      if (res.ok) setGroupMembers(await res.json())
      else toast.error("Failed to load members.")
    } catch {
      toast.error("Network error — could not load members.")
    } finally {
      setFetchingMembers(false)
    }
  }, [])

  useEffect(() => {
    if (membersTarget) {
      fetchMembers(membersTarget.id)
    }
  }, [membersTarget, fetchMembers])

  const openAddMember = () => {
    setEditingMember(null)
    setMemberForm(emptyMemberForm)
    setMemberFormDialog(true)
  }

  const openEditMember = (m: BibleStudyMember) => {
    setEditingMember(m)
    setMemberForm({ name: m.name, email: m.email || "", phone: m.phone || "" })
    setMemberFormDialog(true)
  }

  const saveMember = async () => {
    if (!memberForm.name.trim()) { toast.error("Name is required."); return }
    if (!membersTarget) return

    setSaving(true)
    try {
      const url = editingMember ? `/api/bible-study/members/${editingMember.id}` : "/api/bible-study/members"
      const method = editingMember ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...memberForm, group_id: membersTarget.id }),
      })
      if (!res.ok) throw new Error("Failed to save member")
      toast.success(editingMember ? "Member updated." : "Member added.")
      setMemberFormDialog(false)
      fetchMembers(membersTarget.id)
      fetchAll() // refresh group counts
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const deleteMember = async (id: number) => {
    if (!membersTarget) return
    try {
      const res = await fetch(`/api/bible-study/members/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete member")
      toast.success("Member removed.")
      fetchMembers(membersTarget.id)
      fetchAll() // refresh group counts
    } catch (e: unknown) {
      toast.error((e as Error).message)
    }
  }

  // ── Derived data ─────────────────────────────────────────────────────────────
  const filteredGroups = groups.filter(g =>
    (showArchived ? g.status === "archived" : g.status !== "archived") &&
    (branchFilter === "all" || g.branch === branchFilter) &&
    (
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.topic.toLowerCase().includes(search.toLowerCase()) ||
      g.leader.toLowerCase().includes(search.toLowerCase())
    )
  )

  const filteredRequests = requests.filter(r =>
    (reqTypeFilter   === "all" || r.request_type === reqTypeFilter) &&
    (reqStatusFilter === "all" || r.status        === reqStatusFilter)
  )

  const pendingCount      = requests.filter(r => r.status === "pending").length
  const openHousePending  = requests.filter(r => r.request_type === "open_house" && r.status === "pending").length
  const joinPending       = requests.filter(r => r.request_type === "join"       && r.status === "pending").length
  const archivedCount     = groups.filter(g => g.status === "archived").length

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bible Study Management</h1>
            <p className="text-muted-foreground mt-1">Manage study groups and member requests to join or open their home.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" onClick={fetchAll} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Groups",      value: groups.filter(g => g.status !== "archived").length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10", icon: BookOpen },
            { label: "Active Groups",     value: groups.filter(g => g.status === "active").length,   color: "text-emerald-600",             bg: "bg-emerald-500/10",              icon: Check },
            { label: "Total Participants",value: groups.filter(g => g.status !== "archived").reduce((s, g) => s + g.members, 0), color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15", icon: Users },
            { label: "Pending Requests",  value: pendingCount,                                       color: "text-rose-500",                bg: "bg-rose-500/10",                 icon: MessageSquare },
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

        {/* Tabs */}
        <Tabs defaultValue="groups">
          <TabsList className="mb-6">
            <TabsTrigger value="groups" className="gap-2">
              <BookOpen className="w-4 h-4" /> Study Groups
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <MessageSquare className="w-4 h-4" /> Requests
              {pendingCount > 0 && (
                <Badge className="ml-1 bg-rose-500 text-white text-xs px-1.5 py-0">{pendingCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── GROUPS TAB ──────────────────────────────────────────────────── */}
          <TabsContent value="groups">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between">
              <div className="flex gap-3 flex-1 flex-wrap">
                <div className="relative flex-1 min-w-48 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search groups…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={branchFilter} onValueChange={v => { setBranchFilter(v); if (v !== "all") setIsGroupedByBranch(false) }}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="All Branches" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button
                  variant={isGroupedByBranch ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 ${isGroupedByBranch ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                  onClick={() => {
                    setIsGroupedByBranch(!isGroupedByBranch)
                    if (!isGroupedByBranch) {
                      setShowArchived(false)
                      setBranchFilter("all")
                    }
                  }}
                >
                  <Users className="w-4 h-4" />
                  Active Groups
                </Button>
                <Button
                  variant={showArchived ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 ${showArchived ? "bg-slate-600 hover:bg-slate-700 text-white" : ""}`}
                  onClick={() => {
                    setShowArchived(v => !v)
                    if (!showArchived) setIsGroupedByBranch(false)
                  }}
                >
                  <Archive className="w-4 h-4" />
                  {showArchived ? "Archived" : "Archived"} {archivedCount > 0 && `(${archivedCount})`}
                </Button>
              </div>
              <Button onClick={openAdd} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white flex-shrink-0">
                <Plus className="w-4 h-4" /> Add Group
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}><CardContent className="p-6 h-44 animate-pulse bg-muted/40 rounded-xl" /></Card>
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <Card><CardContent className="p-12 text-center text-muted-foreground">
                {showArchived ? "No archived groups." : "No study groups found."}
              </CardContent></Card>
            ) : isGroupedByBranch ? (
              <div className="space-y-8">
                {branches.map(branch => {
                  const branchGroups = filteredGroups.filter(g => g.branch === branch && g.status !== "archived")
                  return (
                    <div key={branch} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> {branch}
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{branchGroups.length}</Badge>
                        </h3>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      
                      {branchGroups.length === 0 ? (
                        <Card className="border-dashed border-2 bg-muted/20">
                          <CardContent className="p-8 text-center text-muted-foreground text-sm">
                            No study groups found for this branch.
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {branchGroups.map(group => (
                            <GroupCard 
                              key={group.id} 
                              group={group} 
                              onEdit={openEdit} 
                              onArchive={() => setArchiveTarget(group)} 
                              onDelete={() => setDeleteTarget(group)}
                              onViewMembers={() => setMembersTarget(group)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredGroups.map(group => (
                  <GroupCard 
                    key={group.id} 
                    group={group} 
                    onEdit={openEdit} 
                    onArchive={() => setArchiveTarget(group)} 
                    onDelete={() => setDeleteTarget(group)}
                    onViewMembers={() => setMembersTarget(group)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── REQUESTS TAB ────────────────────────────────────────────────── */}
          <TabsContent value="requests">
            {/* Sub-stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <Home className="w-4 h-4 text-[var(--church-primary)]" />
                  <div>
                    <p className="text-sm font-semibold">{openHousePending} pending</p>
                    <p className="text-xs text-muted-foreground">Open-house requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--church-gold)]" />
                  <div>
                    <p className="text-sm font-semibold">{joinPending} pending</p>
                    <p className="text-xs text-muted-foreground">Join requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold">{requests.filter(r => r.status === "approved").length} approved</p>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4 flex-wrap">
              <Select value={reqTypeFilter} onValueChange={v => setReqTypeFilter(v as typeof reqTypeFilter)}>
                <SelectTrigger className="w-44"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="join">Join Request</SelectItem>
                  <SelectItem value="open_house">Open House</SelectItem>
                </SelectContent>
              </Select>
              <Select value={reqStatusFilter} onValueChange={setReqStatusFilter}>
                <SelectTrigger className="w-44"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="request done">Request Done</SelectItem>
                </SelectContent>
              </Select>
              </div>

              {loading ? (

              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}><CardContent className="p-6 h-24 animate-pulse bg-muted/40" /></Card>
                ))}
              </div>
            ) : filteredRequests.length === 0 ? (
              <Card><CardContent className="p-12 text-center text-muted-foreground">No requests found.</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map(req => (
                  <Card key={req.id} className={req.status === "pending" ? "border-[var(--church-gold)]/40" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                            {req.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Name + badges */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-semibold text-foreground">{req.name}</p>
                            <Badge className={`text-xs ${reqStatusColor[req.status]}`}>{req.status}</Badge>
                            <Badge variant="outline" className="text-xs gap-1">
                              {req.request_type === "open_house"
                                ? <><Home className="w-3 h-3" /> Open House</>
                                : <><BookOpen className="w-3 h-3" /> Join Group</>}
                            </Badge>
                          </div>

                          {/* Contact */}
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mb-1">
                            {req.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{req.email}</span>}
                            {req.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{req.phone}</span>}
                            {req.branch && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{req.branch}</span>}
                          </div>

                          {/* Join-specific */}
                          {req.request_type === "join" && (
                            <div className="space-y-1 mt-1">
                              {req.preferred_group && (
                                <p className="text-xs text-muted-foreground">
                                  Preferred group: <span className="font-medium text-foreground">{req.preferred_group}</span>
                                </p>
                              )}
                              {req.group_id && (
                                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                  <UserCheck className="w-3 h-3" />
                                  Assigned to: {groups.find(g => g.id === req.group_id)?.name || "Group #" + req.group_id}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Open-house-specific */}
                          {req.request_type === "open_house" && (
                            <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                              {req.address && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{req.address}</p>}
                              {(req.preferred_day || req.preferred_time) && (
                                <p className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {[req.preferred_day, req.preferred_time].filter(Boolean).join(" · ")}
                                </p>
                              )}
                              {req.capacity && (
                                <p className="flex items-center gap-1"><Users className="w-3 h-3" />Capacity: {req.capacity} persons</p>
                              )}
                            </div>
                          )}

                          {req.message && (
                            <p className="text-sm text-foreground mt-2 italic border-l-2 border-[var(--church-primary)]/30 pl-2">"{req.message}"</p>
                          )}

                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Submitted: {fmtDate(req.created_at)}
                          </p>
                        </div>

                        {/* Approve / Decline */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {req.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="gap-1 bg-emerald-500 hover:bg-emerald-600 text-white h-8 w-24"
                                onClick={() => {
                                  if (req.request_type === "join") {
                                    setAssigningRequest(req)
                                  } else {
                                    updateRequest(req.id, "approved")
                                  }
                                }}
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 border-destructive text-destructive hover:bg-destructive/10 h-8 w-24"
                                onClick={() => updateRequest(req.id, "declined")}
                              >
                                <X className="w-3.5 h-3.5" /> Decline
                              </Button>
                            </>
                          )}
                          {req.status === "approved" && req.request_type === "join" && !req.group_id && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 border-[var(--church-gold)] text-[var(--church-gold)] hover:bg-[var(--church-gold)]/10 h-8 w-24"
                              onClick={() => setAssigningRequest(req)}
                            >
                              <Users className="w-3.5 h-3.5" /> Assign
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* ── Add / Edit Group Dialog ──────────────────────────────────────── */}
        <Dialog open={groupDialog} onOpenChange={open => { if (!saving) setGroupDialog(open) }}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingGroup ? "Edit Bible Study Group" : "Add New Bible Study Group"}</DialogTitle>
              <DialogDescription>Fill in the group details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <Label>Group Name <span className="text-destructive">*</span></Label>
                <Input value={groupForm.name} onChange={e => setGroupForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Foundations of Faith" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Branch</Label>
                  <Select value={groupForm.branch} onValueChange={v => setGroupForm(p => ({ ...p, branch: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={groupForm.status} onValueChange={(v: BibleStudyGroup["status"]) => setGroupForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Leader / Pastor <span className="text-destructive">*</span></Label>
                <Input value={groupForm.leader} onChange={e => setGroupForm(p => ({ ...p, leader: e.target.value }))} placeholder="e.g. Ptr. Juan dela Cruz" />
              </div>
              <div className="space-y-1.5">
                <Label>Study Topic / Book <span className="text-destructive">*</span></Label>
                <Input value={groupForm.topic} onChange={e => setGroupForm(p => ({ ...p, topic: e.target.value }))} placeholder="e.g. Book of Romans" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Day</Label>
                  <Select value={groupForm.schedule} onValueChange={v => setGroupForm(p => ({ ...p, schedule: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Input value={groupForm.time} onChange={e => setGroupForm(p => ({ ...p, time: e.target.value }))} placeholder="e.g. 7:00 PM" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={groupForm.location} onChange={e => setGroupForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Main Sanctuary" />
                </div>
                <div className="space-y-1.5">
                  <Label>Max Members</Label>
                  <Input type="number" min={1} value={groupForm.max_members} onChange={e => setGroupForm(p => ({ ...p, max_members: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={groupForm.description} onChange={e => setGroupForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of this study group…" rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={groupForm.start_date ?? ""} onChange={e => setGroupForm(p => ({ ...p, start_date: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => setGroupDialog(false)} disabled={saving}>Cancel</Button>
                <Button onClick={saveGroup} disabled={saving} className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white min-w-28">
                  {saving ? "Saving…" : editingGroup ? "Save Changes" : "Add Group"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Assign Group Dialog ────────────────────────────────────────── */}
        <Dialog open={assigningRequest !== null} onOpenChange={open => { if (!open) { setAssigningRequest(null); setSelectedGroupId("") } }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign to Bible Study Group</DialogTitle>
              <DialogDescription>
                Assign <strong>{assigningRequest?.name}</strong> to a study group.
                {assigningRequest?.preferred_group && (
                  <span className="block mt-1">Preferred: {assigningRequest.preferred_group}</span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <Label>Select Group</Label>
                <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group..." />
                  </SelectTrigger>
                  <SelectContent>
                    {groups
                      .filter(g => g.status === "active" || g.status === "full")
                      .map(g => (
                        <SelectItem key={g.id} value={g.id.toString()}>
                          {g.name} ({g.members}/{g.max_members}) - {g.leader}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => setAssigningRequest(null)}>Cancel</Button>
                <Button
                  onClick={handleAssignGroup}
                  disabled={!selectedGroupId}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-28"
                >
                  Approve & Assign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Members Dialog ───────────────────────────────────────────────── */}
        <Dialog open={membersTarget !== null} onOpenChange={open => { if (!open) setMembersTarget(null) }}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--church-primary)]" />
                  {membersTarget?.name} Members
                </DialogTitle>
                <Button size="sm" onClick={openAddMember} className="gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
              <DialogDescription>
                {membersTarget?.members} of {membersTarget?.max_members} members &middot; {membersTarget?.schedule} {membersTarget?.time}
              </DialogDescription>
            </DialogHeader>
            
            {fetchingMembers ? (
              <div className="py-12 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-2 pt-1">
                {/* Leader always at top */}
                {membersTarget?.leader && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/10">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-xs font-semibold">
                        L
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{membersTarget.leader}</p>
                      <p className="text-xs text-muted-foreground">Group Leader</p>
                    </div>
                    <Badge className="bg-[var(--church-primary)] text-white text-xs">Leader</Badge>
                  </div>
                )}

                {groupMembers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm italic">No other members yet.</p>
                ) : groupMembers.map(m => (
                  <div key={m.id} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        {m.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {fmtDate(m.created_at)}
                        {m.phone && ` · ${m.phone}`}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="w-7 h-7" title="Edit" onClick={() => openEditMember(m)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" title="Delete" onClick={() => deleteMember(m.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Member Form Dialog ─────────────────────────────────────────── */}
        <Dialog open={memberFormDialog} onOpenChange={setMemberFormDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Member" : "Add Member"}</DialogTitle>
              <DialogDescription>
                {editingMember ? "Update participant details." : `Add a new participant to ${membersTarget?.name}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Full Name <span className="text-destructive">*</span></Label>
                <Input 
                  value={memberForm.name} 
                  onChange={e => setMemberForm(p => ({ ...p, name: e.target.value }))} 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={memberForm.email} 
                  onChange={e => setMemberForm(p => ({ ...p, email: e.target.value }))} 
                  placeholder="john@example.com" 
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input 
                  value={memberForm.phone} 
                  onChange={e => setMemberForm(p => ({ ...p, phone: e.target.value }))} 
                  placeholder="+63 9xx xxx xxxx" 
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => setMemberFormDialog(false)}>Cancel</Button>
                <Button 
                  onClick={saveMember} 
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-24"
                >
                  {saving ? "Saving..." : editingMember ? "Update" : "Add Member"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Archive Confirm ──────────────────────────────────────────────── */}
        <AlertDialog open={archiveTarget !== null} onOpenChange={() => setArchiveTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {archiveTarget?.status === "archived" ? "Restore Group?" : "Archive Group?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {archiveTarget?.status === "archived"
                  ? `"${archiveTarget?.name}" will be restored to inactive status and become visible again.`
                  : `"${archiveTarget?.name}" will be archived and hidden from the active groups list. You can restore it later.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={archiveTarget?.status === "archived" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-600 hover:bg-slate-700"}
                onClick={confirmArchive}
              >
                {archiveTarget?.status === "archived" ? "Restore" : "Archive"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ── Delete Confirm ───────────────────────────────────────────────── */}
        <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Bible Study Group?</AlertDialogTitle>
              <AlertDialogDescription>
                "{deleteTarget?.name}" will be permanently removed. This action cannot be undone.
                Consider archiving instead to preserve the record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={confirmDelete}>
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
    </DashboardLayout>
  )
}
