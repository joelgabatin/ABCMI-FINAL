"use client"

import { useState } from 'react'
import { MessageSquare, Calendar, Clock, User, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const myAppointments = [
  {
    id: 1,
    topic: 'Career Guidance',
    message: 'Seeking spiritual direction for a major career transition.',
    date: 'Mar 24, 2026',
    time: '10:00 AM',
    pastor: 'Ptr. Ysrael Coyoy',
    status: 'confirmed',
    note: 'Please come with a prayer journal if you have one. We will spend time in prayer together.',
  },
  {
    id: 2,
    topic: 'Family Prayer',
    message: 'Prayer and counsel for family unity.',
    date: 'Feb 14, 2026',
    time: '2:00 PM',
    pastor: 'Ptr. Fhey Coyoy',
    status: 'completed',
    note: null,
  },
]

const pastors = [
  { name: 'Ptr. Ysrael Coyoy', specialty: 'General Pastoral Care, Marriage & Family' },
  { name: 'Ptr. Fhey Coyoy', specialty: "Women's Ministry, Spiritual Growth" },
  { name: 'Ptr. Julio Coyoy', specialty: 'Youth & Young Adults' },
]

const topics = [
  'Marriage & Family',
  'Personal Struggles',
  'Spiritual Growth',
  'Career & Life Purpose',
  'Grief & Loss',
  'Addiction Recovery',
  'Financial Stewardship',
  'Mental & Emotional Health',
]

const statusConfig: Record<string, { className: string; icon: typeof Clock; label: string }> = {
  confirmed: { className: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]', icon: Calendar, label: 'Confirmed' },
  pending: { className: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]', icon: AlertCircle, label: 'Pending' },
  completed: { className: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle, label: 'Completed' },
}

export default function MemberCounselingPage() {
  const [requestOpen, setRequestOpen] = useState(false)

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pastoral Counseling</h1>
            <p className="text-muted-foreground mt-1">Request a confidential session with one of our pastors</p>
          </div>
          <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" />
                Request Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Request Counseling Session</DialogTitle>
                <DialogDescription>
                  All counseling sessions are strictly confidential. Our pastors are here to help you.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Topic / Area of Concern</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Pastor (optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="No preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No preference</SelectItem>
                      {pastors.map(p => (
                        <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Brief Description</Label>
                  <Textarea
                    placeholder="Briefly describe what you'd like to discuss (optional, for the pastor's preparation)..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setRequestOpen(false)}>Cancel</Button>
                  <Button
                    className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                    onClick={() => setRequestOpen(false)}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 bg-[var(--church-primary)]/5 border-[var(--church-primary)]/20">
          <CardContent className="p-4 flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Confidential & Safe</p>
              <p className="text-sm text-muted-foreground">
                All pastoral counseling sessions are completely confidential. Our pastors are trained to provide spiritual guidance, prayer, and a listening ear. You are not alone.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* My Appointments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">My Appointments</h2>
          {myAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No appointments yet</p>
                <p className="text-sm text-muted-foreground mt-1">Request a counseling session to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myAppointments.map(appt => {
                const config = statusConfig[appt.status]
                const StatusIcon = config.icon
                return (
                  <Card key={appt.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <CardTitle className="text-base">{appt.topic}</CardTitle>
                          <CardDescription>{appt.message}</CardDescription>
                        </div>
                        <Badge variant="secondary" className={`${config.className} text-xs`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {appt.date} at {appt.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          {appt.pastor}
                        </div>
                      </div>
                      {appt.note && (
                        <div className="p-3 bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/20 rounded-lg">
                          <p className="text-xs font-medium text-[var(--church-primary)] mb-1">Note from Pastor</p>
                          <p className="text-sm text-foreground">{appt.note}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Meet the Pastoral Team */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Our Pastoral Team</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {pastors.map(pastor => (
              <Card key={pastor.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-[var(--church-primary)]" />
                  </div>
                  <p className="font-semibold text-foreground">{pastor.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{pastor.specialty}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setRequestOpen(true)}
                  >
                    Request Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
