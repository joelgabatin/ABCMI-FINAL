"use client"

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const allEvents = [
  { id: 1, title: 'Sunday Worship Service', date: 'Mar 23, 2026', time: '10:00 AM', location: 'Main Sanctuary', type: 'worship', description: 'Weekly corporate worship and teaching service open to all. Come and be refreshed in God\'s presence.', attendees: 189, capacity: 300, rsvpd: true },
  { id: 2, title: 'Midweek Bible Study', date: 'Mar 25, 2026', time: '7:00 PM', location: 'Fellowship Hall', type: 'study', description: 'In-depth study of the book of Romans. Bring your Bible and a notebook!', attendees: 45, capacity: 60, rsvpd: true },
  { id: 3, title: 'Youth Fellowship Night', date: 'Mar 28, 2026', time: '6:00 PM', location: 'Youth Room', type: 'fellowship', description: 'Games, worship, and a short devotional for youth ages 13-25.', attendees: 32, capacity: 50, rsvpd: false },
  { id: 4, title: 'Community Outreach', date: 'Mar 29, 2026', time: '8:00 AM', location: 'Baguio City Park', type: 'outreach', description: 'Join us as we serve our community and share the love of Christ.', attendees: 28, capacity: 40, rsvpd: false },
  { id: 5, title: "Children's Sunday School", date: 'Mar 23, 2026', time: '9:00 AM', location: "Children's Wing", type: 'worship', description: 'Bible lessons, crafts, and songs for children ages 3-12.', attendees: 54, capacity: 80, rsvpd: false },
  { id: 6, title: 'Easter Celebration Service', date: 'Apr 5, 2026', time: '9:00 AM', location: 'Main Sanctuary', type: 'special', description: 'Special Easter Sunday celebration! Bring your family and friends for this joyful occasion.', attendees: 12, capacity: 500, rsvpd: false },
  { id: 7, title: 'Women\'s Prayer Breakfast', date: 'Apr 12, 2026', time: '8:00 AM', location: 'Fellowship Hall', type: 'fellowship', description: 'A morning of prayer, worship, and fellowship for all women of the church.', attendees: 18, capacity: 50, rsvpd: false },
  { id: 8, title: 'Youth Camp 2026', date: 'Apr 18-20, 2026', time: '7:00 AM', location: 'Sto. Tomas, Benguet', type: 'special', description: 'Three-day youth camp for ages 13-25. Registration required. Limited slots available!', attendees: 34, capacity: 60, rsvpd: true },
]

const typeColors: Record<string, string> = {
  worship: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]',
  study: 'bg-emerald-500/10 text-emerald-600',
  fellowship: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]',
  outreach: 'bg-rose-500/10 text-rose-600',
  special: 'bg-blue-500/10 text-blue-600',
}

export default function MemberEventsPage() {
  const [rsvpd, setRsvpd] = useState<Record<number, boolean>>(
    Object.fromEntries(allEvents.map(e => [e.id, e.rsvpd]))
  )

  const handleRsvp = (id: number) => {
    setRsvpd(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const myEvents = allEvents.filter(e => rsvpd[e.id])

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-1">Browse upcoming events and manage your RSVPs</p>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">All Events</TabsTrigger>
            <TabsTrigger value="mine">
              My RSVPs
              {myEvents.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-[var(--church-primary)] text-white text-xs px-1.5 py-0">
                  {myEvents.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allEvents.map(event => (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className={`${typeColors[event.type]} text-xs capitalize`}>
                        {event.type}
                      </Badge>
                      {rsvpd[event.id] && (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          RSVP'd
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base mt-1">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {event.attendees} attending · {event.capacity - event.attendees} spots left
                      </div>
                    </div>
                    {/* Capacity bar */}
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-[var(--church-primary)] h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%` }}
                      />
                    </div>
                    <Button
                      size="sm"
                      className={`w-full mt-auto ${
                        rsvpd[event.id]
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : 'bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white'
                      }`}
                      onClick={() => handleRsvp(event.id)}
                    >
                      {rsvpd[event.id] ? 'Cancel RSVP' : 'RSVP Now'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mine">
            {myEvents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">No RSVPs yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Browse upcoming events and RSVP to the ones you plan to attend.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myEvents.map(event => (
                  <Card key={event.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-7 h-7 text-[var(--church-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground">{event.title}</p>
                          <Badge variant="secondary" className={`${typeColors[event.type]} text-xs capitalize`}>
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{event.date}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{event.time}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{event.location}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 text-destructive hover:text-destructive border-destructive/30"
                        onClick={() => handleRsvp(event.id)}
                      >
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
