"use client"

import { useState } from 'react'
import {
  Plus, Edit, Trash2, Search, ChevronLeft, Calendar,
  Users, Clock, MapPin, Eye, EyeOff
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const iconOptions = ['Music', 'Heart', 'Users', 'Globe', 'BookOpen', 'Baby', 'Stethoscope', 'Star', 'Flame', 'Cross']
const colorOptions = [
  { label: 'Church Blue', value: 'bg-[var(--church-primary)]' },
  { label: 'Gold', value: 'bg-[var(--church-gold)]' },
  { label: 'Emerald', value: 'bg-emerald-500' },
  { label: 'Rose', value: 'bg-rose-500' },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Indigo', value: 'bg-indigo-500' },
  { label: 'Teal', value: 'bg-teal-500' },
  { label: 'Pink', value: 'bg-pink-500' },
]

const initialMinistries = [
  { id: 1, name: 'Music Ministry', leader: 'Ptr. Fhey Coyoy', description: 'Leading the congregation in worship through music and song. We glorify God with our voices and instruments.', meetingTime: 'Saturdays, 4:00 PM', color: 'bg-[var(--church-primary)]', icon: 'Music', members: 24, visible: true },
  { id: 2, name: 'Dance Ministry', leader: 'Sister Ana Villanueva', description: 'Expressing worship through movement and dance. We use the art of dance to praise God and minister to the congregation.', meetingTime: 'Saturdays, 3:00 PM', color: 'bg-pink-500', icon: 'Star', members: 15, visible: true },
  { id: 3, name: 'Singles and Adults Ministry (SAM)', leader: 'Ptr. Billy Antero', description: 'Connecting single adults and mature members through fellowship, Bible study, and community service.', meetingTime: 'Sundays after service', color: 'bg-[var(--church-gold)]', icon: 'Users', members: 38, visible: true },
  { id: 4, name: 'Youth Ministry (ABCMI Youth)', leader: 'Ptr. Emannuel Marbella', description: 'Empowering young people to live out their faith and become leaders for Christ through relevant teaching and fellowship.', meetingTime: 'Fridays, 6:00 PM', color: 'bg-emerald-500', icon: 'Flame', members: 45, visible: true },
  { id: 5, name: "Men's Ministry", leader: 'Ptr. Julio Coyoy', description: 'Building godly men through accountability, Bible study, and fellowship. Encouraging men to lead their families and serve the church.', meetingTime: 'Saturdays, 6:00 AM', color: 'bg-indigo-500', icon: 'Users', members: 29, visible: true },
  { id: 6, name: "Women's Ministry", leader: 'Ptr. Mirriam Anno', description: 'Nurturing women in their faith journey through Bible study, prayer, and mutual support. Building strong, godly women.', meetingTime: 'Saturdays, 9:00 AM', color: 'bg-rose-500', icon: 'Heart', members: 41, visible: true },
  { id: 7, name: "Children's Ministry", leader: 'Ptr. Divina Dangilan', description: 'Teaching children the Word of God in fun and engaging ways. Laying the foundation of faith in young hearts.', meetingTime: 'Sundays during service', color: 'bg-orange-500', icon: 'Baby', members: 52, visible: true },
  { id: 8, name: 'Health Ministry', leader: 'Ptr. Rosel Montero', description: 'Caring for the physical well-being of our community as an extension of Christ\'s love. Providing health education and assistance.', meetingTime: 'Monthly health programs', color: 'bg-teal-500', icon: 'Stethoscope', members: 18, visible: true },
  { id: 9, name: 'Missions and Evangelism Ministry', leader: 'Ptr. Ysrael Coyoy', description: 'Spreading the Gospel locally and globally through church planting, outreach programs, and mission trips.', meetingTime: 'Monthly planning meetings', color: 'bg-[var(--church-primary)]', icon: 'Globe', members: 33, visible: true },
  { id: 10, name: 'Discipleship Group', leader: 'Ptr. Marvin Anno', description: 'Growing deeper in faith through intentional Bible study and one-on-one mentorship. Making disciples who make disciples.', meetingTime: 'Weekly small groups', color: 'bg-indigo-500', icon: 'BookOpen', members: 27, visible: true },
  { id: 11, name: 'Counseling Ministry', leader: 'Ptr. Josie Perilla-Cayto', description: 'Providing spiritual and emotional support through confidential counseling sessions. Walking alongside those in need.', meetingTime: 'By appointment', color: 'bg-teal-500', icon: 'Heart', members: 8, visible: true },
]

const initialEvents: Record<number, { id: number; title: string; date: string; time: string; location: string; description: string; type: string }[]> = {
  1: [
    { id: 1, title: 'Worship Workshop', date: '2026-04-05', time: '14:00', location: 'Main Sanctuary', description: 'Hands-on worship leading training for all musicians.', type: 'Training' },
    { id: 2, title: 'Praise Night', date: '2026-04-12', time: '18:00', location: 'Main Sanctuary', description: 'An evening of worship and praise open to all.', type: 'Service' },
  ],
  4: [
    { id: 3, title: 'Youth Camp 2026', date: '2026-05-10', time: '08:00', location: 'Camp John Hay, Baguio', description: 'Annual youth camp for spiritual formation and fellowship.', type: 'Retreat' },
    { id: 4, title: 'Youth Outreach', date: '2026-04-18', time: '09:00', location: 'Burnham Park, Baguio', description: 'Gospel sharing and community service at the park.', type: 'Outreach' },
  ],
  9: [
    { id: 5, title: 'Mission Training Seminar', date: '2026-04-25', time: '09:00', location: 'Fellowship Hall', description: 'Training for upcoming mission trip to Laos.', type: 'Training' },
  ],
  3: [
    { id: 6, title: 'Singles Fellowship Night', date: '2026-04-11', time: '18:00', location: 'Fellowship Hall', description: 'Monthly fellowship and Bible sharing for singles and adults.', type: 'Fellowship' },
  ],
}

const eventTypeColors: Record<string, string> = {
  Training: 'bg-blue-500/10 text-blue-600',
  Service: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]',
  Retreat: 'bg-emerald-500/10 text-emerald-600',
  Outreach: 'bg-rose-500/10 text-rose-600',
  Fellowship: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]',
  Special: 'bg-purple-500/10 text-purple-600',
}

const emptyMinistry = { name: '', leader: '', description: '', meetingTime: '', color: 'bg-[var(--church-primary)]', icon: 'Users', members: 0, visible: true }
const emptyEvent = { title: '', date: '', time: '', location: '', description: '', type: 'Service' }

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState(initialMinistries)
  const [events, setEvents] = useState(initialEvents)
  const [search, setSearch] = useState('')
  const [selectedMinistryId, setSelectedMinistryId] = useState<number | null>(null)
  const [createMinistryOpen, setCreateMinistryOpen] = useState(false)
  const [editMinistry, setEditMinistry] = useState<typeof initialMinistries[0] | null>(null)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<typeof emptyEvent & { id?: number } | null>(null)
  const [ministryForm, setMinistryForm] = useState(emptyMinistry)
  const [eventForm, setEventForm] = useState(emptyEvent)

  const selectedMinistry = selectedMinistryId !== null
    ? ministries.find(m => m.id === selectedMinistryId)
    : null
  const ministryEvents = selectedMinistryId !== null ? (events[selectedMinistryId] || []) : []

  const filtered = ministries.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.leader.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreateMinistry = () => {
    const newM = { ...ministryForm, id: Date.now() }
    setMinistries(prev => [...prev, newM])
    setMinistryForm(emptyMinistry)
    setCreateMinistryOpen(false)
  }

  const handleUpdateMinistry = () => {
    if (!editMinistry) return
    setMinistries(prev => prev.map(m => m.id === editMinistry.id ? editMinistry : m))
    setEditMinistry(null)
  }

  const handleDeleteMinistry = (id: number) => {
    setMinistries(prev => prev.filter(m => m.id !== id))
    if (selectedMinistryId === id) setSelectedMinistryId(null)
  }

  const handleToggleVisible = (id: number) => {
    setMinistries(prev => prev.map(m => m.id === id ? { ...m, visible: !m.visible } : m))
  }

  const handleCreateEvent = () => {
    if (!selectedMinistryId) return
    const newE = { ...eventForm, id: Date.now() }
    setEvents(prev => ({ ...prev, [selectedMinistryId]: [...(prev[selectedMinistryId] || []), newE] }))
    setEventForm(emptyEvent)
    setCreateEventOpen(false)
  }

  const handleUpdateEvent = () => {
    if (!selectedMinistryId || !editEvent?.id) return
    setEvents(prev => ({
      ...prev,
      [selectedMinistryId]: prev[selectedMinistryId].map(e => e.id === editEvent.id ? { ...editEvent, id: editEvent.id } : e)
    }))
    setEditEvent(null)
  }

  const handleDeleteEvent = (eventId: number) => {
    if (!selectedMinistryId) return
    setEvents(prev => ({ ...prev, [selectedMinistryId]: prev[selectedMinistryId].filter(e => e.id !== eventId) }))
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ministries</h1>
            <p className="text-muted-foreground mt-1">Manage church ministries and their events shown on the website</p>
          </div>
          <Dialog open={createMinistryOpen} onOpenChange={setCreateMinistryOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" />
                Add Ministry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Ministry</DialogTitle>
                <DialogDescription>This will appear on the Ministries page of the website</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Ministry Name</Label><Input value={ministryForm.name} onChange={e => setMinistryForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Music Ministry" /></div>
                <div className="space-y-2"><Label>Ministry Leader</Label><Input value={ministryForm.leader} onChange={e => setMinistryForm(f => ({ ...f, leader: e.target.value }))} placeholder="e.g. Ptr. Fhey Coyoy" /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={ministryForm.description} onChange={e => setMinistryForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                <div className="space-y-2"><Label>Meeting Schedule</Label><Input value={ministryForm.meetingTime} onChange={e => setMinistryForm(f => ({ ...f, meetingTime: e.target.value }))} placeholder="e.g. Saturdays, 4:00 PM" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select value={ministryForm.color} onValueChange={v => setMinistryForm(f => ({ ...f, color: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{colorOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Member Count</Label>
                    <Input type="number" value={ministryForm.members} onChange={e => setMinistryForm(f => ({ ...f, members: Number(e.target.value) }))} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={ministryForm.visible} onCheckedChange={v => setMinistryForm(f => ({ ...f, visible: v }))} />
                  <Label>Visible on website</Label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCreateMinistryOpen(false)}>Cancel</Button>
                  <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={handleCreateMinistry}>Create Ministry</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card><CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center"><Users className="w-5 h-5 text-[var(--church-primary)]" /></div>
            <div><p className="text-2xl font-bold text-foreground">{ministries.length}</p><p className="text-sm text-muted-foreground">Total Ministries</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Eye className="w-5 h-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-foreground">{ministries.filter(m => m.visible).length}</p><p className="text-sm text-muted-foreground">Visible on Website</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center"><Users className="w-5 h-5 text-[var(--church-gold)]" /></div>
            <div><p className="text-2xl font-bold text-foreground">{ministries.reduce((s, m) => s + m.members, 0)}</p><p className="text-sm text-muted-foreground">Total Members Serving</p></div>
          </CardContent></Card>
        </div>

        {/* Main content — ministry list or detail */}
        {selectedMinistry ? (
          // Ministry detail with events
          <div className="space-y-4">
            <Button variant="outline" className="gap-2" onClick={() => setSelectedMinistryId(null)}>
              <ChevronLeft className="w-4 h-4" />
              Back to Ministries
            </Button>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className={`w-14 h-14 rounded-xl ${selectedMinistry.color} flex items-center justify-center flex-shrink-0`}>
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-2xl font-bold text-foreground">{selectedMinistry.name}</h2>
                      <Badge variant="secondary" className={selectedMinistry.visible ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}>
                        {selectedMinistry.visible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-0.5">Led by {selectedMinistry.leader}</p>
                    <p className="text-muted-foreground text-sm mt-1">{selectedMinistry.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedMinistry.meetingTime}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{selectedMinistry.members} members</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events for this ministry */}
            <Tabs defaultValue="events">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <TabsList>
                  <TabsTrigger value="events">Ministry Events ({ministryEvents.length})</TabsTrigger>
                </TabsList>
                <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                      <Plus className="w-4 h-4" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Event for {selectedMinistry.name}</DialogTitle>
                      <DialogDescription>This event will be shown under this ministry on the website</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2"><Label>Event Title</Label><Input value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2"><Label>Date</Label><Input type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Time</Label><Input type="time" value={eventForm.time} onChange={e => setEventForm(f => ({ ...f, time: e.target.value }))} /></div>
                      </div>
                      <div className="space-y-2"><Label>Location</Label><Input value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} /></div>
                      <div className="space-y-2">
                        <Label>Event Type</Label>
                        <Select value={eventForm.type} onValueChange={v => setEventForm(f => ({ ...f, type: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{Object.keys(eventTypeColors).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Description</Label><Textarea value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setCreateEventOpen(false)}>Cancel</Button>
                        <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={handleCreateEvent}>Add Event</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <TabsContent value="events">
                {ministryEvents.length === 0 ? (
                  <Card><CardContent className="p-12 text-center text-muted-foreground">No events yet for this ministry.</CardContent></Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {ministryEvents.map(event => (
                      <Card key={event.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="secondary" className={`text-xs ${eventTypeColors[event.type] || 'bg-muted text-muted-foreground'}`}>{event.type}</Badge>
                            <div className="flex gap-1">
                              {/* Edit event dialog */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditEvent({ ...event })}>
                                    <Edit className="w-3.5 h-3.5" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Edit Event</DialogTitle>
                                  </DialogHeader>
                                  {editEvent && (
                                    <div className="space-y-4 pt-2">
                                      <div className="space-y-2"><Label>Title</Label><Input value={editEvent.title} onChange={e => setEditEvent(f => f ? { ...f, title: e.target.value } : f)} /></div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2"><Label>Date</Label><Input type="date" value={editEvent.date} onChange={e => setEditEvent(f => f ? { ...f, date: e.target.value } : f)} /></div>
                                        <div className="space-y-2"><Label>Time</Label><Input type="time" value={editEvent.time} onChange={e => setEditEvent(f => f ? { ...f, time: e.target.value } : f)} /></div>
                                      </div>
                                      <div className="space-y-2"><Label>Location</Label><Input value={editEvent.location} onChange={e => setEditEvent(f => f ? { ...f, location: e.target.value } : f)} /></div>
                                      <div className="space-y-2"><Label>Description</Label><Textarea value={editEvent.description} onChange={e => setEditEvent(f => f ? { ...f, description: e.target.value } : f)} rows={3} /></div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1" onClick={() => setEditEvent(null)}>Cancel</Button>
                                        <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={handleUpdateEvent}>Save Changes</Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Delete event?</AlertDialogTitle><AlertDialogDescription>This removes "{event.title}" from the ministry page.</AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive text-white" onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <CardTitle className="text-base mt-1">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="w-3 h-3" />{event.date} at {event.time}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{event.location}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          // Ministry list
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search ministries..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(ministry => (
                <Card key={ministry.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${ministry.color} flex items-center justify-center flex-shrink-0`}>
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm leading-tight">{ministry.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">{ministry.leader}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={ministry.visible ? "text-xs bg-emerald-500/10 text-emerald-600 flex-shrink-0" : "text-xs bg-muted text-muted-foreground flex-shrink-0"}>
                        {ministry.visible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">{ministry.description}</p>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ministry.meetingTime}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ministry.members} members</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{(events[ministry.id] || []).length} events</span>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                      <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs" onClick={() => setSelectedMinistryId(ministry.id)}>
                        <Calendar className="w-3 h-3" />
                        Events
                      </Button>
                      {/* Edit ministry */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setEditMinistry({ ...ministry })}>
                            <Edit className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Edit Ministry</DialogTitle></DialogHeader>
                          {editMinistry && (
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2"><Label>Ministry Name</Label><Input value={editMinistry.name} onChange={e => setEditMinistry(f => f ? { ...f, name: e.target.value } : f)} /></div>
                              <div className="space-y-2"><Label>Ministry Leader</Label><Input value={editMinistry.leader} onChange={e => setEditMinistry(f => f ? { ...f, leader: e.target.value } : f)} /></div>
                              <div className="space-y-2"><Label>Description</Label><Textarea value={editMinistry.description} onChange={e => setEditMinistry(f => f ? { ...f, description: e.target.value } : f)} rows={3} /></div>
                              <div className="space-y-2"><Label>Meeting Schedule</Label><Input value={editMinistry.meetingTime} onChange={e => setEditMinistry(f => f ? { ...f, meetingTime: e.target.value } : f)} /></div>
                              <div className="space-y-2"><Label>Member Count</Label><Input type="number" value={editMinistry.members} onChange={e => setEditMinistry(f => f ? { ...f, members: Number(e.target.value) } : f)} /></div>
                              <div className="flex items-center gap-2">
                                <Switch checked={editMinistry.visible} onCheckedChange={v => setEditMinistry(f => f ? { ...f, visible: v } : f)} />
                                <Label>Visible on website</Label>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => setEditMinistry(null)}>Cancel</Button>
                                <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={handleUpdateMinistry}>Save Changes</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title={ministry.visible ? "Hide from website" : "Show on website"} onClick={() => handleToggleVisible(ministry.id)}>
                        {ministry.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete ministry?</AlertDialogTitle><AlertDialogDescription>This permanently removes "{ministry.name}" from the system and website.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-white" onClick={() => handleDeleteMinistry(ministry.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
