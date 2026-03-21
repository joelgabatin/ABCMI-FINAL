"use client"

import { useState } from "react"
import {
  MessageSquarePlus, Star, Search, ChevronDown, Trash2,
  CheckCircle, Clock, RotateCcw, Reply, X
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

type FeedbackStatus = "new" | "under_review" | "acknowledged" | "resolved"
type FeedbackType = "General Feedback" | "Service Improvement" | "Pastoral Care" | "Facilities" | "Programs" | "Other"

interface Feedback {
  id: number
  author: string
  branch: string
  type: FeedbackType
  subject: string
  message: string
  rating: number
  date: string
  status: FeedbackStatus
  anonymous: boolean
  wantsResponse: boolean
  adminReply?: string
}

const initialFeedback: Feedback[] = [
  { id: 1, author: "Elena Pascual", branch: "ABCMI Main Church, Baguio City", type: "Service Improvement", subject: "Sound system during worship", message: "The audio quality during worship service has been inconsistent over the past few weeks. Sometimes the microphones produce feedback and it's quite distracting during the message. I think it would greatly improve the worship experience if this could be looked into.", rating: 3, date: "Mar 19, 2026", status: "under_review", anonymous: false, wantsResponse: true, adminReply: "" },
  { id: 2, author: "Anonymous", branch: "Camp 8, Baguio City", type: "Pastoral Care", subject: "More pastoral visits for elderly members", message: "We have several elderly members who can no longer attend Sunday service regularly. It would be a tremendous blessing if the pastoral team could schedule regular home visits for them. They often feel disconnected from the church community.", rating: 4, date: "Mar 17, 2026", status: "acknowledged", anonymous: true, wantsResponse: false, adminReply: "Thank you for this thoughtful suggestion. We have shared this with our pastoral team and will be organizing a visitation schedule for our elderly members beginning next month." },
  { id: 3, author: "Robert Liwanag", branch: "Kias, Baguio City", type: "Programs", subject: "Request for a seniors ministry", message: "Our congregation has a growing number of members aged 60 and above, but we don't have a dedicated ministry or fellowship group for them. A seniors ministry with relevant Bible studies and social activities would be very meaningful.", rating: 5, date: "Mar 14, 2026", status: "new", anonymous: false, wantsResponse: true },
  { id: 4, author: "Maribel Corpuz", branch: "Dalic, Bontoc, Mt. Province", type: "Facilities", subject: "Restroom maintenance needed", message: "The restroom facilities at our branch need some attention. They are often not clean, and some fixtures are not functioning properly. A proper maintenance schedule would make a big difference especially for guests and visitors.", rating: 2, date: "Mar 12, 2026", status: "resolved", anonymous: false, wantsResponse: true, adminReply: "We sincerely apologize for the inconvenience. We have assigned a maintenance team to perform repairs and have set up a regular cleaning schedule. Thank you for bringing this to our attention." },
  { id: 5, author: "Anonymous", branch: "Villa Conchita, Manabo, Abra", type: "General Feedback", subject: "Grateful for the church community", message: "I just wanted to say how thankful I am for this church. During a very difficult season in my life, the members rallied around my family with support, prayer, and practical help. This church truly lives out the love of Christ.", rating: 5, date: "Mar 10, 2026", status: "acknowledged", anonymous: true, wantsResponse: false, adminReply: "Praise God! This is exactly what we strive to be as a church family. Thank you so much for sharing this encouragement with us." },
  { id: 6, author: "Aurelio Bautista", branch: "San Juan, Abra", type: "Service Improvement", subject: "Suggestion for live streaming services", message: "Many of our members who travel for work or are ill cannot attend in person. A live stream of Sunday services on Facebook or YouTube would allow them to stay connected and continue to be spiritually fed even from a distance.", rating: 4, date: "Mar 7, 2026", status: "new", anonymous: false, wantsResponse: true },
  { id: 7, author: "Petra Villanueva", branch: "Casacgudan, Manabo, Abra", type: "Pastoral Care", subject: "Pre-marriage counseling availability", message: "My fiance and I are engaged and are looking for pre-marriage counseling. We inquired at the church office but were told the schedule was full. Is there a way to expand counseling availability, perhaps with other trained counselors?", rating: 3, date: "Mar 3, 2026", status: "resolved", anonymous: false, wantsResponse: true, adminReply: "We have spoken with two additional qualified members of our pastoral team and they are now available for pre-marital counseling. Please contact the church office to schedule your sessions." },
]

const statusConfig: Record<FeedbackStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  new: { label: "New", color: "bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20", icon: MessageSquarePlus },
  under_review: { label: "Under Review", color: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: Clock },
  acknowledged: { label: "Acknowledged", color: "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30", icon: CheckCircle },
  resolved: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle },
}

const typeColors: Record<FeedbackType, string> = {
  "General Feedback": "bg-slate-100 text-slate-700",
  "Service Improvement": "bg-blue-100 text-blue-700",
  "Pastoral Care": "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  "Facilities": "bg-orange-100 text-orange-700",
  "Programs": "bg-emerald-100 text-emerald-700",
  "Other": "bg-muted text-muted-foreground",
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star key={n} className={`w-3.5 h-3.5 ${n <= rating ? "text-[var(--church-gold)] fill-[var(--church-gold)]" : "text-muted-foreground"}`} />
    ))}
  </div>
)

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedback)
  const [search, setSearch] = useState("")
  const [viewItem, setViewItem] = useState<Feedback | null>(null)
  const [replyText, setReplyText] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const updateStatus = (id: number, status: FeedbackStatus) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f))
  }

  const submitReply = (id: number) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, adminReply: replyText, status: "acknowledged" } : f))
    if (viewItem?.id === id) setViewItem(prev => prev ? { ...prev, adminReply: replyText, status: "acknowledged" } : null)
    setReplyText("")
  }

  const deleteFeedback = (id: number) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id))
    setDeleteId(null)
  }

  const filtered = (tab: "all" | FeedbackStatus) =>
    feedbacks.filter(f => {
      const matchTab = tab === "all" || f.status === tab
      const matchSearch = f.subject.toLowerCase().includes(search.toLowerCase()) ||
        f.author.toLowerCase().includes(search.toLowerCase()) ||
        f.message.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })

  const avgRating = (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)

  const stats = [
    { label: "Total", value: feedbacks.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
    { label: "New", value: feedbacks.filter(f => f.status === "new").length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
    { label: "Pending", value: feedbacks.filter(f => f.status === "under_review").length, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Avg. Rating", value: avgRating, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15" },
  ]

  const FeedbackCard = ({ f }: { f: Feedback }) => {
    const StatusIcon = statusConfig[f.status].icon
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-semibold text-sm text-foreground">
                  {f.anonymous ? "Anonymous" : f.author}
                </p>
                {f.wantsResponse && (
                  <Badge variant="outline" className="text-xs border-[var(--church-primary)]/30 text-[var(--church-primary)]">
                    Wants Response
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{f.branch}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className={`text-xs ${statusConfig[f.status].color}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[f.status].label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => { setViewItem(f); setReplyText(f.adminReply || "") }}>
                    <Reply className="w-4 h-4 mr-2" /> View & Reply
                  </DropdownMenuItem>
                  {f.status === "new" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "under_review")} className="text-orange-600">
                      <Clock className="w-4 h-4 mr-2" /> Mark Under Review
                    </DropdownMenuItem>
                  )}
                  {f.status !== "resolved" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "resolved")} className="text-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
                    </DropdownMenuItem>
                  )}
                  {f.status === "resolved" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "new")}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Reopen
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setDeleteId(f.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className={`text-xs ${typeColors[f.type]}`}>{f.type}</Badge>
            <StarRating rating={f.rating} />
            <span className="text-xs text-muted-foreground ml-auto">{f.date}</span>
          </div>

          <h3 className="font-semibold text-foreground mb-1">{f.subject}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{f.message}</p>

          {f.adminReply && (
            <div className="mt-3 p-3 rounded-lg bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/15">
              <p className="text-xs font-semibold text-[var(--church-primary)] mb-1">Admin Response</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{f.adminReply}</p>
            </div>
          )}

          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs"
              onClick={() => { setViewItem(f); setReplyText(f.adminReply || "") }}>
              <Reply className="w-3.5 h-3.5 mr-1" /> {f.adminReply ? "Edit Reply" : "Reply"}
            </Button>
            {f.status !== "resolved" && (
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                onClick={() => updateStatus(f.id, "resolved")}>
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolve
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Feedback Management</h1>
          <p className="text-muted-foreground mt-1">
            Review member feedback, respond, and track resolution status.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <MessageSquarePlus className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search feedback..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="all">All ({feedbacks.length})</TabsTrigger>
            <TabsTrigger value="new">New ({feedbacks.filter(f => f.status === "new").length})</TabsTrigger>
            <TabsTrigger value="under_review">Under Review ({feedbacks.filter(f => f.status === "under_review").length})</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged ({feedbacks.filter(f => f.status === "acknowledged").length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({feedbacks.filter(f => f.status === "resolved").length})</TabsTrigger>
          </TabsList>

          {(["all", "new", "under_review", "acknowledged", "resolved"] as const).map(tab => (
            <TabsContent key={tab} value={tab}>
              {filtered(tab).length === 0 ? (
                <Card><CardContent className="p-12 text-center text-muted-foreground">No feedback found.</CardContent></Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered(tab).map(f => <FeedbackCard key={f.id} f={f} />)}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Reply Dialog */}
        <Dialog open={!!viewItem} onOpenChange={open => !open && setViewItem(null)}>
          <DialogContent className="max-w-lg">
            {viewItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewItem.subject}</DialogTitle>
                  <DialogDescription>
                    {viewItem.anonymous ? "Anonymous" : viewItem.author} — {viewItem.branch} — {viewItem.date}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className={`text-xs ${typeColors[viewItem.type]}`}>{viewItem.type}</Badge>
                    <StarRating rating={viewItem.rating} />
                    <Badge variant="outline" className={`text-xs ml-auto ${statusConfig[viewItem.status].color}`}>
                      {statusConfig[viewItem.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-4">{viewItem.message}</p>
                  <div className="space-y-2">
                    <Label>Admin Response {!viewItem.wantsResponse && <span className="text-xs text-muted-foreground">(member did not request a response)</span>}</Label>
                    <Textarea
                      rows={4}
                      placeholder="Write a response to this feedback..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setViewItem(null)}>Cancel</Button>
                    <Button
                      className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                      onClick={() => { submitReply(viewItem.id); setViewItem(null) }}
                      disabled={!replyText.trim()}
                    >
                      <Reply className="w-4 h-4 mr-2" /> Send Response
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this feedback?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => deleteId !== null && deleteFeedback(deleteId)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
