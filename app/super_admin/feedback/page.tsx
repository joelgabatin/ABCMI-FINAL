"use client"

import { useState, useEffect, useCallback } from "react"
import {
  MessageSquarePlus, Star, Search, ChevronDown, Trash2,
  CheckCircle, Clock, RotateCcw, Reply, Loader2, AlertCircle, Ban
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import { toast } from "sonner"

type FeedbackStatus = "new" | "under_review" | "acknowledged" | "resolved" | "spam"
type FeedbackType = "General Feedback" | "Service Improvement" | "Pastoral Care" | "Facilities" | "Programs" | "Other"

interface Feedback {
  id: number
  author: string
  email?: string | null
  branch: string
  type: FeedbackType
  subject: string
  message: string
  rating: number
  created_at: string
  status: FeedbackStatus
  anonymous: boolean
  wants_response: boolean
  admin_reply?: string | null
}

const statusConfig: Record<FeedbackStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  new: { label: "New", color: "bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20", icon: MessageSquarePlus },
  under_review: { label: "Under Review", color: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: Clock },
  acknowledged: { label: "Acknowledged", color: "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30", icon: CheckCircle },
  resolved: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle },
  spam: { label: "Spam", color: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: AlertCircle },
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [viewItem, setViewItem] = useState<Feedback | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/feedback")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setFeedbacks(data)
    } catch {
      toast.error("Failed to load feedback")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFeedbacks() }, [fetchFeedbacks])

  const updateStatus = async (id: number, status: FeedbackStatus) => {
    // Optimistic update
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f))
    if (viewItem?.id === id) setViewItem(prev => prev ? { ...prev, status } : null)

    const res = await fetch(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      toast.error("Failed to update status")
      fetchFeedbacks() // revert
    } else {
      toast.success(`Marked as ${statusConfig[status].label}`)
    }
  }

  const submitReply = async (id: number) => {
    setReplyLoading(true)
    const res = await fetch(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_reply: replyText }),
    })
    if (!res.ok) {
      toast.error("Failed to send response")
    } else {
      setFeedbacks(prev => prev.map(f =>
        f.id === id ? { ...f, admin_reply: replyText, status: "acknowledged" } : f
      ))
      if (viewItem?.id === id) {
        setViewItem(prev => prev ? { ...prev, admin_reply: replyText, status: "acknowledged" } : null)
      }
      setReplyText("")
      setViewItem(null)
      toast.success("Response sent")
    }
    setReplyLoading(false)
  }

  const deleteFeedback = async (id: number) => {
    setDeleteLoading(true)
    const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Failed to delete feedback")
    } else {
      setFeedbacks(prev => prev.filter(f => f.id !== id))
      toast.success("Feedback deleted")
    }
    setDeleteId(null)
    setDeleteLoading(false)
  }

  const filtered = (tab: "all" | FeedbackStatus) =>
    feedbacks.filter(f => {
      const matchTab = tab === "all" || f.status === tab
      const matchSearch = f.subject.toLowerCase().includes(search.toLowerCase()) ||
        f.author.toLowerCase().includes(search.toLowerCase()) ||
        f.message.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : "—"

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
                {f.email && !f.anonymous && (
                  <p className="text-xs text-muted-foreground truncate">({f.email})</p>
                )}
                {f.wants_response && (
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
                  <DropdownMenuItem onClick={() => { setViewItem(f); setReplyText(f.admin_reply || "") }}>
                    <Reply className="w-4 h-4 mr-2" /> View & Reply
                  </DropdownMenuItem>
                  {f.status === "new" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "under_review")} className="text-orange-600">
                      <Clock className="w-4 h-4 mr-2" /> Mark Under Review
                    </DropdownMenuItem>
                  )}
                  {f.status !== "acknowledged" && f.status !== "resolved" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "acknowledged")} className="text-[var(--church-gold)]">
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark Acknowledged
                    </DropdownMenuItem>
                  )}
                  {f.status !== "resolved" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "resolved")} className="text-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
                    </DropdownMenuItem>
                  )}
                  {f.status !== "spam" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "spam")} className="text-rose-600">
                      <Ban className="w-4 h-4 mr-2" /> Mark as Spam
                    </DropdownMenuItem>
                  )}
                  {f.status === "resolved" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "new")}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Reopen
                    </DropdownMenuItem>
                  )}
                  {f.status === "spam" && (
                    <DropdownMenuItem onClick={() => updateStatus(f.id, "new")}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Not Spam (Reopen)
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
            <span className="text-xs text-muted-foreground ml-auto">{formatDate(f.created_at)}</span>
          </div>

          <h3 className="font-semibold text-foreground mb-1">{f.subject}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{f.message}</p>

          {f.admin_reply && (
            <div className="mt-3 p-3 rounded-lg bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/15">
              <p className="text-xs font-semibold text-[var(--church-primary)] mb-1">Admin Response</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{f.admin_reply}</p>
            </div>
          )}

          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs"
              onClick={() => { setViewItem(f); setReplyText(f.admin_reply || "") }}>
              <Reply className="w-3.5 h-3.5 mr-1" /> {f.admin_reply ? "Edit Reply" : "Reply"}
            </Button>
            {f.status !== "resolved" && f.status !== "spam" && (
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                onClick={() => updateStatus(f.id, "resolved")}>
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolve
              </Button>
            )}
            {f.status === "spam" && (
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                onClick={() => updateStatus(f.id, "new")}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restore
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

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
              <TabsTrigger value="all">All ({feedbacks.length})</TabsTrigger>
              <TabsTrigger value="new">New ({feedbacks.filter(f => f.status === "new").length})</TabsTrigger>
              <TabsTrigger value="under_review">Under Review ({feedbacks.filter(f => f.status === "under_review").length})</TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged ({feedbacks.filter(f => f.status === "acknowledged").length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({feedbacks.filter(f => f.status === "resolved").length})</TabsTrigger>
              <TabsTrigger value="spam">Spam ({feedbacks.filter(f => f.status === "spam").length})</TabsTrigger>
            </TabsList>

            {(["all", "new", "under_review", "acknowledged", "resolved", "spam"] as const).map(tab => (
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
        )}

        {/* Reply Dialog */}
        <Dialog open={!!viewItem} onOpenChange={open => !open && setViewItem(null)}>
          <DialogContent className="max-w-lg">
            {viewItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewItem.subject}</DialogTitle>
                  <DialogDescription>
                    {viewItem.anonymous ? "Anonymous" : viewItem.author} 
                    {viewItem.email && !viewItem.anonymous && ` (${viewItem.email})`} 
                    — {viewItem.branch} — {formatDate(viewItem.created_at)}
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

                  {/* Status change buttons */}
                  <div className="flex flex-wrap gap-2">
                    {(["new", "under_review", "acknowledged", "resolved", "spam"] as FeedbackStatus[]).map(s => (
                      <Button
                        key={s}
                        size="sm"
                        variant={viewItem.status === s ? "default" : "outline"}
                        className={`text-xs h-7 ${viewItem.status === s ? "bg-[var(--church-primary)] text-white" : ""}`}
                        onClick={() => updateStatus(viewItem.id, s)}
                        disabled={viewItem.status === s}
                      >
                        {statusConfig[s].label}
                      </Button>
                    ))}
                  </div>

                  <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-4">{viewItem.message}</p>
                  <div className="space-y-2">
                    <Label>
                      Admin Response{" "}
                      {!viewItem.wants_response && (
                        <span className="text-xs text-muted-foreground">(member did not request a response)</span>
                      )}
                    </Label>
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
                      onClick={() => submitReply(viewItem.id)}
                      disabled={!replyText.trim() || replyLoading}
                    >
                      {replyLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Reply className="w-4 h-4 mr-2" />}
                      Send Response
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
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => deleteId !== null && deleteFeedback(deleteId)}
                disabled={deleteLoading}
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
