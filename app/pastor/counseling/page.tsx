"use client"

import { useState } from "react"
import { MessageSquare, Calendar, Clock, User, CheckCircle, XCircle, Plus, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

const sessions = [
  { id: 1, name: "Jose Fernandez", date: "2026-03-22", time: "10:00 AM", concern: "Family Conflict", status: "upcoming", notes: "" },
  { id: 2, name: "Maria Garcia", date: "2026-03-20", time: "2:00 PM", concern: "Grief & Loss", status: "completed", notes: "Session went well. Referred to group prayer." },
  { id: 3, name: "Carlos Mendoza", date: "2026-03-25", time: "3:00 PM", concern: "Financial Stress", status: "upcoming", notes: "" },
  { id: 4, name: "Elena Ramos", date: "2026-03-15", time: "11:00 AM", concern: "Spiritual Direction", status: "completed", notes: "Encouraged daily devotion and accountability partner." },
  { id: 5, name: "Pedro Villanueva", date: "2026-03-28", time: "4:00 PM", concern: "Marriage Issues", status: "pending", notes: "" },
]

export default function PastorCounselingPage() {
  const [selectedSession, setSelectedSession] = useState<typeof sessions[0] | null>(null)
  const [noteText, setNoteText] = useState("")
  const [sessionList, setSessionList] = useState(sessions)

  const saveNote = () => {
    if (!selectedSession) return
    setSessionList(prev => prev.map(s => s.id === selectedSession.id ? { ...s, notes: noteText, status: "completed" } : s))
    setSelectedSession(null)
  }

  const openSession = (s: typeof sessions[0]) => { setSelectedSession(s); setNoteText(s.notes) }

  const upcoming = sessionList.filter(s => s.status === "upcoming" || s.status === "pending")
  const completed = sessionList.filter(s => s.status === "completed")

  const statusBadge: Record<string, string> = {
    upcoming: "bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20",
    pending: "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30",
    completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  }

  return (
    <DashboardLayout variant="pastor">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Counseling Sessions</h1>
          <p className="text-muted-foreground mt-1">Manage and record counseling appointments for your branch members.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Upcoming", value: upcoming.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
            { label: "Completed", value: completed.length, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Total Sessions", value: sessionList.length, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><MessageSquare className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          </TabsList>

          {[{ key: "upcoming", items: upcoming }, { key: "completed", items: completed }].map(tab => (
            <TabsContent key={tab.key} value={tab.key}>
              <div className="space-y-3">
                {tab.items.length === 0 ? (
                  <Card><CardContent className="p-12 text-center text-muted-foreground">No {tab.key} sessions.</CardContent></Card>
                ) : tab.items.map(session => (
                  <Card key={session.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                          {session.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{session.name}</p>
                        <p className="text-xs text-muted-foreground">{session.concern}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{session.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.time}</span>
                        </div>
                        {session.notes && <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">Note: {session.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={statusBadge[session.status]}>{session.status}</Badge>
                        {session.status !== "completed" && (
                          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => openSession(session)}>
                            <Send className="w-3.5 h-3.5" /> Add Notes
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={selectedSession !== null} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Session Notes — {selectedSession?.name}</DialogTitle>
              <DialogDescription>{selectedSession?.date} at {selectedSession?.time} &middot; {selectedSession?.concern}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Write session notes, observations, and follow-up actions..." rows={5} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSession(null)}>Cancel</Button>
                <Button onClick={saveNote} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <CheckCircle className="w-4 h-4" /> Mark Complete & Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </DashboardLayout>
  )
}
