"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Search, Mail, MailOpen, Reply, Trash2, Star,
  StarOff, Archive, Send, ChevronLeft, Clock, Tag
} from "lucide-react"
import { cn } from "@/lib/utils"

const sampleMessages = [
  {
    id: 1, from: "Maria Santos", email: "maria.santos@gmail.com",
    subject: "Prayer Request for My Family",
    preview: "Good day, I would like to humbly request prayers for my family who are going through a difficult season...",
    body: `Good day Pastor,\n\nI would like to humbly request prayers for my family who are going through a very difficult season financially and in terms of health. My husband recently lost his job and my mother is ill.\n\nPlease pray for God's provision and healing. Thank you so much and God bless ABCMI.\n\nIn Christ,\nMaria Santos`,
    time: "10:32 AM", date: "Mar 21, 2026", tag: "Prayer", read: false, starred: true,
    replies: [],
  },
  {
    id: 2, from: "John Reyes", email: "john.reyes@gmail.com",
    subject: "Missions Training Inquiry",
    preview: "Good afternoon. I saw the announcement about the Missions Training in July. I would like to know more about...",
    body: `Good afternoon,\n\nI saw the announcement about the Missions Training in July 2025. I would like to know more about the requirements and if there is a scholarship available for participants who cannot afford the training fee.\n\nI am very interested in church planting and I feel God is calling me in this direction.\n\nThank you and God bless,\nJohn Reyes`,
    time: "9:15 AM", date: "Mar 21, 2026", tag: "Missions", read: false, starred: false,
    replies: [],
  },
  {
    id: 3, from: "Grace Bautista", email: "grace.b@yahoo.com",
    subject: "General Inquiry — Sunday Service",
    preview: "Hello, I am new to Baguio City and I am looking for a church to attend. I found ABCMI online...",
    body: `Hello,\n\nI am new to Baguio City and I am looking for a church to attend. I found ABCMI online and I love the vision and mission of the church.\n\nMay I ask what time the Sunday service starts and is there a welcome service for newcomers?\n\nGod bless,\nGrace Bautista`,
    time: "Yesterday", date: "Mar 20, 2026", tag: "General", read: true, starred: false,
    replies: [
      { from: "Admin", body: "Hello Grace, welcome to Baguio! Our Sunday service starts at 9:00 AM. We have a Newcomers Welcome every first Sunday of the month. We hope to see you this Sunday!", time: "Mar 20, 2026 2:14 PM" }
    ],
  },
  {
    id: 4, from: "Ramon dela Cruz", email: "ramon.dc@gmail.com",
    subject: "Donation Receipt Request",
    preview: "Good morning. I donated last month and would like to request an official receipt for tax purposes...",
    body: `Good morning,\n\nI donated last February and would like to request an official acknowledgment receipt for tax purposes.\n\nThe donation was made via GCash on February 10, 2026 in the amount of PHP 5,000 to the Building Fund.\n\nThank you,\nRamon dela Cruz`,
    time: "Mar 19", date: "Mar 19, 2026", tag: "Donations", read: true, starred: false,
    replies: [],
  },
  {
    id: 5, from: "Ana Villanueva", email: "ana.v@gmail.com",
    subject: "Counseling Session Request",
    preview: "Dear Pastor, I am going through a very difficult time in my marriage and would like to request a counseling...",
    body: `Dear Pastor,\n\nI am going through a very difficult time in my marriage and would like to request a counseling session at the soonest possible time. My husband and I have been struggling for months now and we both feel we need spiritual and relational guidance.\n\nWe are open to any available schedule. Thank you and please pray for us.\n\nBlessings,\nAna Villanueva`,
    time: "Mar 18", date: "Mar 18, 2026", tag: "Counseling", read: true, starred: true,
    replies: [],
  },
]

const tagColors: Record<string, string> = {
  Prayer: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Missions: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  General: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Donations: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Counseling: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Membership: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(sampleMessages)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<typeof sampleMessages[0] | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replySent, setReplySent] = useState(false)
  const [filter, setFilter] = useState("all")

  const unreadCount = messages.filter(m => !m.read).length

  const filtered = messages.filter(m => {
    const matchesSearch = m.from.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.tag.toLowerCase().includes(search.toLowerCase())
    if (filter === "unread") return !m.read && matchesSearch
    if (filter === "starred") return m.starred && matchesSearch
    return matchesSearch
  })

  function openMessage(msg: typeof sampleMessages[0]) {
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    setSelected({ ...msg, read: true })
    setReplyText("")
    setReplySent(false)
  }

  function toggleStar(id: number) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, starred: !prev.starred } : null)
  }

  function deleteMessage(id: number) {
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  function sendReply() {
    if (!replyText.trim() || !selected) return
    const newReply = { from: "Admin", body: replyText, time: new Date().toLocaleString() }
    setMessages(prev => prev.map(m =>
      m.id === selected.id ? { ...m, replies: [...m.replies, newReply] } : m
    ))
    setSelected(prev => prev ? { ...prev, replies: [...prev.replies, newReply] } : null)
    setReplyText("")
    setReplySent(true)
  }

  const stats = [
    { label: "Total Messages", value: messages.length, icon: Mail },
    { label: "Unread", value: unreadCount, icon: MailOpen },
    { label: "Starred", value: messages.filter(m => m.starred).length, icon: Star },
    { label: "Replied", value: messages.filter(m => m.replies.length > 0).length, icon: Send },
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {[["all", "All"], ["unread", `Unread (${unreadCount})`], ["starred", "Starred"]].map(([val, label]) => (
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
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <Mail className="w-10 h-10 opacity-30" />
                <p className="text-sm">No messages found</p>
              </div>
            ) : (
              filtered.map(msg => (
                <button
                  key={msg.id}
                  className={cn(
                    "w-full text-left px-4 py-4 border-b border-border hover:bg-[var(--church-soft-gray)] transition-colors",
                    selected?.id === msg.id && "bg-[var(--church-light-blue)]",
                    !msg.read && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => openMessage(msg)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-[var(--church-primary)] flex-shrink-0" />}
                      <span className={cn("text-sm truncate", !msg.read ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
                        {msg.from}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{msg.time}</span>
                  </div>
                  <p className={cn("text-sm truncate mb-1", !msg.read ? "font-semibold text-foreground" : "text-muted-foreground")}>
                    {msg.subject}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs border-none px-2 py-0", tagColors[msg.tag] || tagColors.General)}>
                      <Tag className="w-2.5 h-2.5 mr-1" />{msg.tag}
                    </Badge>
                    {msg.replies.length > 0 && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Send className="w-2.5 h-2.5" /> Replied
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className={cn("lg:col-span-3 flex flex-col border border-border rounded-xl overflow-hidden bg-background", !selected ? "hidden lg:flex" : "flex")}>
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <MailOpen className="w-16 h-16 opacity-20" />
              <p className="text-sm">Select a message to read</p>
            </div>
          ) : (
            <>
              {/* Message header */}
              <div className="p-5 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden h-8 w-8 flex-shrink-0"
                      onClick={() => setSelected(null)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Avatar className="flex-shrink-0">
                      <AvatarFallback className="bg-[var(--church-primary)] text-white font-bold">
                        {selected.from.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{selected.from}</p>
                      <p className="text-xs text-muted-foreground truncate">{selected.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={cn("text-xs border-none px-2 py-0", tagColors[selected.tag] || tagColors.General)}>
                          {selected.tag}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {selected.date}
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => deleteMessage(selected.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-4">{selected.subject}</h3>
              </div>

              {/* Body + replies */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Original message */}
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {selected.body}
                </div>

                {/* Thread replies */}
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
                    <Send className="w-3.5 h-3.5" /> Reply sent successfully.
                  </p>
                )}
                <Textarea
                  placeholder={`Reply to ${selected.from}...`}
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="resize-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Reply will be sent to: {selected.email}</p>
                  <Button
                    className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2"
                    onClick={sendReply}
                    disabled={!replyText.trim()}
                  >
                    <Send className="w-4 h-4" /> Send Reply
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
