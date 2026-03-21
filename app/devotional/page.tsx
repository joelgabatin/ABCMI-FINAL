"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Search, Calendar, BookOpen, ChevronLeft, ChevronRight, Bell } from "lucide-react"

const devotionals = [
  {
    id: 1, date: "March 21, 2026", rawDate: "2026-03-21", title: "Walking in the Light",
    scripture: "John 8:12", scriptureText: "Again Jesus spoke to them, saying, 'I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life.'",
    reflection: "Jesus declares Himself the Light of the world — not a light, but the light. In a world filled with confusion, moral ambiguity, and spiritual darkness, Christ offers clear direction and life. To follow Him is to walk in clarity, purpose, and peace. Today, let us choose to walk closely with Him, letting His Word illuminate our steps and His Spirit guide our decisions. When we face uncertainty, we can trust that the One who made the stars knows the path ahead.",
    featuredVerse: "Your word is a lamp to my feet and a light to my path.", featuredVerseRef: "Psalm 119:105",
    author: "Ptr. Ysrael Coyoy", featured: true
  },
  {
    id: 2, date: "March 20, 2026", rawDate: "2026-03-20", title: "The God Who Provides",
    scripture: "Philippians 4:19", scriptureText: "And my God will supply every need of yours according to his riches in glory in Christ Jesus.",
    reflection: "Paul wrote this from prison — and yet he speaks with absolute confidence in God's provision. He did not say God might supply, or sometimes supplies, but that God will supply every need according to His riches in glory. This is not a promise for comfort and luxury, but for sufficiency. God knows your needs before you ask. He sees the gaps in your life and is already working to fill them. Trust in His timing and His goodness.",
    featuredVerse: "Cast all your anxiety on him because he cares for you.", featuredVerseRef: "1 Peter 5:7",
    author: "Ptr. Fhey Coyoy", featured: false
  },
  {
    id: 3, date: "March 19, 2026", rawDate: "2026-03-19", title: "Arise and Build",
    scripture: "Nehemiah 2:18", scriptureText: "I also told them about the gracious hand of my God on me and what the king had said to me. They replied, 'Let us start rebuilding.' So they began this good work.",
    reflection: "Nehemiah faced a broken Jerusalem and a seemingly impossible mission. But when the people heard about God's gracious hand, they were stirred to action — 'Let us start rebuilding.' This is the spirit of ABCMI: to arise from what is broken and build what God has purposed. Every ministry, every outreach, every local church planted is a stone laid in God's wall of salvation. Today, be encouraged. The work is not in vain. God's hand is upon it.",
    featuredVerse: "We are God's handiwork, created in Christ Jesus to do good works.", featuredVerseRef: "Ephesians 2:10",
    author: "Ptr. Ysrael Coyoy", featured: false
  },
  {
    id: 4, date: "March 18, 2026", rawDate: "2026-03-18", title: "The Power of Prayer",
    scripture: "James 5:16", scriptureText: "The prayer of a righteous person is powerful and effective.",
    reflection: "James reminds us that prayer is not a religious ritual — it is a powerful, effective force. The Greek word for 'effective' suggests something that accomplishes its purpose. When we pray according to God's will, in faith, and in righteousness, heaven moves. Elijah was a man just like us, and his prayers shut and opened the heavens. Your prayers matter. Do not treat them as a last resort. Make them your first response.",
    featuredVerse: "Devote yourselves to prayer, being watchful and thankful.", featuredVerseRef: "Colossians 4:2",
    author: "Ptr. Julio Coyoy", featured: false
  },
  {
    id: 5, date: "March 17, 2026", rawDate: "2026-03-17", title: "Faithful in Little",
    scripture: "Luke 16:10", scriptureText: "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.",
    reflection: "God's kingdom operates on the principle of faithfulness. Before God entrusts us with greater responsibility, He watches how we handle the small things — our time, our words, our daily commitments. The servant who was faithful with little was given charge over much. Whatever God has placed in your hands today — whether a small ministry, a family to care for, or a job that feels insignificant — do it with excellence. Faithfulness in small things is the training ground for great things.",
    featuredVerse: "Well done, good and faithful servant!", featuredVerseRef: "Matthew 25:21",
    author: "Ptr. Fhey Coyoy", featured: false
  },
]

const ITEMS_PER_PAGE = 4

export default function DevotionalPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState("")
  const [prefs, setPrefs] = useState({ email: true, sms: false, daily: true, weekly: false })
  const [selected, setSelected] = useState<typeof devotionals[0] | null>(null)

  const today = devotionals[0]

  const archived = devotionals.slice(1).filter(d =>
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

          {/* Today's Reading */}
          {!selected ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30">Today</Badge>
                <span className="text-sm text-muted-foreground">{today.date}</span>
              </div>
              <Card className="mb-10 border-[var(--church-primary)]/20 shadow-md">
                <CardHeader className="pb-4">
                  <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide mb-1">Today's Reading</p>
                  <CardTitle className="text-3xl font-heading">{today.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">By {today.author}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Scripture — {today.scripture}</p>
                    <blockquote className="border-l-4 border-[var(--church-primary)] pl-5 py-1 italic text-foreground text-lg leading-relaxed bg-[var(--church-primary)]/5 rounded-r-lg">
                      {today.scriptureText}
                    </blockquote>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Reflection</p>
                    <p className="text-foreground leading-relaxed text-base">{today.reflection}</p>
                  </div>
                  <div className="bg-[var(--church-primary)] text-white rounded-xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-3">Featured Verse</p>
                    <p className="text-xl font-serif italic leading-relaxed">"{today.featuredVerse}"</p>
                    <p className="text-sm font-semibold mt-3 opacity-90">— {today.featuredVerseRef}</p>
                  </div>
                </CardContent>
              </Card>

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
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{d.date}</span>
                            <span>By {d.author}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                  {paginated.length === 0 && (
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
            </>
          ) : (
            /* Archive Detail View */
            <div>
              <Button variant="ghost" className="mb-6 gap-2" onClick={() => setSelected(null)}>
                <ChevronLeft className="w-4 h-4" /> Back to Devotionals
              </Button>
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />{selected.date}
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
                      {selected.scriptureText}
                    </blockquote>
                  </div>
                  <Separator />
                  <p className="text-foreground leading-relaxed">{selected.reflection}</p>
                  <div className="bg-[var(--church-primary)] text-white rounded-xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-3">Featured Verse</p>
                    <p className="text-xl font-serif italic leading-relaxed">"{selected.featuredVerse}"</p>
                    <p className="text-sm font-semibold mt-3 opacity-90">— {selected.featuredVerseRef}</p>
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
