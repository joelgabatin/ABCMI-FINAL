"use client"

import { useState } from 'react'
import {
  MessageSquare, Calendar, Clock, User, CheckCircle, AlertCircle, Search, Filter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const appointments = [
  { id: 1, name: 'Maria Santos', topic: 'Marriage & Family', message: 'Need guidance on communication issues with my spouse. We have been struggling for several months.', requestedDate: 'Mar 24, 2026', requestedTime: '10:00 AM', pastor: 'Ptr. Ysrael Coyoy', status: 'confirmed', priority: 'normal' },
  { id: 2, name: 'Anonymous', topic: 'Personal Struggles', message: 'Dealing with depression and feeling hopeless. Need someone to talk to.', requestedDate: 'Mar 25, 2026', requestedTime: '2:00 PM', pastor: 'Ptr. Fhey Coyoy', status: 'pending', priority: 'urgent' },
  { id: 3, name: 'James Torres', topic: 'Financial Stress', message: 'Lost my job and facing debt. Looking for prayer and practical guidance from the church.', requestedDate: 'Mar 26, 2026', requestedTime: '3:00 PM', pastor: 'Ptr. Ysrael Coyoy', status: 'confirmed', priority: 'normal' },
  { id: 4, name: 'Grace Reyes', topic: 'Grief & Loss', message: 'Lost my father last month and struggling to cope. Need spiritual support.', requestedDate: 'Mar 23, 2026', requestedTime: '11:00 AM', pastor: 'Ptr. Fhey Coyoy', status: 'completed', priority: 'normal' },
  { id: 5, name: 'Anonymous', topic: 'Spiritual Growth', message: 'Feeling spiritually dry and disconnected from God. Need direction and accountability.', requestedDate: 'Mar 27, 2026', requestedTime: '4:00 PM', pastor: 'Unassigned', status: 'pending', priority: 'normal' },
  { id: 6, name: 'Pedro Bautista', topic: 'Addiction Recovery', message: 'Struggling with substance dependency and want to break free with the help of God and the church.', requestedDate: 'Mar 28, 2026', requestedTime: '9:00 AM', pastor: 'Ptr. Ysrael Coyoy', status: 'confirmed', priority: 'urgent' },
]

const topics = ['All', 'Marriage & Family', 'Personal Struggles', 'Financial Stress', 'Grief & Loss', 'Spiritual Growth', 'Addiction Recovery']

const statusConfig: Record<string, { className: string; icon: typeof Clock }> = {
  pending: { className: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]', icon: AlertCircle },
  confirmed: { className: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]', icon: Calendar },
  completed: { className: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle },
}

export default function AdminCounselingPage() {
  const [search, setSearch] = useState('')
  const [filterTopic, setFilterTopic] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const filtered = appointments.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.topic.toLowerCase().includes(search.toLowerCase())
    const matchTopic = filterTopic === 'All' || a.topic === filterTopic
    const matchStatus = filterStatus === 'All' || a.status === filterStatus
    return matchSearch && matchTopic && matchStatus
  })

  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length
  const completedCount = appointments.filter(a => a.status === 'completed').length

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Counseling Requests</h1>
          <p className="text-muted-foreground mt-1">Manage pastoral counseling appointments</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{confirmedCount}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterTopic}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {topics.map(t => (
                  <DropdownMenuItem key={t} onClick={() => setFilterTopic(t)}>{t}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterStatus === 'All' ? 'All Status' : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['All', 'pending', 'confirmed', 'completed'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)} className="capitalize">{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Appointment Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(appt => {
            const config = statusConfig[appt.status]
            const StatusIcon = config.icon
            return (
              <Card key={appt.id} className={`flex flex-col ${appt.priority === 'urgent' ? 'border-rose-300' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                          {appt.name === 'Anonymous' ? '?' : appt.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{appt.name}</p>
                        <p className="text-xs text-muted-foreground">{appt.topic}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                      {appt.priority === 'urgent' && (
                        <Badge variant="secondary" className="bg-rose-500/10 text-rose-600 text-xs">Urgent</Badge>
                      )}
                      <Badge variant="secondary" className={`${config.className} text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {appt.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <p className="text-sm text-foreground leading-relaxed line-clamp-2">{appt.message}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {appt.requestedDate} at {appt.requestedTime}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      Assigned to: <span className="font-medium text-foreground">{appt.pastor}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                          <MessageSquare className="w-3 h-3" />
                          Notes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Session Notes</DialogTitle>
                          <DialogDescription>
                            Add private notes for {appt.name}{"'"}s counseling session
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea placeholder="Enter session notes (private, visible to pastors only)..." rows={5} />
                          <Button className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                            Save Notes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 text-xs">Update</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Confirm Appointment</DropdownMenuItem>
                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </DashboardLayout>
  )
}
