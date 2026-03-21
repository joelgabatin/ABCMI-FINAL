"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield, Users, Search, CheckCircle, Lock, Unlock, Settings,
  Eye, FileText, BarChart3, MessageSquare, Heart, DollarSign,
  Calendar, BookOpen, Star, Radio, MapPin, GraduationCap, Mail,
  Church, Plus, Pencil, X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Permission definitions ──────────────────────────────────────────────────
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

// ── Preset roles ─────────────────────────────────────────────────────────────
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

type UserRecord = {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
  active: boolean
}

const sampleUsers: UserRecord[] = [
  { id: 1, name: "Admin User", email: "admin@church.org", role: "Super Admin", permissions: allPermKeys, active: true },
  { id: 2, name: "Ptr. Julio Coyoy", email: "julio@abcmi.org", role: "Pastor", permissions: rolePresets.Pastor, active: true },
  { id: 3, name: "Ptr. Fhey Coyoy", email: "fhey@abcmi.org", role: "Pastor", permissions: rolePresets.Pastor, active: true },
  { id: 4, name: "Josie Perilla", email: "josie@abcmi.org", role: "Ministry Leader", permissions: rolePresets["Ministry Leader"], active: true },
  { id: 5, name: "Treasurer Santos", email: "treasurer@abcmi.org", role: "Treasurer", permissions: rolePresets.Treasurer, active: true },
  { id: 6, name: "John Member", email: "john@example.com", role: "Volunteer", permissions: rolePresets.Volunteer, active: true },
]

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Permission Editor Dialog ─────────────────────────────────────────────────
function PermissionEditor({ user, onSave, onClose }: {
  user: UserRecord
  onSave: (id: number, perms: string[], role: string) => void
  onClose: () => void
}) {
  const [perms, setPerms] = useState<string[]>(user.permissions)
  const [role, setRole] = useState(user.role)

  function toggle(key: string) {
    setPerms(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key])
  }

  function applyPreset(presetName: string) {
    setRole(presetName)
    setPerms(rolePresets[presetName] ?? [])
  }

  function selectAll() { setPerms(allPermKeys) }
  function clearAll() { setPerms([]) }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
      {/* User info */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] font-semibold">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Role presets */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">Apply Role Preset</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(rolePresets).map(preset => (
            <Button key={preset} size="sm" variant={role === preset ? "default" : "outline"}
              className={cn(role === preset && "bg-[var(--church-primary)] text-white")}
              onClick={() => applyPreset(preset)}>
              {preset}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={selectAll} className="gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Select All</Button>
          <Button size="sm" variant="outline" onClick={clearAll} className="gap-1.5"><X className="w-3.5 h-3.5" /> Clear All</Button>
        </div>
      </div>

      <Separator />

      {/* Permission groups */}
      <div className="space-y-6">
        {permissionGroups.map(group => (
          <div key={group.group}>
            <div className="flex items-center gap-2 mb-3">
              <group.icon className="w-4 h-4 text-[var(--church-primary)]" />
              <p className="text-sm font-semibold text-foreground">{group.group}</p>
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

      <DialogFooter className="pt-4 sticky bottom-0 bg-background border-t border-border pb-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
          onClick={() => { onSave(user.id, perms, role); onClose() }}>
          <CheckCircle className="w-4 h-4 mr-2" /> Save Permissions
        </Button>
      </DialogFooter>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPermissionsPage() {
  const [users, setUsers] = useState<UserRecord[]>(sampleUsers)
  const [search, setSearch] = useState("")
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  function savePermissions(id: number, perms: string[], role: string) {
    setUsers(p => p.map(u => u.id === id ? { ...u, permissions: perms, role } : u))
  }

  function toggleActive(id: number) {
    setUsers(p => p.map(u => u.id === id ? { ...u, active: !u.active } : u))
  }

  return (
    <DashboardLayout variant="admin" title="Permissions">
      <main className="p-6">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Permissions</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Grant or revoke feature access for any user in the system.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: users.length, icon: Users, color: "text-[var(--church-primary)]" },
            { label: "Super Admins", value: users.filter(u => u.role === "Super Admin").length, icon: Shield, color: "text-rose-500" },
            { label: "Pastors", value: users.filter(u => u.role === "Pastor").length, icon: Church, color: "text-emerald-600" },
            { label: "Active", value: users.filter(u => u.active).length, icon: CheckCircle, color: "text-green-600" },
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

        {/* Role legend */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Role Presets</CardTitle>
            <CardDescription className="text-xs">Quick reference for what each role can do by default.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(rolePresets).map(([role, perms]) => (
                <div key={role} className="flex items-center gap-2 border border-border rounded-full px-3 py-1.5 text-sm">
                  <Shield className="w-3.5 h-3.5 text-[var(--church-primary)]" />
                  <span className="font-medium text-foreground">{role}</span>
                  <span className="text-muted-foreground text-xs">({perms.length} permissions)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users by name, email or role..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* User list */}
        <div className="space-y-3">
          {filtered.map(u => (
            <Card key={u.id} className={cn("border border-border transition-opacity", !u.active && "opacity-50")}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] font-semibold text-sm">{getInitials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-semibold text-foreground">{u.name}</p>
                      <Badge className={cn("text-xs border-none", u.role === "Super Admin" ? "bg-rose-100 text-rose-700" : u.role === "Pastor" ? "bg-[var(--church-primary)]/10 text-[var(--church-primary)]" : "bg-gray-100 text-gray-600")}>
                        {u.role}
                      </Badge>
                      {!u.active && <Badge className="text-xs border-none bg-gray-100 text-gray-500">Inactive</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">{u.permissions.length} of {allPermKeys.length} permissions granted</p>
                  </div>

                  {/* Permission pills preview */}
                  <div className="hidden lg:flex items-center gap-1.5 flex-wrap max-w-xs">
                    {permissionGroups.map(g => {
                      const count = g.permissions.filter(p => u.permissions.includes(p.key)).length
                      if (count === 0) return null
                      return (
                        <div key={g.group} className="flex items-center gap-1 text-xs bg-muted rounded-full px-2 py-0.5">
                          <g.icon className="w-3 h-3 text-[var(--church-primary)]" />
                          <span>{count}/{g.permissions.length}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="gap-1.5"
                      onClick={() => toggleActive(u.id)}>
                      {u.active ? <><Lock className="w-3.5 h-3.5" /> Deactivate</> : <><Unlock className="w-3.5 h-3.5" /> Activate</>}
                    </Button>
                    <Dialog open={editTarget?.id === u.id} onOpenChange={open => !open && setEditTarget(null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-1.5"
                          onClick={() => setEditTarget(u)}>
                          <Pencil className="w-3.5 h-3.5" /> Edit Permissions
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Edit Permissions — {u.name}</DialogTitle>
                        </DialogHeader>
                        {editTarget?.id === u.id && (
                          <PermissionEditor user={editTarget} onSave={savePermissions} onClose={() => setEditTarget(null)} />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </DashboardLayout>
  )
}
