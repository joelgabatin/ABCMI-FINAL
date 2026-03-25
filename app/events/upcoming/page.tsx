"use client"

import { useState, useEffect } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Users, Loader2, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { format, parseISO } from "date-fns"

interface ChurchEvent {
  id: number
  title: string
  date: string
  time: string
  end_time?: string | null
  location: string
  category: string
  description?: string | null
  image_url?: string | null
  capacity?: number | null
  featured: boolean
  status: string
  is_published: boolean
  open_registration: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  Worship: "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Study: "bg-emerald-500/10 text-emerald-700",
  Fellowship: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Outreach: "bg-rose-500/10 text-rose-700",
  Meeting: "bg-slate-500/10 text-slate-600",
  Special: "bg-purple-500/10 text-purple-700",
  Prayer: "bg-blue-500/10 text-blue-700",
  Youth: "bg-teal-500/10 text-teal-700",
  Women: "bg-pink-500/10 text-pink-700",
  Missions: "bg-indigo-500/10 text-indigo-700",
  Training: "bg-orange-500/10 text-orange-700",
  General: "bg-muted text-muted-foreground",
}

function formatDate(d: string) {
  try { return format(parseISO(d), "MMMM d, yyyy") } catch { return d }
}

function formatTime(t: string) {
  try {
    const [h, m] = t.split(":").map(Number)
    const ampm = h >= 12 ? "PM" : "AM"
    const hour = h % 12 || 12
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`
  } catch { return t }
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([])
  const [loading, setLoading] = useState(true)

  const [registerEvent, setRegisterEvent] = useState<ChurchEvent | null>(null)
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", notes: "" })
  const [regLoading, setRegLoading] = useState(false)
  const [regDone, setRegDone] = useState(false)
  const [regError, setRegError] = useState("")

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sort events by date
          const sorted = data
            .filter((e: ChurchEvent) => 
              (e.status === "upcoming" || e.status === "ongoing") && 
              (e.is_published !== false)
            )
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setEvents(sorted)
        }
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const openRegister = (ev: ChurchEvent) => {
    if (!ev.open_registration) return
    setRegisterEvent(ev)
    setRegForm({ name: "", email: "", phone: "", notes: "" })
    setRegDone(false)
    setRegError("")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerEvent) return
    setRegLoading(true)
    setRegError("")
    try {
      const res = await fetch(`/api/events/${registerEvent.id}/attendees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regForm.name,
          email: regForm.email,
          phone: regForm.phone || null,
          notes: regForm.notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setRegError(data.error ?? "Registration failed."); return }
      setRegDone(true)
    } catch {
      setRegError("Something went wrong. Please try again.")
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Special Events & Services</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
              Join us for worship, fellowship, training, and outreach. Every gathering is a special opportunity to grow together.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  <p>No upcoming events at the moment. Check back soon!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8">
                {events.map(event => {
                  const catColor = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.General
                  return (
                    <Card key={event.id} className="w-full bg-background border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                      <div className="flex flex-col">
                        {/* Full width Image */}
                        {event.image_url && (
                          <div className="w-full h-[300px] md:h-[450px] relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                              <Badge className={`${catColor} px-4 py-1.5 text-sm font-semibold shadow-lg backdrop-blur-md`}>
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                        )}

                        <CardContent className="p-6 md:p-10">
                          <div className="flex flex-col lg:flex-row gap-8">
                            {/* Date block */}
                            <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-[var(--church-primary)] text-white flex flex-col items-center justify-center shadow-lg border border-white/10">
                              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                                {format(parseISO(event.date), "MMM")}
                              </span>
                              <span className="text-4xl font-black leading-none my-1">
                                {format(parseISO(event.date), "d")}
                              </span>
                              <span className="text-xs font-bold opacity-80">
                                {format(parseISO(event.date), "yyyy")}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 space-y-4">
                              <div>
                                <h3 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight leading-tight">
                                  {event.title}
                                </h3>
                                {event.description && (
                                  <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl text-pretty">
                                    {event.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-y-3 gap-x-8 pt-2">
                                <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                                  <Clock className="w-5 h-5 text-[var(--church-primary)]" />
                                  <span className="font-medium">{formatTime(event.time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                                  <MapPin className="w-5 h-5 text-[var(--church-primary)]" />
                                  <span className="font-medium">{event.location}</span>
                                </div>
                                {event.capacity && (
                                  <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                                    <Users className="w-5 h-5 text-[var(--church-primary)]" />
                                    <span className="font-medium">{event.capacity} slots available</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="flex-shrink-0 flex items-center lg:items-end lg:pb-2">
                              {event.open_registration ? (
                                <Button
                                  size="lg"
                                  className="w-full lg:w-auto bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white h-14 px-10 text-lg font-bold shadow-xl shadow-[var(--church-primary)]/20 transition-all hover:-translate-y-1 active:translate-y-0"
                                  onClick={() => openRegister(event)}
                                >
                                  Register Now
                                </Button>
                              ) : (
                                <Button
                                  disabled
                                  size="lg"
                                  variant="outline"
                                  className="w-full lg:w-auto h-14 px-10 border-muted-foreground/30 text-muted-foreground bg-muted/20 font-bold"
                                >
                                  Registration Closed
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={registerEvent !== null} onOpenChange={open => { if (!open) setRegisterEvent(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>
              {registerEvent?.title} — {registerEvent && formatDate(registerEvent.date)}
            </DialogDescription>
          </DialogHeader>

          {regDone ? (
            <div className="py-8 text-center space-y-4">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-foreground">You&apos;re registered!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;ll see you at <strong>{registerEvent?.title}</strong>. God bless!
                </p>
              </div>
              <Button className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={() => setRegisterEvent(null)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">Full Name *</Label>
                <Input
                  id="reg-name"
                  value={regForm.name}
                  onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email Address *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={regForm.email}
                  onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-phone">Phone Number (optional)</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={regForm.phone}
                  onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+63 xxx xxx xxxx"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-notes">Notes (optional)</Label>
                <Textarea
                  id="reg-notes"
                  value={regForm.notes}
                  onChange={e => setRegForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any special needs or message..."
                  rows={2}
                />
              </div>
              {regError && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{regError}</p>
              )}
              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setRegisterEvent(null)} disabled={regLoading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                  disabled={regLoading}
                >
                  {regLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {regLoading ? "Registering..." : "Register Now"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  )
}
