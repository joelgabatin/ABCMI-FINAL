"use client"

import { useState, useEffect } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Calendar, Quote, Bell, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface ReadingPlanEntry {
  id: number
  week_start: string
  day_of_week: string
  reading: string
  notes?: string | null
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatWeekLabel(monday: Date): string {
  const sunday = new Date(monday.getTime() + 6 * 86400000)
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${fmt(monday)} – ${fmt(sunday)}, ${sunday.getFullYear()}`
}

const todaysReading = {
  date: new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }),
  oldTestament: "Psalm 23",
  newTestament: "John 10:1-18",
  featuredVerse: {
    text: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.",
    reference: "Psalm 23:1-3",
  },
  reflection: {
    title: "The Good Shepherd",
    content:
      "In today's reading, we see the beautiful picture of God as our shepherd. Just as a shepherd knows each of his sheep by name, provides for their needs, and protects them from danger, so does our Heavenly Father care for us. The shepherd imagery reminds us that we are never alone—God leads us, guides us, and restores our weary souls. As you go through this day, remember that you are deeply known and tenderly cared for by the Good Shepherd who laid down His life for His sheep.",
  },
}

export default function BibleReadingPage() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [currentWeek, setCurrentWeek] = useState<Date>(() => getMondayOfWeek(new Date()))
  const [planEntries, setPlanEntries] = useState<ReadingPlanEntry[]>([])
  const [planLoading, setPlanLoading] = useState(true)

  const weekStart = currentWeek.toISOString().split("T")[0]

  useEffect(() => {
    setPlanLoading(true)
    fetch(`/api/reading-plan?week=${weekStart}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPlanEntries(data)
        else setPlanEntries([])
      })
      .catch(() => setPlanEntries([]))
      .finally(() => setPlanLoading(false))
  }, [weekStart])

  const byDay = new Map<string, ReadingPlanEntry>()
  planEntries.forEach(e => byDay.set(e.day_of_week, e))

  const todayDayName = new Date().toLocaleDateString("en-US", { weekday: "long" })

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubscribed(true)
  }

  const prevWeek = () => setCurrentWeek(w => getMondayOfWeek(new Date(w.getTime() - 7 * 86400000)))
  const nextWeek = () => setCurrentWeek(w => getMondayOfWeek(new Date(w.getTime() + 7 * 86400000)))

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Daily Bible Reading</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {'"'}Your word is a lamp to my feet and a light to my path.{'"'} - Psalm 119:105
            </p>
          </div>
        </div>
      </section>

      {/* Today's Reading */}
      <section className="py-12 lg:py-16 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Date Header */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-5 h-5 text-[var(--church-primary)]" />
                <span className="font-semibold">{todaysReading.date}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Reading Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-background border-none shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center text-sm font-bold text-[var(--church-gold)]">OT</span>
                    Old Testament
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[var(--church-primary)]">{todaysReading.oldTestament}</p>
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-[var(--church-primary)] mt-2">
                    Read on Bible Gateway →
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--church-primary)]">NT</span>
                    New Testament
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[var(--church-primary)]">{todaysReading.newTestament}</p>
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-[var(--church-primary)] mt-2">
                    Read on Bible Gateway →
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Featured Verse */}
            <Card className="bg-gradient-to-r from-[var(--church-gold)]/10 to-[var(--church-gold)]/5 border-[var(--church-gold)]/30 mb-8">
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-[var(--church-gold)] mb-4" />
                <p className="text-xl lg:text-2xl font-serif italic text-foreground leading-relaxed mb-4">
                  {'"'}{todaysReading.featuredVerse.text}{'"'}
                </p>
                <p className="text-[var(--church-gold)] font-semibold">{todaysReading.featuredVerse.reference}</p>
              </CardContent>
            </Card>

            {/* Reflection */}
            <Card className="bg-background border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[var(--church-primary)]" />
                  Today{`'`}s Reflection: {todaysReading.reflection.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {todaysReading.reflection.content}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Weekly Plan */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section header + navigation */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">This Week{`'`}s Reading Plan</h2>
                <p className="text-muted-foreground mt-1">Follow along with our church reading plan</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="w-8 h-8" onClick={prevWeek}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-foreground min-w-[180px] text-center">
                  {formatWeekLabel(currentWeek)}
                </span>
                <Button variant="outline" size="icon" className="w-8 h-8" onClick={nextWeek}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {planLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map(day => (
                  <Card key={day} className="border border-border animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : planEntries.length === 0 ? (
              <Card className="border border-dashed">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No reading plan for this week yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Check back soon or browse another week.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map(day => {
                  const entry = byDay.get(day)
                  const isToday = day === todayDayName
                  return (
                    <Card
                      key={day}
                      className={`border transition-shadow ${
                        isToday
                          ? "border-[var(--church-primary)] bg-[var(--church-light-blue)]"
                          : entry
                          ? "border-border"
                          : "border-dashed border-muted"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-foreground text-sm">{day}</p>
                          {isToday && (
                            <span className="text-xs font-medium text-[var(--church-primary)] bg-[var(--church-primary)]/10 rounded-full px-2 py-0.5">
                              Today
                            </span>
                          )}
                        </div>
                        {entry ? (
                          <>
                            <p className="text-muted-foreground text-sm">{entry.reading}</p>
                            {entry.notes && (
                              <p className="text-xs text-muted-foreground/70 italic mt-1">{entry.notes}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground/50 text-sm italic">No reading assigned</p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-12 lg:py-16 bg-[var(--church-soft-gray)]">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card className="bg-background border-none shadow-lg">
              <CardContent className="p-8 text-center">
                {isSubscribed ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">You{`'`}re Subscribed!</h3>
                    <p className="text-muted-foreground">
                      You{`'`}ll receive daily Bible reading reminders in your inbox. God bless your reading journey!
                    </p>
                  </>
                ) : (
                  <>
                    <Bell className="w-12 h-12 text-[var(--church-primary)] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">Get Daily Reminders</h3>
                    <p className="text-muted-foreground mb-6">
                      Subscribe to receive daily Bible reading and reflection in your inbox.
                    </p>
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Label htmlFor="email" className="sr-only">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
