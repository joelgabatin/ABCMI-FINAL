"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  Database,
  FileText,
  Shield,
  Bell,
  Globe,
  Download,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"

// ── Types ──────────────────────────────────────────────────────────────────

interface SiteSettings {
  church_name: string
  acronym: string
  contact_email: string
  contact_phone: string
  address: string
  tagline: string
  enable_chatbot: boolean
  enable_donations: boolean
  maintenance_mode: boolean
  allow_registration: boolean
  backup_frequency: string
  backup_time: string
  retention_days: number
  backup_storage: string
  backup_email_notify: boolean
  twofa_enabled: boolean
  login_attempt_limit: boolean
  session_timeout_minutes: number
  ip_allowlist_enabled: boolean
  notify_new_member: boolean
  notify_prayer_request: boolean
  notify_counseling: boolean
  notify_donation: boolean
  notify_backup: boolean
  notify_failed_login: boolean
  primary_admin_email: string
  secondary_admin_email: string | null
  office_hours: string
  google_maps_embed_url: string
  facebook_url: string
  youtube_url: string
  instagram_url: string
  tiktok_url: string
}

interface BackupRecord {
  id: number
  backed_at: string
  size_mb: number | null
  type: string
  status: string
}

interface LogRecord {
  id: number
  logged_at: string
  level: string
  actor: string
  action: string
  ip_address: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  church_name: "Arise and Build For Christ Ministries Inc.",
  acronym: "ABCMI",
  contact_email: "info@abcmi.org",
  contact_phone: "+63 74 123 4567",
  address: "East Quirino Hill, Baguio City, Philippines",
  tagline: "Building for Christ — from Baguio to the Nations",
  enable_chatbot: true,
  enable_donations: true,
  maintenance_mode: false,
  allow_registration: true,
  backup_frequency: "daily",
  backup_time: "02:00",
  retention_days: 30,
  backup_storage: "local",
  backup_email_notify: true,
  twofa_enabled: false,
  login_attempt_limit: true,
  session_timeout_minutes: 60,
  ip_allowlist_enabled: false,
  notify_new_member: true,
  notify_prayer_request: true,
  notify_counseling: true,
  notify_donation: true,
  notify_backup: true,
  notify_failed_login: false,
  primary_admin_email: "admin@abcmi.org",
  secondary_admin_email: null,
  office_hours: "Mon–Fri: 8AM – 5PM\nSat: 8AM – 12PM",
  google_maps_embed_url: "",
  facebook_url: "",
  youtube_url: "",
  instagram_url: "",
  tiktok_url: "",
}

const logLevelStyles: Record<string, string> = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  error: "bg-red-50 text-red-700 border-red-200",
}
const logLevelIcons: Record<string, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  error: AlertTriangle,
}

function fmt(dateStr: string) {
  try { return format(parseISO(dateStr), "MMM d, yyyy hh:mm a") } catch { return dateStr }
}

// Session timeout: store 0 in DB for "never"
function timeoutToSelect(minutes: number): string {
  return minutes === 0 ? "never" : String(minutes)
}
function selectToTimeout(val: string): number {
  return val === "never" ? 0 : parseInt(val)
}

export default function AdminSettingsPage() {
  const [settings, setSettings]       = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [backups, setBackups]         = useState<BackupRecord[]>([])
  const [logs, setLogs]               = useState<LogRecord[]>([])
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [backupRunning, setBackupRunning] = useState(false)
  const [logFilter, setLogFilter]     = useState("all")

  // ── Load all data on mount ────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then(r => r.json()),
      fetch("/api/settings/backups").then(r => r.json()),
      fetch("/api/settings/logs").then(r => r.json()),
    ]).then(([s, b, l]) => {
      if (s && !s.error) setSettings(s)
      if (Array.isArray(b)) setBackups(b)
      if (Array.isArray(l)) setLogs(l)
    }).catch(() => {
      toast.error("Failed to load settings.")
    }).finally(() => setLoading(false))
  }, [])

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  // ── Save settings ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      toast.success("Settings saved successfully.")
    } catch {
      toast.error("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  // ── Manual backup ─────────────────────────────────────────────────────────
  const handleManualBackup = async () => {
    setBackupRunning(true)
    try {
      const res = await fetch("/api/settings/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "Manual", status: "success" }),
      })
      if (!res.ok) throw new Error()
      const newRecord = await res.json()
      setBackups(prev => [newRecord, ...prev])
      toast.success("Manual backup completed.")
    } catch {
      toast.error("Backup failed.")
    } finally {
      setBackupRunning(false)
    }
  }

  // ── Clear logs ────────────────────────────────────────────────────────────
  const handleClearLogs = async () => {
    try {
      const res = await fetch("/api/settings/logs", { method: "DELETE" })
      if (!res.ok) throw new Error()
      setLogs([])
      toast.success("Logs cleared.")
    } catch {
      toast.error("Failed to clear logs.")
    }
  }

  const filteredLogs = logFilter === "all" ? logs : logs.filter(l => l.level === logFilter)

  const lastBackup = backups[0]
  const nextScheduled = settings.backup_time

  if (loading) {
    return (
      <DashboardLayout variant="admin">
        <main className="min-h-screen bg-[var(--church-light-blue)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
        </main>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8 text-[var(--church-primary)]" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage website configuration, backups, security, and system logs.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-background border border-border p-1 rounded-lg">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> General
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Database className="w-4 h-4" /> Backup
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Logs
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" /> Notifications
            </TabsTrigger>
          </TabsList>

          {/* ── GENERAL ─────────────────────────────────────────────────────── */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Information</CardTitle>
                <CardDescription>Basic details displayed across the website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Church Name</Label>
                    <Input value={settings.church_name} onChange={e => set("church_name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Acronym</Label>
                    <Input value={settings.acronym} onChange={e => set("acronym", e.target.value)} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input type="email" value={settings.contact_email} onChange={e => set("contact_email", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input value={settings.contact_phone} onChange={e => set("contact_phone", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Main Church Address</Label>
                  <Input value={settings.address} onChange={e => set("address", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Website Tagline</Label>
                  <Input value={settings.tagline} onChange={e => set("tagline", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Office Hours</Label>
                  <textarea
                    rows={3}
                    value={settings.office_hours}
                    onChange={e => set("office_hours", e.target.value)}
                    placeholder={"Mon–Fri: 8AM – 5PM\nSat: 8AM – 12PM"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  <p className="text-xs text-muted-foreground">Each line will appear as a separate entry on the website.</p>
                </div>
                <div className="space-y-2">
                  <Label>Google Maps Embed URL</Label>
                  <Input
                    value={settings.google_maps_embed_url}
                    onChange={e => set("google_maps_embed_url", e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the embed URL from Google Maps → Share → Embed a map → copy the <code>src</code> value.
                    This controls the map shown on the Contact page.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Links shown in the footer and Contact page. Leave blank to hide.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Facebook URL</Label>
                    <Input
                      value={settings.facebook_url}
                      onChange={e => set("facebook_url", e.target.value)}
                      placeholder="https://www.facebook.com/abcmi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube URL</Label>
                    <Input
                      value={settings.youtube_url}
                      onChange={e => set("youtube_url", e.target.value)}
                      placeholder="https://www.youtube.com/@abcmi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input
                      value={settings.instagram_url}
                      onChange={e => set("instagram_url", e.target.value)}
                      placeholder="https://www.instagram.com/abcmi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok URL</Label>
                    <Input
                      value={settings.tiktok_url}
                      onChange={e => set("tiktok_url", e.target.value)}
                      placeholder="https://www.tiktok.com/@abcmi"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Preferences</CardTitle>
                <CardDescription>Control the behaviour and visibility of site features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {([
                  { key: "enable_chatbot",    label: "Enable Chatbot",      desc: "Show the AI church assistant widget on public pages." },
                  { key: "enable_donations",  label: "Online Donations",    desc: "Allow members to submit donation information online." },
                  { key: "maintenance_mode",  label: "Maintenance Mode",    desc: "Show a maintenance notice to public visitors." },
                  { key: "allow_registration",label: "Member Registration", desc: "Allow new members to register on the website." },
                ] as { key: keyof SiteSettings; label: string; desc: string }[]).map((item, i) => (
                  <div key={item.key}>
                    {i > 0 && <Separator className="mb-5" />}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={settings[item.key] as boolean}
                        onCheckedChange={v => set(item.key, v)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
              >
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save Changes"}
              </Button>
            </div>
          </TabsContent>

          {/* ── BACKUP ──────────────────────────────────────────────────────── */}
          <TabsContent value="backup" className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Last Backup</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {lastBackup ? format(parseISO(lastBackup.backed_at), "MMM d, yyyy") : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lastBackup ? `${format(parseISO(lastBackup.backed_at), "hh:mm a")} · ${lastBackup.size_mb ? lastBackup.size_mb + " MB" : "—"}` : "No backups yet"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Backups</p>
                  <p className="text-xl font-bold text-foreground mt-1">{backups.length} stored</p>
                  <p className="text-xs text-muted-foreground">Retention: {settings.retention_days} days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Next Scheduled</p>
                  <p className="text-xl font-bold text-foreground mt-1 capitalize">{settings.backup_frequency}</p>
                  <p className="text-xs text-muted-foreground">at {nextScheduled}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
                <CardDescription>Configure automatic backup schedule and retention.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select value={settings.backup_frequency} onValueChange={v => set("backup_frequency", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Backup Time</Label>
                    <Input type="time" value={settings.backup_time} onChange={e => set("backup_time", e.target.value)} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Retention Period</Label>
                    <Select value={String(settings.retention_days)} onValueChange={v => set("retention_days", parseInt(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Backup Storage</Label>
                    <Select value={settings.backup_storage} onValueChange={v => set("backup_storage", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Server</SelectItem>
                        <SelectItem value="cloud">Cloud Storage</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium text-foreground">Email Notification on Backup</p>
                    <p className="text-sm text-muted-foreground">Send a report email after each backup.</p>
                  </div>
                  <Switch checked={settings.backup_email_notify} onCheckedChange={v => set("backup_email_notify", v)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manual Backup</CardTitle>
                    <CardDescription>Create an immediate backup of all website data.</CardDescription>
                  </div>
                  <Button
                    onClick={handleManualBackup}
                    disabled={backupRunning}
                    className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                  >
                    {backupRunning
                      ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Backing up…</>
                      : <><Database className="w-4 h-4 mr-2" /> Run Backup Now</>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {backups.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No backup history yet.</p>
                ) : (
                  <div className="space-y-3">
                    {backups.map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                        <div className="flex items-center gap-3">
                          {b.status === "success"
                            ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            : <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                          <div>
                            <p className="text-sm font-medium text-foreground">{fmt(b.backed_at)}</p>
                            <p className="text-xs text-muted-foreground">
                              {b.type} · {b.size_mb ? b.size_mb + " MB" : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={b.status === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                            {b.status}
                          </Badge>
                          {b.status === "success" && (
                            <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
              >
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save Backup Settings"}
              </Button>
            </div>
          </TabsContent>

          {/* ── LOGS ────────────────────────────────────────────────────────── */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>System Activity Logs</CardTitle>
                    <CardDescription>Track all user and system actions on the platform.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={logFilter} onValueChange={setLogFilter}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleClearLogs}>
                      <Trash2 className="w-4 h-4 mr-2" /> Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No logs to display.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredLogs.map(log => {
                      const Icon = logLevelIcons[log.level] ?? Info
                      return (
                        <div
                          key={log.id}
                          className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border text-sm ${logLevelStyles[log.level] ?? ""}`}
                        >
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Icon className="w-4 h-4" />
                            <Badge variant="outline" className="uppercase text-xs font-semibold border-current">
                              {log.level}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{log.actor}</span>
                            <span className="mx-2 opacity-50">—</span>
                            <span>{log.action}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs opacity-70 flex-shrink-0">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {fmt(log.logged_at)}
                            </span>
                            <span>IP: {log.ip_address}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SECURITY ────────────────────────────────────────────────────── */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Password</CardTitle>
                <CardDescription>Update the admin account password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Enter current password" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <Lock className="w-4 h-4 mr-2" /> Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Manage who can access the admin panel and sensitive features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-muted-foreground">Require a code from the authenticator app on login.</p>
                  </div>
                  <Switch checked={settings.twofa_enabled} onCheckedChange={v => set("twofa_enabled", v)} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Login Attempt Limit</p>
                    <p className="text-sm text-muted-foreground">Lock account after 5 failed login attempts.</p>
                  </div>
                  <Switch checked={settings.login_attempt_limit} onCheckedChange={v => set("login_attempt_limit", v)} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Automatically log out after inactivity.</p>
                  </div>
                  <Select
                    value={timeoutToSelect(settings.session_timeout_minutes)}
                    onValueChange={v => set("session_timeout_minutes", selectToTimeout(v))}
                  >
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">IP Allowlist</p>
                    <p className="text-sm text-muted-foreground">Restrict admin access to specific IP addresses.</p>
                  </div>
                  <Switch checked={settings.ip_allowlist_enabled} onCheckedChange={v => set("ip_allowlist_enabled", v)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Devices currently logged into the admin panel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { device: "Chrome on Windows 11", ip: "192.168.1.10", time: "Active now", current: true },
                  { device: "Safari on iPhone 15",  ip: "192.168.1.22", time: "2 hours ago", current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{session.device}</p>
                        <p className="text-xs text-muted-foreground">{session.ip} · {session.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current && <Badge className="bg-emerald-100 text-emerald-700">Current</Badge>}
                      {!session.current && (
                        <Button variant="outline" size="sm" className="text-destructive">Revoke</Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
              >
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save Security Settings"}
              </Button>
            </div>
          </TabsContent>

          {/* ── NOTIFICATIONS ───────────────────────────────────────────────── */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose which events trigger an email to the admin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {([
                  { key: "notify_new_member",     label: "New Member Registration",  desc: "When a new member signs up." },
                  { key: "notify_prayer_request", label: "New Prayer Request",        desc: "When a member submits a prayer request." },
                  { key: "notify_counseling",     label: "New Counseling Request",    desc: "When a counseling session is requested." },
                  { key: "notify_donation",       label: "New Donation Received",     desc: "When a donation is submitted." },
                  { key: "notify_backup",         label: "Backup Success / Failure",  desc: "After each scheduled backup attempt." },
                  { key: "notify_failed_login",   label: "Failed Login Attempt",      desc: "When someone fails to log in multiple times." },
                ] as { key: keyof SiteSettings; label: string; desc: string }[]).map((item, i) => (
                  <div key={item.key}>
                    {i > 0 && <Separator className="mb-5" />}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={settings[item.key] as boolean}
                        onCheckedChange={v => set(item.key, v)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Recipients</CardTitle>
                <CardDescription>Email addresses that receive admin notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Admin Email</Label>
                  <Input
                    type="email"
                    value={settings.primary_admin_email}
                    onChange={e => set("primary_admin_email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Email (optional)</Label>
                  <Input
                    type="email"
                    value={settings.secondary_admin_email ?? ""}
                    onChange={e => set("secondary_admin_email", e.target.value || null)}
                    placeholder="another@example.com"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save Notification Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
