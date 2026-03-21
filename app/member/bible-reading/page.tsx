"use client"

import { useState } from 'react'
import { BookOpen, CheckCircle, ChevronRight, Star, Calendar, Flame } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const readingPlan = [
  { day: 1, date: 'Mar 15', passage: 'Genesis 1-2', title: 'The Creation', completed: true },
  { day: 2, date: 'Mar 16', passage: 'Genesis 3-4', title: 'The Fall', completed: true },
  { day: 3, date: 'Mar 17', passage: 'Genesis 5-6', title: 'Noah and His Family', completed: true },
  { day: 4, date: 'Mar 18', passage: 'Genesis 7-9', title: 'The Great Flood', completed: true },
  { day: 5, date: 'Mar 19', passage: 'Genesis 10-12', title: 'The Tower of Babel & Abram', completed: true },
  { day: 6, date: 'Mar 20', passage: 'Genesis 13-15', title: 'Lot and Abraham\'s Covenant', completed: true },
  { day: 7, date: 'Mar 21', passage: 'Genesis 16-18', title: 'Hagar and the Promise of Isaac', completed: false },
  { day: 8, date: 'Mar 22', passage: 'Genesis 19-21', title: 'Sodom and the Birth of Isaac', completed: false },
  { day: 9, date: 'Mar 23', passage: 'Genesis 22-24', title: 'The Sacrifice of Isaac', completed: false },
  { day: 10, date: 'Mar 24', passage: 'Genesis 25-27', title: 'Jacob and Esau', completed: false },
  { day: 11, date: 'Mar 25', passage: 'Genesis 28-30', title: "Jacob's Dream and Marriage", completed: false },
  { day: 12, date: 'Mar 26', passage: 'Genesis 31-33', title: "Jacob's Return", completed: false },
  { day: 13, date: 'Mar 27', passage: 'Genesis 34-36', title: 'Dinah and Esau\'s Line', completed: false },
  { day: 14, date: 'Mar 28', passage: 'Genesis 37-39', title: 'Joseph and His Brothers', completed: false },
]

const dailyVerses = [
  { date: 'Mar 21', verse: '"The LORD is my shepherd; I shall not want."', reference: 'Psalm 23:1' },
  { date: 'Mar 20', verse: '"I can do all things through Christ who strengthens me."', reference: 'Philippians 4:13' },
  { date: 'Mar 19', verse: '"Trust in the LORD with all your heart."', reference: 'Proverbs 3:5' },
]

const completed = readingPlan.filter(r => r.completed).length
const total = readingPlan.length
const progressPercent = Math.round((completed / total) * 100)
const currentDay = readingPlan.find(r => !r.completed)

export default function MemberBibleReadingPage() {
  const [checkedDays, setCheckedDays] = useState<Set<number>>(
    new Set(readingPlan.filter(r => r.completed).map(r => r.day))
  )

  const toggleDay = (day: number) => {
    setCheckedDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  const completedCount = checkedDays.size

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bible Reading</h1>
          <p className="text-muted-foreground mt-1">Follow along with the church reading plan and track your progress</p>
        </div>

        {/* Stats Row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount} days</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}/{total}</p>
                <p className="text-sm text-muted-foreground">Passages Read</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{Math.round((completedCount / total) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Plan Complete</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Reading */}
        {currentDay && (
          <Card className="mb-6 border-[var(--church-primary)]/40 bg-[var(--church-primary)]/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-[var(--church-primary)] text-white text-xs">Today</Badge>
                <CardTitle className="text-lg">Day {currentDay.day} — {currentDay.passage}</CardTitle>
              </div>
              <CardDescription className="text-base">{currentDay.title}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {currentDay.date}, 2026
              </div>
              <Button
                className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                onClick={() => toggleDay(currentDay.day)}
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Read
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Today's Verse */}
        <Card className="mb-6 bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-0">
          <CardContent className="p-6">
            <p className="text-xs font-medium opacity-80 mb-2 uppercase tracking-wide">Verse of the Day</p>
            <blockquote className="text-lg font-serif italic leading-relaxed">
              {dailyVerses[0].verse}
            </blockquote>
            <p className="mt-3 text-sm font-medium">— {dailyVerses[0].reference}</p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Reading Plan List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>March Reading Plan</CardTitle>
                  <span className="text-sm text-muted-foreground">{completedCount}/{total} completed</span>
                </div>
                <Progress value={Math.round((completedCount / total) * 100)} className="h-2" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {readingPlan.map(item => {
                    const isDone = checkedDays.has(item.day)
                    const isToday = item.day === currentDay?.day
                    return (
                      <div
                        key={item.day}
                        className={`flex items-center gap-4 px-6 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                          isToday ? 'bg-[var(--church-primary)]/5' : ''
                        }`}
                        onClick={() => toggleDay(item.day)}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500'
                            : isToday
                              ? 'border-[var(--church-primary)]'
                              : 'border-muted-foreground/30'
                        }`}>
                          {isDone && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.passage}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.title}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isToday && <Badge className="bg-[var(--church-primary)] text-white text-xs">Today</Badge>}
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Recent Verses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Daily Verses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyVerses.map((verse, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs text-muted-foreground">{verse.date}</p>
                    <p className="text-sm font-serif italic text-foreground leading-relaxed">{verse.verse}</p>
                    <p className="text-xs font-medium text-[var(--church-primary)]">— {verse.reference}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reading Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'This Month', value: `${completedCount} passages` },
                  { label: 'This Year', value: '54 passages' },
                  { label: 'Best Streak', value: '14 days' },
                  { label: 'Books Started', value: '3 books' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground text-sm">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
