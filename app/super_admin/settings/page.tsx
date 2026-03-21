"use client"

import { useState } from "react"
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
  Mail,
  Smartphone,
  Eye,
  EyeOff,
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
import { Textarea } from "@/components/ui/textarea"

// --- Sample data ---
const backupHistory = [
  { id: 1, date: "2025-03-20 02:00 AM", size: "14.2 MB", type: "Automatic", status: "success" },
  { id: 2, date: "2025-03-19 02:00 AM", size: "13.9 MB", type: "Automatic", status: "success" },
  { id: 3, date: "2025-03-18 02:00 AM", size: "13.7 MB", type: "Automatic", status: "success" },
  { id: 4, date: "2025-03-17 11:30 AM", size: "13.5 MB", type: "Manual", status: "success" },
  { id: 5, date: "2025-03-16 02:00 AM", size: "13.2 MB", type: "Automatic", status: "failed" },
  { id: 6, date: "2025-03-15 02:00 AM", size: "12.8 MB", type: "Automatic", status: "success" },
]

const systemLogs = [
  { id: 1, time: "2025-03-21 09:45:12", level: "info", user: "Admin", action: "Logged in", ip: "192.168.1.10" },
  { id: 2, time: "2025-03-21 09:50:33", level: "info", user: "Admin", action: "Updated prayer request #42", ip: "192.168.1.10" },
  { id: 3, time: "2025-03-21 10:02:18", level: "warning", user: "System", action: "Backup attempt delayed by 5 minutes", ip: "—" },
  { id: 4, time: "2025-03-21 10:15:44", level: "info", user: "Admin", action: "Added new event: Easter Sunday Celebration", ip: "192.168.1.10" },
  { id: 5, time: "2025-03-21 10:30:07", level: "info", user: "Member #18", action: "Submitted prayer request", ip: "192.168.1.55" },
  { id: 6, time: "2025-03-21 10:45:22", level: "error", user: "System", action: "Email notification failed for user #23", ip: "—" },
  { id: 7, time: "2025-03-21 11:00:00", level: "info", user: "System", action: "Automatic backup completed successfully", ip: "—" },
  { id: 8, time: "2025-03-21 11:12:38", level: "info", user: "Admin", action: "Deleted event: Cancelled Workshop", ip: "192.168.1.10" },
  { id: 9, time: "2025-03-21 11:30:55", level: "warning", user: "Member #7", action: "Failed login attempt (wrong password)", ip: "203.45.12.88" },
  { id: 10, time: "2025-03-21 11:45:01", level: "info", user: "Admin", action: "Exported member list", ip: "192.168.1.10" },
]

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

export default function AdminSettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [backupRunning, setBackupRunning] = useState(false)
  const [logFilter, setLogFilter] = useState("all")
  const [saved, setSaved] = useState(false)

  const handleManualBackup = () => {
    setBackupRunning(true)
    setTimeout(() => setBackupRunning(false), 2500)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const filteredLogs = logFilter === "all"
    ? systemLogs
    : systemLogs.filter((l) => l.level === logFilter)

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
              <Globe className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* ── GENERAL ── */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Information</CardTitle>
                <CardDescription>Basic details displayed across the website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="church-name">Church Name</Label>
                    <Input id="church-name" defaultValue="Arise and Build For Christ Ministries Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="church-acronym">Acronym</Label>
                    <Input id="church-acronym" defaultValue="ABCMI" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="church-email">Contact Email</Label>
                    <Input id="church-email" type="email" defaultValue="info@abcmi.org" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="church-phone">Contact Phone</Label>
                    <Input id="church-phone" defaultValue="+63 74 123 4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="church-address">Main Church Address</Label>
                  <Input id="church-address" defaultValue="East Quirino Hill, Baguio City, Philippines" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="church-tagline">Website Tagline</Label>
                  <Input id="church-tagline" defaultValue="Building for Christ — from Baguio to the Nations" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Preferences</CardTitle>
                <CardDescription>Control the behaviour and visibility of site features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Enable Chatbot</p>
                    <p className="text-sm text-muted-foreground">Show the AI church assistant widget on public pages.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Online Donations</p>
                    <p className="text-sm text-muted-foreground">Allow members to submit donation information online.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Show a maintenance notice to public visitors.</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Member Registration</p>
                    <p className="text-sm text-muted-foreground">Allow new members to register on the website.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
              >
                {saved ? (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Saved</>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </TabsContent>

          {/* ── BACKUP ── */}
          <TabsContent value="backup" className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Last Backup</p>
                  <p className="text-xl font-bold text-foreground mt-1">Mar 20, 2025</p>
                  <p className="text-xs text-muted-foreground">02:00 AM — 14.2 MB</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Backups</p>
                  <p className="text-xl font-bold text-foreground mt-1">6 stored</p>
                  <p className="text-xs text-muted-foreground">Retention: 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Next Scheduled</p>
                  <p className="text-xl font-bold text-foreground mt-1">Mar 21, 2025</p>
                  <p className="text-xs text-muted-foreground">02:00 AM — Daily</p>
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
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Input type="time" defaultValue="02:00" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Retention Period</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Select defaultValue="local">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                  <Switch defaultChecked />
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
                    {backupRunning ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Backing up…</>
                    ) : (
                      <><Database className="w-4 h-4 mr-2" /> Run Backup Now</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backupHistory.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                      <div className="flex items-center gap-3">
                        {b.status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{b.date}</p>
                          <p className="text-xs text-muted-foreground">{b.type} · {b.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={b.status === "success"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"}
                        >
                          {b.status}
                        </Badge>
                        {b.status === "success" && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── LOGS ── */}
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
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredLogs.map((log) => {
                    const Icon = logLevelIcons[log.level]
                    return (
                      <div
                        key={log.id}
                        className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border text-sm ${logLevelStyles[log.level]}`}
                      >
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Icon className="w-4 h-4" />
                          <Badge variant="outline" className="uppercase text-xs font-semibold border-current">
                            {log.level}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{log.user}</span>
                          <span className="mx-2 opacity-50">—</span>
                          <span>{log.action}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs opacity-70 flex-shrink-0">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.time}
                          </span>
                          <span>IP: {log.ip}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SECURITY ── */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Password</CardTitle>
                <CardDescription>Update the admin account password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
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
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
                <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
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
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Login Attempt Limit</p>
                    <p className="text-sm text-muted-foreground">Lock account after 5 failed login attempts.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Automatically log out after inactivity.</p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
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
                  <Switch />
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
                  { device: "Safari on iPhone 15", ip: "192.168.1.22", time: "2 hours ago", current: false },
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
                      {session.current && (
                        <Badge className="bg-emerald-100 text-emerald-700">Current</Badge>
                      )}
                      {!session.current && (
                        <Button variant="outline" size="sm" className="text-destructive">
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── NOTIFICATIONS ── */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose which events trigger an email to the admin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: "New Member Registration", desc: "When a new member signs up.", defaultOn: true },
                  { label: "New Prayer Request", desc: "When a member submits a prayer request.", defaultOn: true },
                  { label: "New Counseling Request", desc: "When a counseling session is requested.", defaultOn: true },
                  { label: "New Donation Received", desc: "When a donation is submitted.", defaultOn: true },
                  { label: "Backup Success / Failure", desc: "After each scheduled backup attempt.", defaultOn: true },
                  { label: "Failed Login Attempt", desc: "When someone fails to log in multiple times.", defaultOn: false },
                ].map((item, i) => (
                  <div key={i}>
                    {i > 0 && <Separator className="mb-5" />}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.defaultOn} />
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
                  <Label htmlFor="admin-email">Primary Admin Email</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@abcmi.org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-email">Secondary Email (optional)</Label>
                  <Input id="secondary-email" type="email" placeholder="another@example.com" />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                  >
                    {saved ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> Saved</>
                    ) : (
                      "Save Notification Settings"
                    )}
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
