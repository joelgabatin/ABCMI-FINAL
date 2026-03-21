"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import {
  Shield, Users, Search, CheckCircle, Settings,
  FileText, BarChart3, MessageSquare, Heart, DollarSign,
  Calendar, BookOpen, Star, Radio, MapPin, GraduationCap, Mail,
  Church, X, Crown, AlertCircle, UserPlus, ChevronRight, Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Permission definitions ─────────────────────────────────────────────────────
const permissionGroups = [
  {
    group: "Members",
    icon: Users,
    permissions: [
      { key: "view_members", label: "View Members", description: "See the member list" },
      { key: "edit_members", label: "Edit Members", description: "Update member profiles" },
      { key: "delete_members", label: "Delete Members", description: "Remove members from the system" },
      { key: "accept_members", label: "Accept Members", description: "Approve member registrations" },
    ],
  },
  {
    group: "Content & Website",
    icon: FileText,
    permissions: [
      { key: "manage_content", label: "Manage Content", description: "Edit website pages (About, Mission, etc.)" },
      { key: "manage_events", label: "Manage Events", description: "Create, edit and delete events" },
      { key: "manage_devotion", label: "Daily Devotion", description: "Publish and edit daily devotionals" },
      { key: "manage_live", label: "Facebook Live", description: "Control live stream settings" },
    ],
  },
  {
    group: "Ministries & Branches",
    icon: Church,
    permissions: [
      { key: "manage_ministries", label: "Manage Ministries", description: "Create and edit ministry pages" },
      { key: "manage_branches", label: "Manage Branches", description: "Add, edit and remove branches" },
      { key: "assign_pastors", label: "Assign Pastors", description: "Assign pastors to branches" },
      { key: "view_branches", label: "View All Branches", description: "View all branch data" },
    ],
  },
  {
    group: "Pastoral & Counseling",
    icon: Heart,
    permissions: [
      { key: "view_prayers", label: "View Prayer Requests", description: "Access all prayer requests" },
      { key: "respond_prayers", label: "Respond to Prayers", description: "Send pastoral responses to prayers" },
      { key: "manage_counseling", label: "Manage Counseling", description: "View and respond to counseling requests" },
      { key: "view_testimony", label: "View Testimonies", description: "Access all submitted testimonies" },
      { key: "feature_testimony", label: "Feature Testimonies", description: "Set testimonies as featured on website" },
    ],
  },
  {
    group: "Finance",
    icon: DollarSign,
    permissions: [
      { key: "view_donations", label: "View Donations", description: "See donation records and history" },
      { key: "view_member_donations", label: "View Member Donations", description: "See individual giving records" },
      { key: "export_donations", label: "Export Donations", description: "Download donation reports" },
    ],
  },
  {
    group: "Training & Bible Study",
    icon: GraduationCap,
    permissions: [
      { key: "manage_training", label: "Manage Missions Training", description: "Create and manage training programs" },
      { key: "manage_registrations", label: "Manage Registrations", description: "Accept/deny training registrations" },
      { key: "manage_bible_study", label: "Manage Bible Study", description: "Manage Bible study groups and requests" },
    ],
  },
  {
    group: "Reports & Analytics",
    icon: BarChart3,
    permissions: [
      { key: "view_reports", label: "View Reports", description: "Access analytics and reports" },
      { key: "export_reports", label: "Export Reports", description: "Download report data" },
    ],
  },
  {
    group: "Administration",
    icon: Settings,
    permissions: [
      { key: "manage_settings", label: "Manage Settings", description: "Access and change system settings" },
      { key: "manage_permissions", label: "Manage Permissions", description: "Grant/revoke permissions for other users" },
      { key: "manage_messages", label: "Manage Messages", description: "Read and reply to contact messages" },
      { key: "view_logs", label: "View System Logs", description: "Access activity and error logs" },
      { key: "manage_backups", label: "Manage Backups", description: "Create and restore system backups" },
    ],
  },
]

const allPermKeys = permissionGroups.flatMap(g => g.permissions.map(p => p.key))

// ── Presets ──────────────────────────────────────────────────────────────────
const rolePresets: Record<string, string[]> = {
  "Super Admin": allPermKeys,
  Pastor: [
    "view_members", "edit_members", "accept_members", "view_prayers", "respond_prayers",
    "manage_counseling", "view_testimony", "view_branches", "view_reports",
    "manage_bible_study", "manage_training", "manage_registrations",
  ],
  "Ministry Leader": [
    "view_members", "manage_events", "view_prayers", "respond_prayers",
    "view_testimony", "manage_bible_study",
  ],
  Treasurer: ["view_donations", "view_member_donations", "export_donations", "view_reports", "export_reports"],
  Volunteer: ["view_members", "view_prayers", "manage_events"],
}

// ── Types ─────────────────────────────────────────────────────────────────────
type UserRecord = {
  id: number
  name: string
  email: string
  branch?: string
  role: string
  permissions: string[]
  active: boolean
  isAdmin: boolean
  joinedDate?: string
}

// ── Admin users ───────────────────────────────────────────────────────────────
const initialAdminUsers: UserRecord[] = [
  { id: 1, name: "Admin User", email: "admin@church.org", role: "Super Admin", permissions: allPermKeys, active: true, isAdmin: true },
  { id: 2, name: "Ptr. Julio Coyoy", email: "julio@abcmi.org", branch: "ABCMI Main Church", role: "Pastor", permissions: rolePresets.Pastor, active: true, isAdmin: true },
  { id: 3, name: "Ptr. Fhey Coyoy", email: "fhey@abcmi.org", branch: "ABCMI Main Church", role: "Pastor", permissions: rolePresets.Pastor, active: true, isAdmin: true },
  { id: 4, name: "Josie Perilla", email: "josie@abcmi.org", branch: "Villa Conchita, Manabo", role: "Ministry Leader", permissions: rolePresets["Ministry Leader"], active: true, isAdmin: true },
  { id: 5, name: "Treasurer Santos", email: "treasurer@abcmi.org", branch: "ABCMI Main Church", role: "Treasurer", permissions: rolePresets.Treasurer, active: true, isAdmin: true },
]

// ── Member pool (not yet admins) ──────────────────────────────────────────────
const memberPool: UserRecord[] = [
  { id: 10, name: "John Member", email: "john@example.com", branch: "ABCMI Main Church", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Jan 15, 2024" },
  { id: 11, name: "Maria Santos", email: "maria.santos@gmail.com", branch: "Camp 8, Baguio City", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Mar 3, 2024" },
  { id: 12, name: "Carlos Reyes", email: "carlos.r@gmail.com", branch: "Kias, Baguio City", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Feb 20, 2024" },
  { id: 13, name: "Ana Rivera", email: "ana.rivera@gmail.com", branch: "San Juan, Abra", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Apr 5, 2024" },
  { id: 14, name: "Pedro Cruz", email: "pedro.cruz@gmail.com", branch: "Dalic, Bontoc", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Jan 28, 2024" },
  { id: 15, name: "Rosa Dela Cruz", email: "rosa.dc@gmail.com", branch: "Ansagan, Tuba", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "May 10, 2024" },
  { id: 16, name: "Emmanuel Tan", email: "eitan@gmail.com", branch: "Dianawan, Aurora", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Jun 1, 2024" },
  { id: 17, name: "Grace Lim", email: "grace.lim@gmail.com", branch: "ABCMI Main Church", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Mar 18, 2024" },
  { id: 18, name: "Joseph Aguilar", email: "jose.ag@gmail.com", branch: "San Carlos, Baguio", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Feb 7, 2024" },
  { id: 19, name: "Faith Buenaventura", email: "faith.b@gmail.com", branch: "Casacgudan, Manabo", role: "Member", permissions: [], active: true, isAdmin: false, joinedDate: "Jul 14, 2024" },
]

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Permission Editor ────────────────────────────────────────────────────────
function PermissionEditor({ user, onSave, onClose }: {
  user: UserRecord
  onSave: (id: number, perms: string[], role: string) => void
  onClose: () => void
}) {
  const [perms, setPerms] = useState<string[]>(user.permissions)
  const [role, setRole] = useState(user.role === "Member" ? "Volunteer" : user.role)

  function toggle(key: string) {
    setPerms(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key])
  }
  function applyPreset(presetName: string) { setRole(presetName); setPerms(rolePresets[presetName] ?? []) }
  function selectAll() { setPerms(allPermKeys) }
  function clearAll() { setPerms([]) }

  return (
    <div className="space-y-6">
      {/* User info */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Avatar className="w-11 h-11">
          <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] font-bold">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.branch && <p className="text-xs text-muted-foreground">{user.branch}</p>}
        </div>
        <Badge className="ml-auto bg-amber-100 text-amber-700 border-none gap-1">
          <Crown className="w-3 h-3" /> Admin
        </Badge>
      </div>

      {/* Role presets */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">Apply Role Preset</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(rolePresets).map(preset => (
            <Button key={preset} size="sm" variant={role === preset ? "default" : "outline"}
              className={cn(role === preset && "bg-[var(--church-primary)] text-white")}
              onClick={() => applyPreset(preset)}>{preset}</Button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={selectAll} className="gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Select All</Button>
          <Button size="sm" variant="outline" onClick={clearAll} className="gap-1.5"><X className="w-3.5 h-3.5" /> Clear All</Button>
        </div>
      </div>

      <Separator />

      {/* Permission groups */}
      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1">
        {permissionGroups.map(group => (
          <div key={group.group}>
            <div className="flex items-center gap-2 mb-3">
              <group.icon className="w-4 h-4 text-[var(--church-primary)]" />
              <p className="text-sm font-semibold text-foreground">{group.group}</p>
              <span className="text-xs text-muted-foreground ml-auto">
                {group.permissions.filter(p => perms.includes(p.key)).length}/{group.permissions.length}
              </span>
            </div>
            <div className="space-y-2">
              {group.permissions.map(p => (
                <div key={p.key} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  <Switch checked={perms.includes(p.key)} onCheckedChange={() => toggle(p.key)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2"
          onClick={() => { onSave(user.id, perms, role); onClose() }}>
          <CheckCircle className="w-4 h-4" /> Save Permissions
        </Button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPermissionsPage() {
  const [adminUsers, setAdminUsers] = useState<UserRecord[]>(initialAdminUsers)
  const [members, setMembers] = useState<UserRecord[]>(memberPool)

  // search states
  const [adminSearch, setAdminSearch] = useState("")
  const [memberSearch, setMemberSearch] = useState("")

  // dialog states
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null)
  const [promoteTarget, setPromoteTarget] = useState<UserRecord | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<UserRecord | null>(null)

  const filteredAdmins = adminUsers.filter(u =>
    u.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(adminSearch.toLowerCase())
  )

  const filteredMembers = members.filter(u =>
    u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    (u.branch ?? "").toLowerCase().includes(memberSearch.toLowerCase())
  )

  function savePermissions(id: number, perms: string[], role: string) {
    setAdminUsers(p => p.map(u => u.id === id ? { ...u, permissions: perms, role } : u))
  }

  function toggleActive(id: number) {
    setAdminUsers(p => p.map(u => u.id === id ? { ...u, active: !u.active } : u))
  }

  function promoteToAdmin(member: UserRecord, perms: string[], role: string) {
    const promoted: UserRecord = { ...member, isAdmin: true, role, permissions: perms }
    setAdminUsers(p => [...p, promoted])
    setMembers(p => p.filter(m => m.id !== member.id))
  }

  function revokeAdmin(id: number) {
    const user = adminUsers.find(u => u.id === id)
    if (!user) return
    if (user.role === "Super Admin") return // protect super admin
    const revoked: UserRecord = { ...user, isAdmin: false, role: "Member", permissions: [] }
    setMembers(p => [...p, revoked])
    setAdminUsers(p => p.filter(u => u.id !== id))
  }

  // ── Promote flow — two step: confirm → permission editor ─────────────────
  const [promoteStep, setPromoteStep] = useState<"confirm" | "permissions">("confirm")
  const [promotePerms, setPromotePerms] = useState<string[]>([])
  const [promoteRole, setPromoteRole] = useState("Volunteer")

  function openPromote(member: UserRecord) {
    setPromoteTarget(member)
    setPromoteStep("confirm")
    setPromotePerms(rolePresets.Volunteer)
    setPromoteRole("Volunteer")
  }

  function confirmPromote() { setPromoteStep("permissions") }

  function finalizePromote() {
    if (!promoteTarget) return
    promoteToAdmin(promoteTarget, promotePerms, promoteRole)
    setPromoteTarget(null)
  }

  return (
    <DashboardLayout variant="admin" title="Permissions">
      <main className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search members to promote them to admin roles, then grant specific feature access.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: adminUsers.length + members.length, icon: Users, color: "text-[var(--church-primary)]" },
            { label: "Admins", value: adminUsers.length, icon: Crown, color: "text-amber-500" },
            { label: "Members", value: members.length, icon: Users, color: "text-gray-500" },
            { label: "Active Admins", value: adminUsers.filter(u => u.active).length, icon: CheckCircle, color: "text-green-600" },
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

        <Tabs defaultValue="admins">
          <TabsList className="mb-2">
            <TabsTrigger value="admins" className="gap-2">
              <Crown className="w-4 h-4" /> Admin Users
              <Badge className="bg-amber-100 text-amber-700 border-none ml-1">{adminUsers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <UserPlus className="w-4 h-4" /> Promote Member
              <Badge className="bg-gray-100 text-gray-600 border-none ml-1">{members.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── ADMIN USERS TAB ───────────────────────────────────────────── */}
          <TabsContent value="admins" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search admins by name, email or role..." className="pl-9"
                value={adminSearch} onChange={e => setAdminSearch(e.target.value)} />
            </div>

            {filteredAdmins.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No admin users match your search.</div>
            )}

            <div className="space-y-3">
              {filteredAdmins.map(u => (
                <Card key={u.id} className={cn("border transition-opacity", !u.active && "opacity-60")}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-11 h-11 flex-shrink-0">
                        <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] font-bold text-sm">{getInitials(u.name)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground">{u.name}</p>
                          <Badge className={cn("text-xs border-none gap-1",
                            u.role === "Super Admin" ? "bg-[var(--church-primary)]/10 text-[var(--church-primary)]" : "bg-amber-100 text-amber-700"
                          )}>
                            <Crown className="w-3 h-3" /> {u.role}
                          </Badge>
                          {!u.active && <Badge className="text-xs border-none bg-gray-100 text-gray-500">Inactive</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        {u.branch && <p className="text-xs text-muted-foreground">{u.branch}</p>}

                        {/* Permission summary pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {permissionGroups.map(g => {
                            const count = g.permissions.filter(p => u.permissions.includes(p.key)).length
                            if (count === 0) return null
                            return (
                              <div key={g.group} className="flex items-center gap-1 text-xs bg-muted rounded-full px-2 py-0.5">
                                <g.icon className="w-3 h-3 text-[var(--church-primary)]" />
                                <span className="text-muted-foreground">{g.group.split(" ")[0]}</span>
                                <span className="font-medium">{count}/{g.permissions.length}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                        <Button size="sm" variant="outline" className="gap-1.5"
                          onClick={() => setEditTarget(u)}>
                          <Shield className="w-3.5 h-3.5" /> Edit Permissions
                        </Button>
                        <Button size="sm" variant="outline"
                          className={cn("gap-1.5", u.active ? "text-gray-600" : "text-green-600")}
                          onClick={() => toggleActive(u.id)}>
                          {u.active ? <Lock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          {u.active ? "Deactivate" : "Activate"}
                        </Button>
                        {u.role !== "Super Admin" && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-red-500 hover:text-red-600 hover:border-red-300"
                            onClick={() => revokeAdmin(u.id)}>
                            <X className="w-3.5 h-3.5" /> Revoke Admin
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── PROMOTE MEMBER TAB ───────────────────────────────────────── */}
          <TabsContent value="members" className="space-y-4">
            <Card className="border-[var(--church-primary)]/20 bg-[var(--church-primary)]/5">
              <CardContent className="p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-0.5">How promotion works</p>
                  <p className="text-muted-foreground">Search for a member below. When you promote them, you will immediately set their role and grant specific permissions. They will gain access to the admin dashboard only for the features you enable.</p>
                </div>
              </CardContent>
            </Card>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search members by name, email or branch..." className="pl-9"
                value={memberSearch} onChange={e => setMemberSearch(e.target.value)} />
            </div>

            {memberSearch.length > 0 && filteredMembers.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">No members found matching &quot;{memberSearch}&quot;</div>
            )}

            {memberSearch.length === 0 && (
              <p className="text-center py-6 text-muted-foreground text-sm">Start typing to search for a member to promote.</p>
            )}

            {filteredMembers.length > 0 && (
              <div className="space-y-3">
                {filteredMembers.map(m => (
                  <Card key={m.id} className="border border-border hover:border-[var(--church-primary)]/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold text-sm">{getInitials(m.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{m.name}</p>
                          <p className="text-sm text-muted-foreground">{m.email}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {m.branch && <p className="text-xs text-muted-foreground">{m.branch}</p>}
                            {m.joinedDate && <p className="text-xs text-muted-foreground">Joined {m.joinedDate}</p>}
                          </div>
                        </div>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white gap-2 flex-shrink-0"
                          onClick={() => openPromote(m)}>
                          <Crown className="w-3.5 h-3.5" /> Promote to Admin
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Edit Permissions Dialog ──────────────────────────────────────────── */}
      <Dialog open={!!editTarget} onOpenChange={open => !open && setEditTarget(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--church-primary)]" /> Edit Permissions
            </DialogTitle>
            <DialogDescription>Manage feature access for this admin user.</DialogDescription>
          </DialogHeader>
          {editTarget && (
            <PermissionEditor
              user={editTarget}
              onSave={savePermissions}
              onClose={() => setEditTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Promote Dialog (2-step) ──────────────────────────────────────────── */}
      <Dialog open={!!promoteTarget} onOpenChange={open => !open && setPromoteTarget(null)}>
        <DialogContent className="max-w-2xl">
          {promoteTarget && promoteStep === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" /> Promote to Admin
                </DialogTitle>
                <DialogDescription>
                  Step 1 of 2 — Confirm promotion of <strong>{promoteTarget.name}</strong>
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-bold">{getInitials(promoteTarget.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{promoteTarget.name}</p>
                    <p className="text-sm text-muted-foreground">{promoteTarget.email}</p>
                    {promoteTarget.branch && <p className="text-xs text-muted-foreground">{promoteTarget.branch}</p>}
                  </div>
                  <ChevronRight className="mx-2 text-muted-foreground" />
                  <Badge className="bg-amber-100 text-amber-700 border-none gap-1 text-sm px-3 py-1">
                    <Crown className="w-3.5 h-3.5" /> Admin
                  </Badge>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold mb-1">After promotion:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>User gains access to the admin dashboard</li>
                      <li>You will set their role and permissions in the next step</li>
                      <li>You can revoke admin status anytime</li>
                    </ul>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPromoteTarget(null)}>Cancel</Button>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2" onClick={confirmPromote}>
                  <ChevronRight className="w-4 h-4" /> Next: Set Permissions
                </Button>
              </DialogFooter>
            </>
          )}

          {promoteTarget && promoteStep === "permissions" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[var(--church-primary)]" /> Set Permissions
                </DialogTitle>
                <DialogDescription>
                  Step 2 of 2 — Choose what <strong>{promoteTarget.name}</strong> can access as an admin.
                </DialogDescription>
              </DialogHeader>

              {/* Inline permission editor (reused logic, inlined for two-step flow) */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-amber-100 text-amber-700 font-bold text-sm">{getInitials(promoteTarget.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{promoteTarget.name}</p>
                    <p className="text-xs text-muted-foreground">{promoteTarget.email}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-none gap-1 text-xs">
                    <Crown className="w-3 h-3" /> Admin
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Role Preset</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(rolePresets).map(preset => (
                      <Button key={preset} size="sm" variant={promoteRole === preset ? "default" : "outline"}
                        className={cn(promoteRole === preset && "bg-[var(--church-primary)] text-white")}
                        onClick={() => { setPromoteRole(preset); setPromotePerms(rolePresets[preset]) }}>
                        {preset}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setPromotePerms(allPermKeys)} className="gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> All</Button>
                    <Button size="sm" variant="outline" onClick={() => setPromotePerms([])} className="gap-1.5"><X className="w-3.5 h-3.5" /> None</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                  {permissionGroups.map(group => (
                    <div key={group.group}>
                      <div className="flex items-center gap-2 mb-2">
                        <group.icon className="w-4 h-4 text-[var(--church-primary)]" />
                        <p className="text-sm font-semibold">{group.group}</p>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {group.permissions.filter(p => promotePerms.includes(p.key)).length}/{group.permissions.length}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {group.permissions.map(p => (
                          <div key={p.key} className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors">
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{p.label}</p>
                              <p className="text-xs text-muted-foreground">{p.description}</p>
                            </div>
                            <Switch
                              checked={promotePerms.includes(p.key)}
                              onCheckedChange={() => setPromotePerms(prev =>
                                prev.includes(p.key) ? prev.filter(k => k !== p.key) : [...prev, p.key]
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="border-t border-border pt-4">
                <Button variant="outline" onClick={() => setPromoteStep("confirm")}>Back</Button>
                <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2"
                  onClick={finalizePromote}>
                  <CheckCircle className="w-4 h-4" /> Confirm &amp; Promote
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
