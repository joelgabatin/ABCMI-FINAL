"use client"

import { useState, useEffect } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Search, Calendar, BookOpen, ChevronLeft, ChevronRight, Bell, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format, isWithinInterval, parseISO } from "date-fns"

interface Devotional {
  id: number
  date: string
  title: string
  scripture: string
  scripture_text: string
  reflection: string
  featured_verse: string
  featured_verse_ref: string
  published: boolean
  featured: boolean
  author: string
  status: 'active' | 'archived'
  schedule_start?: string | null
  schedule_end?: string | null
}

const ITEMS_PER_PAGE = 4

export default function DevotionalPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState("")
  const [prefs, setPrefs] = useState({ email: true, sms: false, daily: true, weekly: false })
  const [selected, setSelected] = useState<Devotional | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchDevotionals()
  }, [])

  const fetchDevotionals = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('daily_devotions')
      .select('*')
      .eq('published', true)
      .eq('status', 'active')
      .order('date', { ascending: false })

    if (!error && data) {
      setDevotionals(data)
    }
    setLoading(false)
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMMM d, yyyy")
    } catch (e) {
      return dateStr
    }
  }

  // Prefer a scheduled devotional that is active right now
  const scheduledToday = devotionals.find(d => {
    if (!d.schedule_start || !d.schedule_end) return false
    try {
      const now = new Date(); now.setHours(0, 0, 0, 0)
      return isWithinInterval(now, { start: parseISO(d.schedule_start), end: parseISO(d.schedule_end) })
    } catch { return false }
  })
  const today = scheduledToday ?? devotionals[0]

  const archived = devotionals.filter(d => d.id !== today?.id).filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.scripture.toLowerCase().includes(search.toLowerCase()) ||
    d.date.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(archived.length / ITEMS_PER_PAGE)
  const paginated = archived.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleSubscribe = (e: React.FormEvent) => { e.preventDefault(); setSubscribed(true) }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[var(--church-light-blue)]">
        {/* Hero */}
        <div className="bg-[var(--church-primary)] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" /> Daily Devotional
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-balance">
              Daily Devotional
            </h1>
            <p className="text-lg opacity-90 max-w-xl mx-auto">
              Start each day grounded in God's Word. New devotionals published every morning.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20 animate-pulse" />
              <p>Loading devotionals...</p>
            </div>
          ) : !selected ? (
            <>
              {/* Today's Reading */}
              {today ? (
                <>
                  <div className="mb-4 flex items-center gap-2 flex-wrap">
                    <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30">Latest</Badge>
                    {scheduledToday && (
                      <Badge className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Scheduled Reading
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">{formatDate(today.date)}</span>
                  </div>
                  <Card className="mb-10 border-[var(--church-primary)]/20 shadow-md">
                    <CardHeader className="pb-4">
                      <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide mb-1">Latest Reading</p>
                      <CardTitle className="text-3xl font-heading">{today.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">By {today.author}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Scripture — {today.scripture}</p>
                        <blockquote className="border-l-4 border-[var(--church-primary)] pl-5 py-1 italic text-foreground text-lg leading-relaxed bg-[var(--church-primary)]/5 rounded-r-lg">
                          {today.scripture_text}
                        </blockquote>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Reflection</p>
                        <p className="text-foreground leading-relaxed text-base whitespace-pre-wrap">{today.reflection}</p>
                      </div>
                      <div className="bg-[var(--church-primary)] text-white rounded-xl p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-3">Featured Verse</p>
                        <p className="text-xl font-serif italic leading-relaxed">"{today.featured_verse}"</p>
                        <p className="text-sm font-semibold mt-3 opacity-90">— {today.featured_verse_ref}</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="mb-10"><CardContent className="p-12 text-center text-muted-foreground">No devotionals found.</CardContent></Card>
              )}

              {/* Subscription */}
              <Card className="mb-10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--church-gold)]/15 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-[var(--church-gold)]" />
                    </div>
                    <div>
                      <CardTitle>Subscribe to Daily Devotionals</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">Get each devotional delivered to you every morning.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {subscribed ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                      <p className="text-emerald-600 font-medium">You are subscribed!</p>
                      <p className="text-sm text-muted-foreground mt-1">Daily devotionals will be sent to {email}.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="sub-email">Email Address</Label>
                        <Input id="sub-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "email", label: "Email Delivery", key: "email" as const },
                          { id: "sms", label: "SMS Notification", key: "sms" as const },
                          { id: "daily", label: "Daily Devotional", key: "daily" as const },
                          { id: "weekly", label: "Weekly Digest", key: "weekly" as const },
                        ].map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`pref-${item.id}`}
                              checked={prefs[item.key]}
                              onCheckedChange={v => setPrefs(p => ({ ...p, [item.key]: !!v }))}
                            />
                            <Label htmlFor={`pref-${item.id}`} className="cursor-pointer text-sm">{item.label}</Label>
                          </div>
                        ))}
                      </div>
                      <Button type="submit" className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                        Subscribe Now
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Archive */}
              {devotionals.length > 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">Devotional Archive</h2>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, scripture, or date..."
                      className="pl-9"
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1) }}
                    />
                  </div>
                  <div className="space-y-3">
                    {paginated.map(d => (
                      <Card key={d.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(d)}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-[var(--church-primary)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground">{d.title}</p>
                            <p className="text-xs text-[var(--church-primary)] font-medium">{d.scripture}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(d.date)}</span>
                              <span>By {d.author}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </CardContent>
                      </Card>
                    ))}
                    {paginated.length === 0 && search && (
                      <Card><CardContent className="p-8 text-center text-muted-foreground">No devotionals found matching your search.</CardContent></Card>
                    )}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                      <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Archive Detail View */
            <div>
              <Button variant="ghost" className="mb-6 gap-2" onClick={() => setSelected(null)}>
                <ChevronLeft className="w-4 h-4" /> Back to Devotionals
              </Button>
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />{formatDate(selected.date)}
              </div>
              <Card className="border-[var(--church-primary)]/20 shadow-md">
                <CardHeader>
                  <CardTitle className="text-3xl font-heading">{selected.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">By {selected.author}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Scripture — {selected.scripture}</p>
                    <blockquote className="border-l-4 border-[var(--church-primary)] pl-5 py-1 italic text-foreground text-lg leading-relaxed bg-[var(--church-primary)]/5 rounded-r-lg">
                      {selected.scripture_text}
                    </blockquote>
                  </div>
                  <Separator />
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selected.reflection}</p>
                  <div className="bg-[var(--church-primary)] text-white rounded-xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-3">Featured Verse</p>
                    <p className="text-xl font-serif italic leading-relaxed">"{selected.featured_verse}"</p>
                    <p className="text-sm font-semibold mt-3 opacity-90">— {selected.featured_verse_ref}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  )
}
