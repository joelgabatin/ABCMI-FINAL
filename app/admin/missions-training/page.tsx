"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search, Plus, Users, GraduationCap, CheckCircle,
  Clock, XCircle, Eye, Mail, Download, Filter
} from "lucide-react"
import { cn } from "@/lib/utils"

const registrations = [
  { id: 1, name: "Maria Santos", email: "maria.santos@gmail.com", phone: "+63 912 345 6789", church: "ABCMI Main Church", experience: "1–2 years", mode: "In-Person", motivation: "I feel God calling me to plant a church in my hometown province.", status: "Approved", date: "Mar 15, 2026" },
  { id: 2, name: "John Reyes", email: "john.reyes@gmail.com", phone: "+63 923 456 7890", church: "Camp 8 Branch", experience: "3–5 years", mode: "Online", motivation: "I have been leading a cell group for 3 years and want to grow in church planting skills.", status: "Pending", date: "Mar 17, 2026" },
  { id: 3, name: "Grace Bautista", email: "grace.b@yahoo.com", phone: "+63 934 567 8901", church: "San Carlos Branch", experience: "No experience", mode: "In-Person", motivation: "I want to serve God in missions and learn the basics.", status: "Pending", date: "Mar 18, 2026" },
  { id: 4, name: "Ramon dela Cruz", email: "ramon.dc@gmail.com", phone: "+63 945 678 9012", church: "Kias Branch", experience: "5+ years", mode: "In-Person", motivation: "I am a lay leader and want to eventually start a daughter church.", status: "Approved", date: "Mar 10, 2026" },
  { id: 5, name: "Ana Villanueva", email: "ana.v@gmail.com", phone: "+63 956 789 0123", church: "ABCMI Main Church", experience: "1–2 years", mode: "Online", motivation: "I feel a deep passion for cross-cultural missions.", status: "Waitlisted", date: "Mar 19, 2026" },
  { id: 6, name: "Pedro Gomez", email: "pedro.g@gmail.com", phone: "+63 967 890 1234", church: "Dalic Branch", experience: "3–5 years", mode: "In-Person", motivation: "I want to bring church planting training back to my mountain community.", status: "Declined", date: "Mar 20, 2026" },
]

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Approved: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  Pending: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  Waitlisted: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Users },
  Declined: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
}

export default function AdminMissionsTrainingPage() {
  const [regs, setRegs] = useState(registrations)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<typeof registrations[0] | null>(null)

  const filtered = regs.filter(r => {
    const match = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.church.toLowerCase().includes(search.toLowerCase())
    if (statusFilter !== "all") return match && r.status === statusFilter
    return match
  })

  function updateStatus(id: number, status: string) {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const stats = [
    { label: "Total Registrations", value: regs.length, icon: Users, color: "text-[var(--church-primary)]" },
    { label: "Approved", value: regs.filter(r => r.status === "Approved").length, icon: CheckCircle, color: "text-green-600" },
    { label: "Pending Review", value: regs.filter(r => r.status === "Pending").length, icon: Clock, color: "text-yellow-600" },
    { label: "Slots Remaining", value: 40 - regs.filter(r => r.status === "Approved").length, icon: GraduationCap, color: "text-blue-600" },
  ]

  return (
    <DashboardLayout variant="admin" title="Missions Training" description="Manage training registrations, review applicants, and track participation">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <Card key={i} className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--church-soft-gray)] flex items-center justify-center flex-shrink-0">
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="registrations">
        <TabsList className="mb-6">
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="training-info">Training Info</TabsTrigger>
        </TabsList>

        {/* Registrations Tab */}
        <TabsContent value="registrations">
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-lg">All Registrations</CardTitle>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search registrants..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <Filter className="w-3.5 h-3.5 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--church-soft-gray)] border-y border-border">
                    <tr>
                      {["Name", "Branch / Church", "Mode", "Experience", "Status", "Date", "Actions"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const sc = statusConfig[r.status]
                      return (
                        <tr key={r.id} className="border-b border-border hover:bg-[var(--church-soft-gray)]/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-7 h-7">
                                <AvatarFallback className="bg-[var(--church-primary)] text-white text-xs font-bold">
                                  {r.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{r.name}</p>
                                <p className="text-xs text-muted-foreground">{r.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{r.church}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">{r.mode}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{r.experience}</td>
                          <td className="px-4 py-3">
                            <Badge className={cn("text-xs border-none", sc.color)}>
                              <sc.icon className="w-3 h-3 mr-1" />{r.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{r.date}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(r)}>
                                    <Eye className="w-3.5 h-3.5" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg">
                                  <DialogHeader>
                                    <DialogTitle>Registration Details</DialogTitle>
                                  </DialogHeader>
                                  {selected && (
                                    <div className="space-y-4 text-sm">
                                      <div className="flex items-center gap-3">
                                        <Avatar>
                                          <AvatarFallback className="bg-[var(--church-primary)] text-white font-bold">
                                            {selected.name.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-bold text-foreground">{selected.name}</p>
                                          <p className="text-muted-foreground text-xs">{selected.email} · {selected.phone}</p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        {[
                                          ["Church / Branch", selected.church],
                                          ["Mode", selected.mode],
                                          ["Experience", selected.experience],
                                          ["Date Registered", selected.date],
                                        ].map(([l, v]) => (
                                          <div key={l}>
                                            <p className="text-xs text-muted-foreground">{l}</p>
                                            <p className="font-medium text-foreground">{v}</p>
                                          </div>
                                        ))}
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Motivation / Calling</p>
                                        <p className="text-foreground leading-relaxed italic bg-[var(--church-soft-gray)] rounded-lg px-4 py-3">
                                          "{selected.motivation}"
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-2">Update Status</p>
                                        <div className="flex flex-wrap gap-2">
                                          {["Approved", "Pending", "Waitlisted", "Declined"].map(s => (
                                            <Button
                                              key={s}
                                              size="sm"
                                              variant={selected.status === s ? "default" : "outline"}
                                              className={cn("text-xs h-7", selected.status === s && "bg-[var(--church-primary)] text-white")}
                                              onClick={() => updateStatus(selected.id, s)}
                                            >
                                              {s}
                                            </Button>
                                          ))}
                                        </div>
                                      </div>
                                      <Button size="sm" variant="outline" className="gap-1.5 w-full">
                                        <Mail className="w-3.5 h-3.5" /> Send Confirmation Email
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No registrations found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Info Tab */}
        <TabsContent value="training-info">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Edit Training Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Training Title</Label>
                  <Input defaultValue="Church Planting & Missions Training" />
                </div>
                <div className="space-y-2">
                  <Label>Training Dates</Label>
                  <Input defaultValue="July 14–21, 2025" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Registration Deadline</Label>
                  <Input defaultValue="June 30, 2025" />
                </div>
                <div className="space-y-2">
                  <Label>Total Slots</Label>
                  <Input type="number" defaultValue={40} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input defaultValue="ABCMI Main Church, East Quirino Hill, Baguio City (with Online Option)" />
              </div>
              <div className="space-y-2">
                <Label>Overview / Description</Label>
                <Textarea rows={5} defaultValue="This intensive one-week Missions Training is designed to teach, train, and equip men and women who feel called to plant churches..." />
              </div>
              <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2">
                <CheckCircle className="w-4 h-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
