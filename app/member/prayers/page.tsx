"use client"

import { useState } from 'react'
import { Heart, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const myRequests = [
  { id: 1, request: 'Praying for healing from my recurring back pain. Trusting God for full recovery.', date: 'Mar 19, 2026', status: 'inprayer', isAnonymous: false, response: 'We are praying for your healing, dear brother/sister. Isaiah 53:5 declares that by His stripes we are healed!' },
  { id: 2, request: 'Guidance on a big career decision. I need God\'s clear direction.', date: 'Mar 10, 2026', status: 'interceded', isAnonymous: false, response: 'Praise God for the answered prayer! We trust that He opened the right door for you.' },
  { id: 3, request: 'Pray for my family members who are not yet believers.', date: 'Feb 28, 2026', status: 'inprayer', isAnonymous: true, response: null },
]

const communityWall = [
  { id: 1, name: 'Maria S.', request: 'Pray for healing for my mother who has been ill.', date: '2 hours ago', prayerCount: 14 },
  { id: 2, name: 'Anonymous', request: 'Going through financial hardship. Trusting God for provision.', date: '5 hours ago', prayerCount: 8 },
  { id: 3, name: 'James T.', request: 'Praise report! Got the job I was praying for!', date: 'Yesterday', prayerCount: 32 },
  { id: 4, name: 'Grace R.', request: 'Praying for my son to return to faith.', date: '2 days ago', prayerCount: 21 },
]

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', className: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]', icon: AlertCircle },
  'inprayer': { label: 'In Prayer', className: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]', icon: Heart },
  'interceded': { label: 'Interceded', className: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle },
}

export default function MemberPrayersPage() {
  const [submitOpen, setSubmitOpen] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [prayedFor, setPrayedFor] = useState<number[]>([])

  const handlePray = (id: number) => {
    setPrayedFor(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prayer Requests</h1>
            <p className="text-muted-foreground mt-1">Submit prayer requests and intercede for others</p>
          </div>
          <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit a Prayer Request</DialogTitle>
                <DialogDescription>
                  Share your request with our pastoral team and prayer warriors
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Prayer Request</Label>
                  <Textarea placeholder="Share your prayer need with us..." rows={5} />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Submit Anonymously</p>
                    <p className="text-xs text-muted-foreground">Your name will not be shown on the prayer wall</p>
                  </div>
                  <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSubmitOpen(false)}>Cancel</Button>
                  <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={() => setSubmitOpen(false)}>
                    Submit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* My Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">My Prayer Requests</h2>
          <div className="space-y-4">
            {myRequests.map(req => {
              const config = statusConfig[req.status] || statusConfig.pending
              const StatusIcon = config.icon
              return (
                <Card key={req.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`${config.className} text-xs`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{req.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-foreground leading-relaxed">{req.request}</p>
                    {req.response && (
                      <div className="p-3 bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/20 rounded-lg">
                        <p className="text-xs font-medium text-[var(--church-primary)] mb-1">Pastoral Response</p>
                        <p className="text-sm text-foreground">{req.response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Community Prayer Wall */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Community Prayer Wall</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {communityWall.map(item => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">{item.request}</p>
                  <Button
                    variant={prayedFor.includes(item.id) ? 'default' : 'outline'}
                    size="sm"
                    className={`gap-2 w-full ${prayedFor.includes(item.id) ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''}`}
                    onClick={() => handlePray(item.id)}
                  >
                    <Heart className="w-4 h-4" />
                    {prayedFor.includes(item.id) ? 'Praying' : 'Pray'} ({item.prayerCount + (prayedFor.includes(item.id) ? 1 : 0)})
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
