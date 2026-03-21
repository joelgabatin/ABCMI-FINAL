"use client"

import { useState } from 'react'
import {
  Heart, Search, CheckCircle, Clock, MessageSquare, Filter, AlertCircle
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
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const prayerRequests = [
  { id: 1, name: 'Maria Santos', request: 'Please pray for healing from a recent illness. I have been battling fever and body pain for a week now and I believe God will restore my health completely.', date: '2 hours ago', status: 'pending', category: 'Healing', isAnonymous: false },
  { id: 2, name: 'Anonymous', request: 'Pray for my family situation. We are going through financial difficulties and need God\'s provision and wisdom.', date: '5 hours ago', status: 'pending', category: 'Financial', isAnonymous: true },
  { id: 3, name: 'John dela Cruz', request: 'Thank you for praying for my job application last month. I got the job! Praising God for this answered prayer.', date: 'Yesterday', status: 'answered', category: 'Thanksgiving', isAnonymous: false },
  { id: 4, name: 'Grace Reyes', request: 'Please intercede for my son who has been away from the church. I am believing for his restoration and return to faith.', date: 'Yesterday', status: 'in-prayer', category: 'Family', isAnonymous: false },
  { id: 5, name: 'Anonymous', request: 'Need prayer for a broken relationship. Seeking God\'s guidance on whether to reconcile or move on.', date: '2 days ago', status: 'in-prayer', category: 'Relationships', isAnonymous: true },
  { id: 6, name: 'Samuel Torres', request: 'Praying for a mission trip to Laos next month. Need resources, safety, and open doors for ministry.', date: '3 days ago', status: 'answered', category: 'Missions', isAnonymous: false },
  { id: 7, name: 'Luz Bautista', request: 'Please pray for my mother who is scheduled for surgery next week. Trusting God for a successful operation and speedy recovery.', date: '4 days ago', status: 'pending', category: 'Healing', isAnonymous: false },
  { id: 8, name: 'Anonymous', request: 'Struggling with anxiety and fear. Need prayer for peace of mind and clarity in direction.', date: '5 days ago', status: 'in-prayer', category: 'Mental Health', isAnonymous: true },
]

const categories = ['All', 'Healing', 'Financial', 'Family', 'Missions', 'Relationships', 'Thanksgiving', 'Mental Health']
const statuses = ['All', 'pending', 'in-prayer', 'answered']

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', className: 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]', icon: AlertCircle },
  'in-prayer': { label: 'In Prayer', className: 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]', icon: Heart },
  answered: { label: 'Answered', className: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle },
}

export default function AdminPrayersPage() {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedRequest, setSelectedRequest] = useState<(typeof prayerRequests)[0] | null>(null)
  const [statuses2, setStatuses2] = useState<Record<number, string>>(
    Object.fromEntries(prayerRequests.map(p => [p.id, p.status]))
  )

  const filtered = prayerRequests.filter(p => {
    const matchSearch = p.request.toLowerCase().includes(search.toLowerCase()) ||
      (!p.isAnonymous && p.name.toLowerCase().includes(search.toLowerCase()))
    const matchCategory = filterCategory === 'All' || p.category === filterCategory
    const matchStatus = filterStatus === 'All' || p.status === filterStatus
    return matchSearch && matchCategory && matchStatus
  })

  const pendingCount = prayerRequests.filter(p => p.status === 'pending').length
  const inPrayerCount = prayerRequests.filter(p => p.status === 'in-prayer').length
  const answeredCount = prayerRequests.filter(p => p.status === 'answered').length

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Prayer Requests</h1>
          <p className="text-muted-foreground mt-1">Review and manage community prayer requests</p>
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
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{inPrayerCount}</p>
                <p className="text-sm text-muted-foreground">In Prayer</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{answeredCount}</p>
                <p className="text-sm text-muted-foreground">Answered</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map(c => (
                  <DropdownMenuItem key={c} onClick={() => setFilterCategory(c)}>{c}</DropdownMenuItem>
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
                {statuses.map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)} className="capitalize">{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Prayer Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(prayer => {
            const config = statusConfig[prayer.status]
            const StatusIcon = config.icon
            return (
              <Card key={prayer.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {prayer.isAnonymous ? 'Anonymous' : prayer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{prayer.date}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-xs">
                        {prayer.category}
                      </Badge>
                      <Badge variant="secondary" className={`${config.className} text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3">{prayer.request}</p>
                  <div className="flex gap-2 mt-auto pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => setSelectedRequest(prayer)}
                        >
                          <MessageSquare className="w-3 h-3" />
                          Respond
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Respond to Prayer Request</DialogTitle>
                          <DialogDescription>
                            Send an encouraging message to {prayer.isAnonymous ? 'this member' : prayer.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                            {prayer.request}
                          </div>
                          <Textarea placeholder="Write an encouraging response or prayer..." rows={4} />
                          <Button className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                            Send Response
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">Update Status</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setStatuses2(prev => ({ ...prev, [prayer.id]: 'in-prayer' }))}>
                          Mark as In Prayer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatuses2(prev => ({ ...prev, [prayer.id]: 'answered' }))}>
                          Mark as Answered
                        </DropdownMenuItem>
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
