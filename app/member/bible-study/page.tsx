"use client"

import { useState } from "react"
import { BookOpen, Users, MapPin, Clock, Search, Send, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

const groups = [
  { id: 1, name: "Foundations of Faith", branch: "ABCMI Main Church", leader: "Ptr. Ysrael Coyoy", topic: "Book of Romans", schedule: "Wednesday", time: "7:00 PM", location: "Main Sanctuary", members: 18, maxMembers: 25, status: "active", description: "In-depth study of Paul's letter to the Romans covering grace, faith, and salvation." },
  { id: 2, name: "Women of the Word", branch: "ABCMI Main Church", leader: "Ptr. Fhey Coyoy", topic: "Proverbs 31 & Women of the Bible", schedule: "Saturday", time: "9:00 AM", location: "Fellowship Hall", members: 22, maxMembers: 30, status: "active", description: "A women's Bible study group focusing on biblical womanhood and practical faith." },
  { id: 3, name: "Youth Discipleship", branch: "Camp 8 Branch", leader: "Ptr. Julio Coyoy", topic: "Identity in Christ", schedule: "Friday", time: "6:00 PM", location: "Camp 8 Hall", members: 15, maxMembers: 20, status: "active", description: "Bible study for youth focusing on identity in Christ and purpose in life." },
  { id: 4, name: "New Believers Class", branch: "ABCMI Main Church", leader: "Ptr. Fhey Coyoy", topic: "Christian Basics & Foundations", schedule: "Sunday", time: "8:00 AM", location: "Room A", members: 8, maxMembers: 15, status: "active", description: "Orientation and basic discipleship class for new believers and church members." },
  { id: 5, name: "Men's Brotherhood Study", branch: "Kias Branch", leader: "Ptr. Domingo Coyoy", topic: "Book of Proverbs", schedule: "Saturday", time: "7:00 AM", location: "Kias Hall", members: 12, maxMembers: 20, status: "active", description: "Early morning Bible study for men focusing on wisdom and godly leadership." },
  { id: 6, name: "Couples' Fellowship", branch: "Casacgudan Branch", leader: "Ptr. Rolando Teneza", topic: "Marriage & Family in the Bible", schedule: "Thursday", time: "7:30 PM", location: "Casacgudan Hall", members: 20, maxMembers: 20, status: "full", description: "Bible study for married couples focusing on biblical principles for family life." },
]

const statusColor: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  full: "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30",
}

export default function MemberBibleStudyPage() {
  const [search, setSearch] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [joinDialog, setJoinDialog] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<typeof groups[0] | null>(null)
  const [joinForm, setJoinForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [submitted, setSubmitted] = useState<number[]>([])

  const branches = [...new Set(groups.map(g => g.branch))]

  const filtered = groups.filter(g =>
    (branchFilter === "all" || g.branch === branchFilter) &&
    (g.name.toLowerCase().includes(search.toLowerCase()) || g.topic.toLowerCase().includes(search.toLowerCase()) || g.leader.toLowerCase().includes(search.toLowerCase()))
  )

  const myGroups = groups.filter(g => submitted.includes(g.id))

  const openJoin = (group: typeof groups[0]) => {
    setSelectedGroup(group)
    setJoinForm({ name: "", email: "", phone: "", message: "" })
    setJoinDialog(true)
  }

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedGroup) setSubmitted(prev => [...prev, selectedGroup.id])
    setJoinDialog(false)
  }

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bible Study Groups</h1>
          <p className="text-muted-foreground mt-1">Browse and join a Bible study group that fits your schedule and interests.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Groups", value: groups.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
            { label: "Active Groups", value: groups.filter(g => g.status === "active").length, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Participants", value: groups.reduce((s, g) => s + g.members, 0), color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15" },
            { label: "My Groups", value: myGroups.length, color: "text-rose-500", bg: "bg-rose-500/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="gap-2"><BookOpen className="w-4 h-4" /> All Groups</TabsTrigger>
            <TabsTrigger value="mine" className="gap-2">
              <Check className="w-4 h-4" /> My Requests
              {myGroups.length > 0 && <Badge className="ml-1 bg-[var(--church-primary)] text-white text-xs px-1.5 py-0">{myGroups.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search groups by name, topic or leader..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-48"><SelectValue placeholder="All Branches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(group => {
                const isSubmitted = submitted.includes(group.id)
                return (
                  <Card key={group.id} className="hover:shadow-md transition-shadow flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-[var(--church-primary)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm leading-tight">{group.name}</CardTitle>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{group.topic}</p>
                        </div>
                        <Badge className={`text-xs flex-shrink-0 ${statusColor[group.status] || "bg-muted text-muted-foreground"}`}>{group.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">{group.description}</p>
                      <div className="text-xs text-muted-foreground space-y-1 mt-1">
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{group.branch} — {group.location}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{group.schedule} at {group.time}</div>
                        <div className="flex items-center gap-1.5"><Users className="w-3 h-3" />Leader: {group.leader}</div>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className={`font-medium ${group.members >= group.maxMembers ? "text-rose-500" : "text-emerald-600"}`}>{group.members}/{group.maxMembers} members</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                        <div className={`h-1.5 rounded-full ${group.members >= group.maxMembers ? "bg-rose-500" : "bg-[var(--church-primary)]"}`} style={{ width: `${Math.min((group.members / group.maxMembers) * 100, 100)}%` }} />
                      </div>
                      <Button
                        className={`mt-auto w-full gap-2 ${isSubmitted ? "bg-emerald-500 hover:bg-emerald-600" : "bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)]"} text-white`}
                        onClick={() => !isSubmitted && openJoin(group)}
                        disabled={group.status === "full" && !isSubmitted}
                      >
                        {isSubmitted ? (<><Check className="w-4 h-4" /> Request Sent</>) : group.status === "full" ? "Group Full" : (<><Send className="w-4 h-4" /> Request to Join</>)}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
              {filtered.length === 0 && (
                <div className="col-span-full">
                  <Card><CardContent className="p-12 text-center text-muted-foreground">No groups found matching your search.</CardContent></Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mine">
            {myGroups.length === 0 ? (
              <Card><CardContent className="p-12 text-center text-muted-foreground">You have not requested to join any group yet.</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {myGroups.map(group => (
                  <Card key={group.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-[var(--church-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{group.name}</p>
                        <p className="text-xs text-muted-foreground">{group.topic} &middot; {group.branch}</p>
                        <p className="text-xs text-muted-foreground">{group.schedule} at {group.time}</p>
                      </div>
                      <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30">Request Sent</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Join Dialog */}
        <Dialog open={joinDialog} onOpenChange={setJoinDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request to Join: {selectedGroup?.name}</DialogTitle>
              <DialogDescription>Submit your request and a pastor will contact you to confirm your membership.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input value={joinForm.name} onChange={e => setJoinForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" required />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input type="email" value={joinForm.email} onChange={e => setJoinForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" required />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input value={joinForm.phone} onChange={e => setJoinForm(p => ({ ...p, phone: e.target.value }))} placeholder="+63 912 345 6789" />
              </div>
              <div className="space-y-1.5">
                <Label>Message (optional)</Label>
                <Textarea value={joinForm.message} onChange={e => setJoinForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us a little about yourself or why you want to join..." rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setJoinDialog(false)}>Cancel</Button>
                <Button type="submit" className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <Send className="w-4 h-4" /> Send Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </DashboardLayout>
  )
}
