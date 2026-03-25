"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Search, Mail, MailOpen, Reply, Trash2, Star,
  StarOff, Send, ChevronLeft, Clock, Tag, RefreshCw, Phone
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Message {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: "unread" | "read" | "replied"
  created_at: string
  // client-side only
  starred: boolean
  replies: { from: string; body: string; time: string }[]
}

const subjectLabels: Record<string, string> = {
  general:    "General",
  prayer:     "Prayer",
  membership: "Membership",
  missions:   "Missions",
  donation:   "Donations",
  counseling: "Counseling",
  events:     "Events",
  other:      "Other",
}

const tagColors: Record<string, string> = {
  Prayer:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Missions:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  General:    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Donations:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Counseling: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Membership: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Events:     "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  Other:      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return "Just now"
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return "Yesterday"
  if (days < 7)   return `${days}d ago`
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined })
}

function formatFull(iso: string) {
  return new Date(iso).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
}

export default function AdminMessagesPage() {
  const supabase = createClient()
  const [messages, setMessages]   = useState<Message[]>([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState<Message | null>(null)
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState("all")
  const [replyText, setReplyText] = useState("")
  const [replySent, setReplySent] = useState(false)
  const [sending, setSending]     = useState(false)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) { toast.error("Failed to load messages."); setLoading(false); return }
    setMessages((data ?? []).map(m => ({ ...m, starred: false, replies: [] })))
    setLoading(false)
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  // ── Open & mark read ──────────────────────────────────────────────────────
  async function openMessage(msg: Message) {
    setSelected({ ...msg })
    setReplyText("")
    setReplySent(false)
    if (msg.status === "unread") {
      await supabase.from("contact_messages").update({ status: "read" }).eq("id", msg.id)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "read" } : m))
      setSelected(prev => prev ? { ...prev, status: "read" } : null)
    }
  }

  // ── Star (client-side only) ───────────────────────────────────────────────
  function toggleStar(id: number) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, starred: !prev.starred } : null)
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function deleteMessage(id: number) {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)
    if (error) { toast.error("Failed to delete message."); return }
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success("Message deleted.")
  }

  // ── Reply (client-side thread + mark replied in DB) ───────────────────────
  async function sendReply() {
    if (!replyText.trim() || !selected) return
    setSending(true)
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: "replied" })
      .eq("id", selected.id)
    setSending(false)
    if (error) { toast.error("Failed to send reply."); return }
    const newReply = { from: "Admin", body: replyText, time: new Date().toLocaleString() }
    setMessages(prev => prev.map(m =>
      m.id === selected.id ? { ...m, status: "replied", replies: [...m.replies, newReply] } : m
    ))
    setSelected(prev => prev ? { ...prev, status: "replied", replies: [...prev.replies, newReply] } : null)
    setReplyText("")
    setReplySent(true)
    toast.success("Reply sent.")
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const unreadCount  = messages.filter(m => m.status === "unread").length
  const repliedCount = messages.filter(m => m.status === "replied").length
  const starredCount = messages.filter(m => m.starred).length

  const filtered = messages.filter(m => {
    const label = subjectLabels[m.subject] ?? "Other"
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase()) ||
      label.toLowerCase().includes(search.toLowerCase())
    if (filter === "unread")  return m.status === "unread"  && matchSearch
    if (filter === "starred") return m.starred && matchSearch
    if (filter === "replied") return m.status === "replied" && matchSearch
    return matchSearch
  })

  const stats = [
    { label: "Total Messages", value: messages.length,  icon: Mail },
    { label: "Unread",         value: unreadCount,       icon: MailOpen },
    { label: "Starred",        value: starredCount,      icon: Star },
    { label: "Replied",        value: repliedCount,      icon: Send },
  ]

  return (
    <DashboardLayout variant="admin" title="Messages" description="View and reply to contact messages from the website">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <Card key={i} className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-4 h-4 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main inbox layout */}
      <div className="grid lg:grid-cols-5 gap-4 h-[calc(100vh-280px)] min-h-[500px]">

        {/* Message List */}
        <div className={cn("lg:col-span-2 flex flex-col border border-border rounded-xl overflow-hidden bg-background", selected ? "hidden lg:flex" : "flex")}>
          {/* Search + filters */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" onClick={fetchMessages} disabled={loading} title="Refresh">
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                ["all",     `All (${messages.length})`],
                ["unread",  `Unread (${unreadCount})`],
                ["replied", `Replied (${repliedCount})`],
                ["starred", "Starred"],
              ].map(([val, label]) => (
                <Button
                  key={val}
                  size="sm"
                  variant={filter === val ? "default" : "outline"}
                  className={cn("text-xs h-7", filter === val && "bg-[var(--church-primary)] text-white hover:bg-[var(--church-primary-deep)]")}
                  onClick={() => setFilter(val)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <RefreshCw className="w-6 h-6 animate-spin opacity-40" />
                <p className="text-sm">Loading messages...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <Mail className="w-10 h-10 opacity-30" />
                <p className="text-sm">No messages found</p>
              </div>
            ) : filtered.map(msg => {
              const label = subjectLabels[msg.subject] ?? "Other"
              return (
                <button
                  key={msg.id}
                  className={cn(
                    "w-full text-left px-4 py-4 border-b border-border hover:bg-[var(--church-soft-gray)] transition-colors",
                    selected?.id === msg.id && "bg-[var(--church-light-blue)]",
                    msg.status === "unread" && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => openMessage(msg)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {msg.status === "unread" && <span className="w-2 h-2 rounded-full bg-[var(--church-primary)] flex-shrink-0" />}
                      <span className={cn("text-sm truncate", msg.status === "unread" ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(msg.created_at)}</span>
                  </div>
                  <p className={cn("text-sm truncate mb-1.5", msg.status === "unread" ? "font-semibold text-foreground" : "text-muted-foreground")}>
                    {msg.message.slice(0, 60)}{msg.message.length > 60 ? "…" : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs border-none px-2 py-0", tagColors[label] ?? tagColors.Other)}>
                      <Tag className="w-2.5 h-2.5 mr-1" />{label}
                    </Badge>
                    {msg.status === "replied" && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Send className="w-2.5 h-2.5" /> Replied
                      </span>
                    )}
                    {msg.starred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-auto" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Message Detail */}
        <div className={cn("lg:col-span-3 flex flex-col border border-border rounded-xl overflow-hidden bg-background", !selected ? "hidden lg:flex" : "flex")}>
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <MailOpen className="w-16 h-16 opacity-20" />
              <p className="text-sm">Select a message to read</p>
            </div>
          ) : (() => {
            const label = subjectLabels[selected.subject] ?? "Other"
            return (
              <>
                {/* Header */}
                <div className="p-5 border-b border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 flex-shrink-0" onClick={() => setSelected(null)}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Avatar className="flex-shrink-0">
                        <AvatarFallback className="bg-[var(--church-primary)] text-white font-bold">
                          {selected.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground">{selected.name}</p>
                        <p className="text-xs text-muted-foreground">{selected.email}</p>
                        {selected.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {selected.phone}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <Badge className={cn("text-xs border-none px-2 py-0", tagColors[label] ?? tagColors.Other)}>
                            {label}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs px-2 py-0",
                            selected.status === "unread"  && "border-blue-300 text-blue-600",
                            selected.status === "read"    && "border-muted text-muted-foreground",
                            selected.status === "replied" && "border-green-300 text-green-600",
                          )}>
                            {selected.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatFull(selected.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStar(selected.id)}>
                        {selected.starred
                          ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          : <StarOff className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => deleteMessage(selected.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-4">{selected.subject.charAt(0).toUpperCase() + selected.subject.slice(1)} Inquiry</h3>
                </div>

                {/* Body + replies */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selected.message}
                  </div>

                  {selected.replies.map((r, i) => (
                    <div key={i}>
                      <Separator />
                      <div className="mt-4 flex items-start gap-3">
                        <Avatar className="flex-shrink-0 w-8 h-8">
                          <AvatarFallback className="bg-green-600 text-white text-xs font-bold">AD</AvatarFallback>
                        </Avatar>
                        <div className="bg-[var(--church-soft-gray)] rounded-lg px-4 py-3 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground">Admin (You)</p>
                            <p className="text-xs text-muted-foreground">{r.time}</p>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{r.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply box */}
                <div className="p-5 border-t border-border space-y-3">
                  {replySent && (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                      <Send className="w-3.5 h-3.5" /> Reply noted — status marked as replied.
                    </p>
                  )}
                  <Textarea
                    placeholder={`Reply to ${selected.name}...`}
                    rows={4}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">Reply to: {selected.email}</p>
                    <Button
                      className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2"
                      onClick={sendReply}
                      disabled={!replyText.trim() || sending}
                    >
                      <Send className="w-4 h-4" /> {sending ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </DashboardLayout>
  )
}
