"use client"

import { useState } from "react"
import { Heart, Search, Send, Check, Clock, User, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface PrayerRequest {
  id: number
  name: string
  request: string
  category: string
  submittedAt: string
  status: "pending" | "prayed" | "answered"
  response: string
  isAnonymous: boolean
}

const initialRequests: PrayerRequest[] = [
  { id: 1, name: "Anna Bautista", request: "Please pray for my mother who is hospitalized with pneumonia. We trust in God's healing power.", category: "Healing", submittedAt: "2024-03-20", status: "pending", response: "", isAnonymous: false },
  { id: 2, name: "Anonymous", request: "I am struggling with financial difficulties. Please pray that God will provide for our family's needs.", category: "Provision", submittedAt: "2024-03-19", status: "pending", response: "", isAnonymous: true },
  { id: 3, name: "Pedro Villanueva", request: "Praying for guidance in my career. I have two job offers and need God's wisdom in choosing.", category: "Guidance", submittedAt: "2024-03-18", status: "prayed", response: "We are praying for God's wisdom and perfect will to be revealed to you. Trust in the Lord with all your heart.", isAnonymous: false },
  { id: 4, name: "Lena Torres", request: "Prayer for my marriage. We are going through a difficult season and need God's restoration.", category: "Family", submittedAt: "2024-03-17", status: "prayed", response: "We are interceding for your marriage. God is the restorer of broken things and He loves your family.", isAnonymous: false },
  { id: 5, name: "Anonymous", request: "Please pray for my salvation of my husband who has not yet accepted Christ.", category: "Salvation", submittedAt: "2024-03-15", status: "answered", response: "Praise God! We rejoice with you. Continue to intercede for him.", isAnonymous: true },
  { id: 6, name: "Joy Salazar", request: "Pray for strength and endurance. I feel spiritually dry and need a fresh touch from God.", category: "Spiritual Growth", submittedAt: "2024-03-14", status: "answered", response: "God's mercies are new every morning. We prayed for a fresh outpouring of the Holy Spirit over you.", isAnonymous: false },
]

const categories = ["All", "Healing", "Provision", "Guidance", "Family", "Salvation", "Spiritual Growth", "Other"]

export default function PastorPrayersPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>(initialRequests)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [respondDialog, setRespondDialog] = useState<PrayerRequest | null>(null)
  const [responseText, setResponseText] = useState("")

  const sendResponse = () => {
    if (!respondDialog) return
    setRequests(prev => prev.map(r => r.id === respondDialog.id
      ? { ...r, response: responseText, status: r.status === "pending" ? "prayed" : r.status }
      : r
    ))
    setRespondDialog(null)
    setResponseText("")
  }

  const markAnswered = (id: number) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "answered" } : r))

  const filtered = (tab: "pending" | "prayed" | "answered" | "all") =>
    requests
      .filter(r => tab === "all" || r.status === tab)
      .filter(r => categoryFilter === "All" || r.category === categoryFilter)
      .filter(r => r.request.toLowerCase().includes(search.toLowerCase()) || (!r.isAnonymous && r.name.toLowerCase().includes(search.toLowerCase())))

  const statusBadge = (status: PrayerRequest["status"]) => {
    if (status === "pending") return <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30">Pending</Badge>
    if (status === "prayed") return <Badge className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20">Prayed</Badge>
    return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Answered</Badge>
  }

  const PrayerCard = ({ req }: { req: PrayerRequest }) => (
    <Card className={req.status === "pending" ? "border-[var(--church-gold)]/40" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback className="bg-rose-500/10 text-rose-600 text-xs font-semibold">
              {req.isAnonymous ? "AN" : req.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-medium text-foreground text-sm">{req.isAnonymous ? "Anonymous" : req.name}</p>
              {statusBadge(req.status)}
              <Badge variant="outline" className="text-xs">{req.category}</Badge>
            </div>
            <p className="text-sm text-foreground leading-relaxed mt-1">"{req.request}"</p>
            <p className="text-xs text-muted-foreground mt-1">Submitted: {req.submittedAt}</p>
            {req.response && (
              <div className="mt-2 p-2 rounded-md bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/15">
                <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Pastoral Response</p>
                <p className="text-xs text-foreground">{req.response}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setRespondDialog(req); setResponseText(req.response) }}>
              <Send className="w-3 h-3" /> {req.response ? "Edit" : "Respond"}
            </Button>
            {req.status === "prayed" && (
              <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => markAnswered(req.id)}>
                <Check className="w-3 h-3" /> Answered
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout variant="pastor">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Prayer Requests</h1>
          <p className="text-muted-foreground mt-1">Review, respond to, and track prayer requests from your branch members.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Pending", value: requests.filter(r => r.status === "pending").length, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15" },
            { label: "Prayed For", value: requests.filter(r => r.status === "prayed").length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
            { label: "Answered", value: requests.filter(r => r.status === "answered").length, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Heart className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search requests..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${categoryFilter === cat ? "bg-[var(--church-primary)] text-white border-[var(--church-primary)]" : "bg-background text-muted-foreground border-border hover:border-[var(--church-primary)]/50"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" /> Pending
              {requests.filter(r => r.status === "pending").length > 0 && (
                <Badge className="ml-1 bg-rose-500 text-white text-xs px-1.5 py-0">{requests.filter(r => r.status === "pending").length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="prayed" className="gap-2"><Heart className="w-4 h-4" /> Prayed For</TabsTrigger>
            <TabsTrigger value="answered" className="gap-2"><Check className="w-4 h-4" /> Answered</TabsTrigger>
            <TabsTrigger value="all" className="gap-2">All</TabsTrigger>
          </TabsList>

          {(["pending", "prayed", "answered", "all"] as const).map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="space-y-3">
                {filtered(tab).map(req => <PrayerCard key={req.id} req={req} />)}
                {filtered(tab).length === 0 && (
                  <Card><CardContent className="p-12 text-center text-muted-foreground">No prayer requests found.</CardContent></Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Respond Dialog */}
        <Dialog open={!!respondDialog} onOpenChange={() => { setRespondDialog(null); setResponseText("") }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Pastoral Response</DialogTitle>
              <DialogDescription>Write an encouraging response to this prayer request.</DialogDescription>
            </DialogHeader>
            {respondDialog && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Prayer Request from {respondDialog.isAnonymous ? "Anonymous" : respondDialog.name}</p>
                  <p className="text-sm text-foreground">"{respondDialog.request}"</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Your Response</label>
                  <Textarea
                    placeholder="Write an encouraging, prayerful response..."
                    className="min-h-[100px]"
                    value={responseText}
                    onChange={e => setResponseText(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2" onClick={sendResponse} disabled={!responseText.trim()}>
                    <Send className="w-4 h-4" /> Send Response
                  </Button>
                  <Button variant="outline" onClick={() => { setRespondDialog(null); setResponseText("") }}>Cancel</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </DashboardLayout>
  )
}
