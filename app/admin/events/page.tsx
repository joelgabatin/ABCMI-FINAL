"use client"

import { useState } from 'react'
import {
  Calendar, Plus, Users, Clock, MapPin, Edit, Trash2, Search, Filter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const events = [
  { id: 1, title: 'Sunday Worship Service', date: 'Mar 23, 2026', time: '10:00 AM', location: 'Main Sanctuary', type: 'worship', attendees: 189, capacity: 300, status: 'upcoming', description: 'Weekly corporate worship and teaching service open to all.' },
  { id: 2, title: 'Midweek Bible Study', date: 'Mar 25, 2026', time: '7:00 PM', location: 'Fellowship Hall', type: 'study', attendees: 45, capacity: 60, status: 'upcoming', description: 'In-depth study of the book of Romans, chapters 5-6.' },
  { id: 3, title: 'Youth Fellowship Night', date: 'Mar 28, 2026', time: '6:00 PM', location: 'Youth Room', type: 'fellowship', attendees: 32, capacity: 50, status: 'upcoming', description: 'Games, worship, and a short devotional for youth ages 13-25.' },
  { id: 4, title: 'Community Outreach', date: 'Mar 29, 2026', time: '8:00 AM', location: 'Baguio City Park', type: 'outreach', attendees: 28, capacity: 40, status: 'upcoming', description: 'Community service and gospel sharing in the local park.' },
  { id: 5, title: "Children's Sunday School", date: 'Mar 23, 2026', time: '9:00 AM', location: 'Children\'s Wing', type: 'worship', attendees: 54, capacity: 80, status: 'upcoming', description: 'Bible lessons, crafts, and songs for children ages 3-12.' },
  { id: 6, title: 'Pastoral Team Meeting', date: 'Mar 24, 2026', time: '2:00 PM', location: 'Conference Room', type: 'meeting', attendees: 12, capacity: 15, status: 'upcoming', description: 'Monthly meeting of the pastoral and leadership team.' },
  { id: 7, title: 'Easter Celebration Service', date: 'Apr 5, 2026', time: '9:00 AM', location: 'Main Sanctuary', type: 'special', attendees: 0, capacity: 500, status: 'upcoming', description: 'Special Easter Sunday celebration with drama, choir, and message.' },
  { id: 8, title: 'Prayer and Fasting Day', date: 'Mar 14, 2026', time: 'All Day', location: 'Church Premises', type: 'prayer', attendees: 67, capacity: 100, status: 'completed', description: 'A day set apart for corporate prayer and fasting.' },
]

const eventTypes: Record<string, string> = {
  worship: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]',
  study: 'bg-emerald-500/10 text-emerald-600',
  fellowship: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]',
  outreach: 'bg-rose-500/10 text-rose-600',
  meeting: 'bg-slate-500/10 text-slate-600',
  special: 'bg-purple-500/10 text-purple-600',
  prayer: 'bg-blue-500/10 text-blue-600',
}

export default function AdminEventsPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'All' || e.type === filterType
    return matchSearch && matchType
  })

  const upcomingCount = events.filter(e => e.status === 'upcoming').length
  const totalAttendees = events.filter(e => e.status === 'upcoming').reduce((sum, e) => sum + e.attendees, 0)

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground mt-1">Create and manage church events</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Add a new event to the church calendar</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input placeholder="Enter event title" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="Enter location" />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input type="number" placeholder="Maximum attendees" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the event..." rows={3} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                    onClick={() => setCreateOpen(false)}
                  >
                    Create Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingCount}</p>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalAttendees}</p>
                <p className="text-sm text-muted-foreground">Total RSVPs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Completed This Month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterType === 'All' ? 'All Types' : filterType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['All', ...Object.keys(eventTypes)].map(t => (
                  <DropdownMenuItem key={t} onClick={() => setFilterType(t)} className="capitalize">{t}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(event => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className={`${eventTypes[event.type]} text-xs capitalize`}>
                    {event.type}
                  </Badge>
                  <Badge variant="secondary" className={
                    event.status === 'upcoming'
                      ? 'bg-emerald-500/10 text-emerald-600 text-xs'
                      : 'bg-muted text-muted-foreground text-xs'
                  }>
                    {event.status}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {event.attendees} / {event.capacity} attendees
                  </div>
                </div>
                {/* Capacity bar */}
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-[var(--church-primary)] h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%` }}
                  />
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </DashboardLayout>
  )
}
