"use client"

import { useState } from "react"
import {
  BookOpen, Plus, Edit, Trash2, Users, MapPin, Clock,
  Search, Check, Calendar, X, Eye, MessageSquare, ChevronDown
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

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
  maxMembers: number
  status: "active" | "full" | "inactive"
  description: string
  startDate: string
}

interface StudyRequest {
  id: number
  name: string
  email: string
  phone: string
  preferredGroup: string
  message: string
  submittedAt: string
  status: "pending" | "approved" | "declined"
}

const initialGroups: BibleStudyGroup[] = [
  { id: 1, name: "Foundations of Faith", branch: "ABCMI Main Church", leader: "Ptr. Ysrael Coyoy", topic: "Book of Romans", schedule: "Wednesday", time: "7:00 PM", location: "Main Sanctuary", members: 18, maxMembers: 25, status: "active", description: "In-depth study of Paul's letter to the Romans covering grace, faith, and salvation.", startDate: "2024-01-10" },
  { id: 2, name: "Women of the Word", branch: "ABCMI Main Church", leader: "Ptr. Fhey Coyoy", topic: "Proverbs 31 & Women of the Bible", schedule: "Saturday", time: "9:00 AM", location: "Fellowship Hall", members: 22, maxMembers: 30, status: "active", description: "A women's Bible study group focusing on biblical womanhood and practical faith.", startDate: "2024-02-01" },
  { id: 3, name: "Youth Discipleship", branch: "Camp 8 Branch", leader: "Ptr. Julio Coyoy", topic: "Identity in Christ", schedule: "Friday", time: "6:00 PM", location: "Camp 8 Hall", members: 15, maxMembers: 20, status: "active", description: "Bible study for youth focusing on their identity in Christ and purpose in life.", startDate: "2024-01-20" },
  { id: 4, name: "New Believers Class", branch: "ABCMI Main Church", leader: "Ptr. Fhey Coyoy", topic: "Christian Basics & Foundations", schedule: "Sunday", time: "8:00 AM", location: "Room A", members: 8, maxMembers: 15, status: "active", description: "Orientation and basic discipleship class for new believers and church members.", startDate: "2024-03-01" },
  { id: 5, name: "Men's Brotherhood Study", branch: "Kias Branch", leader: "Ptr. Domingo Coyoy", topic: "Book of Proverbs", schedule: "Saturday", time: "7:00 AM", location: "Kias Hall", members: 12, maxMembers: 20, status: "active", description: "Early morning Bible study for men focusing on wisdom and godly leadership.", startDate: "2024-02-10" },
  { id: 6, name: "Couples' Fellowship", branch: "Casacgudan Branch", leader: "Ptr. Rolando Teneza", topic: "Marriage & Family in the Bible", schedule: "Thursday", time: "7:30 PM", location: "Casacgudan Hall", members: 20, maxMembers: 20, status: "full", description: "Bible study for married couples focusing on biblical principles for family life.", startDate: "2024-01-15" },
]

const initialRequests: StudyRequest[] = [
  { id: 1, name: "Maria Santos", email: "maria@example.com", phone: "+63 912 111 1111", preferredGroup: "Foundations of Faith", message: "I want to deepen my understanding of the Bible.", submittedAt: "2024-03-20", status: "pending" },
  { id: 2, name: "Juan dela Cruz", email: "juan@example.com", phone: "+63 912 222 2222", preferredGroup: "Youth Discipleship", message: "My teenager wants to join a youth Bible study.", submittedAt: "2024-03-19", status: "pending" },
  { id: 3, name: "Rosa Reyes", email: "rosa@example.com", phone: "+63 912 333 3333", preferredGroup: "Women of the Word", message: "Looking for a women's group I can join.", submittedAt: "2024-03-18", status: "approved" },
  { id: 4, name: "Pedro Villanueva", email: "pedro@example.com", phone: "+63 912 444 4444", preferredGroup: "Men's Brotherhood Study", message: "Interested in men's study group.", submittedAt: "2024-03-17", status: "approved" },
  { id: 5, name: "Anna Garcia", email: "anna@example.com", phone: "+63 912 555 5555", preferredGroup: "Couples' Fellowship", message: "My husband and I want to join a couples group.", submittedAt: "2024-03-16", status: "declined" },
]

const branches = ["ABCMI Main Church", "Camp 8 Branch", "San Carlos Branch", "Kias Branch", "Patiacan Branch", "Villa Conchita Branch", "Casacgudan Branch"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const emptyGroup: Omit<BibleStudyGroup, "id"> = {
  name: "", branch: "ABCMI Main Church", leader: "", topic: "", schedule: "Wednesday",
  time: "", location: "", members: 0, maxMembers: 20, status: "active", description: "", startDate: ""
}

export default function AdminBibleStudyPage() {
  const [groups, setGroups] = useState<BibleStudyGroup[]>(initialGroups)
  const [requests, setRequests] = useState<StudyRequest[]>(initialRequests)
  const [groupDialog, setGroupDialog] = useState(false)
  const [editingGroup, setEditingGroup] = useState<BibleStudyGroup | null>(null)
  const [groupForm, setGroupForm] = useState<Omit<BibleStudyGroup, "id">>(emptyGroup)
  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [viewGroup, setViewGroup] = useState<BibleStudyGroup | null>(null)

  const openAddGroup = () => { setEditingGroup(null); setGroupForm(emptyGroup); setGroupDialog(true) }
  const openEditGroup = (g: BibleStudyGroup) => {
    setEditingGroup(g)
    setGroupForm({ name: g.name, branch: g.branch, leader: g.leader, topic: g.topic, schedule: g.schedule, time: g.time, location: g.location, members: g.members, maxMembers: g.maxMembers, status: g.status, description: g.description, startDate: g.startDate })
    setGroupDialog(true)
  }
  const saveGroup = () => {
    if (editingGroup) setGroups(prev => prev.map(g => g.id === editingGroup.id ? { ...g, ...groupForm } : g))
    else setGroups(prev => [...prev, { id: Date.now(), ...groupForm }])
    setGroupDialog(false)
  }
  const deleteGroup = (id: number) => { setGroups(prev => prev.filter(g => g.id !== id)); setDeleteGroupId(null) }

  const updateRequest = (id: number, status: StudyRequest["status"]) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))

  const filtered = groups.filter(g =>
    (branchFilter === "all" || g.branch === branchFilter) &&
    (g.name.toLowerCase().includes(search.toLowerCase()) || g.topic.toLowerCase().includes(search.toLowerCase()) || g.leader.toLowerCase().includes(search.toLowerCase()))
  )
  const pendingRequests = requests.filter(r => r.status === "pending")

  const statusColor: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    full: "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30",
    inactive: "bg-muted text-muted-foreground",
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bible Study Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all Bible study groups and study requests from the website.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Groups", value: groups.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10", icon: BookOpen },
            { label: "Active Groups", value: groups.filter(g => g.status === "active").length, color: "text-emerald-600", bg: "bg-emerald-500/10", icon: Check },
            { label: "Total Participants", value: groups.reduce((s, g) => s + g.members, 0), color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15", icon: Users },
            { label: "Pending Requests", value: pendingRequests.length, color: "text-rose-500", bg: "bg-rose-500/10", icon: MessageSquare },
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

        <Tabs defaultValue="groups">
          <TabsList className="mb-6">
            <TabsTrigger value="groups" className="gap-2"><BookOpen className="w-4 h-4" /> Study Groups</TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <MessageSquare className="w-4 h-4" /> Study Requests
              {pendingRequests.length > 0 && <Badge className="ml-1 bg-rose-500 text-white text-xs px-1.5 py-0">{pendingRequests.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* GROUPS TAB */}
          <TabsContent value="groups">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between">
              <div className="flex gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search groups..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="All Branches" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={openAddGroup} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" /> Add Group
              </Button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(group => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
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
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditGroup(group)}><Edit className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteGroupId(group.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <Badge className={`text-xs ${statusColor[group.status]}`}>{group.status}</Badge>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{group.branch}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{group.schedule} &middot; {group.time}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{group.location}</div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-muted-foreground">Leader: <span className="text-foreground font-medium">{group.leader}</span></span>
                      <span className={`font-medium ${group.members >= group.maxMembers ? "text-rose-500" : "text-emerald-600"}`}>
                        {group.members}/{group.maxMembers}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${group.members >= group.maxMembers ? "bg-rose-500" : "bg-[var(--church-primary)]"}`}
                        style={{ width: `${Math.min((group.members / group.maxMembers) * 100, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full">
                  <Card><CardContent className="p-12 text-center text-muted-foreground">No study groups found.</CardContent></Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* REQUESTS TAB */}
          <TabsContent value="requests">
            <div className="space-y-3">
              {requests.length === 0 ? (
                <Card><CardContent className="p-12 text-center text-muted-foreground">No study requests found.</CardContent></Card>
              ) : requests.map(req => (
                <Card key={req.id} className={req.status === "pending" ? "border-[var(--church-gold)]/40" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                          {req.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-medium text-foreground">{req.name}</p>
                          <Badge className={
                            req.status === "pending" ? "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30" :
                            req.status === "approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                            "bg-muted text-muted-foreground"
                          }>{req.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{req.email} &middot; {req.phone}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Requested: <span className="font-medium text-foreground">{req.preferredGroup}</span></p>
                        {req.message && <p className="text-sm text-foreground mt-2 italic">"{req.message}"</p>}
                        <p className="text-xs text-muted-foreground mt-1">Submitted: {req.submittedAt}</p>
                      </div>
                      {req.status === "pending" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" className="gap-1 bg-emerald-500 hover:bg-emerald-600 text-white h-8" onClick={() => updateRequest(req.id, "approved")}>
                            <Check className="w-3.5 h-3.5" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 border-destructive text-destructive hover:bg-destructive/10 h-8" onClick={() => updateRequest(req.id, "declined")}>
                            <X className="w-3.5 h-3.5" /> Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Group Dialog */}
        <Dialog open={groupDialog} onOpenChange={setGroupDialog}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingGroup ? "Edit Bible Study Group" : "Add New Bible Study Group"}</DialogTitle>
              <DialogDescription>Fill in the group details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Group Name</Label>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Leader / Pastor</Label>
                <Input value={groupForm.leader} onChange={e => setGroupForm(p => ({ ...p, leader: e.target.value }))} placeholder="e.g. Ptr. Juan dela Cruz" />
              </div>
              <div className="space-y-1.5">
                <Label>Study Topic / Book</Label>
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
                  <Input type="number" value={groupForm.maxMembers} onChange={e => setGroupForm(p => ({ ...p, maxMembers: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={groupForm.description} onChange={e => setGroupForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of this study group..." rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={groupForm.startDate} onChange={e => setGroupForm(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setGroupDialog(false)}>Cancel</Button>
                <Button onClick={saveGroup} className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  {editingGroup ? "Save Changes" : "Add Group"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={deleteGroupId !== null} onOpenChange={() => setDeleteGroupId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Bible Study Group?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this study group. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteGroupId && deleteGroup(deleteGroupId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
