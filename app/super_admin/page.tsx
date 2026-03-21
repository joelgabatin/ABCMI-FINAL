"use client"

import Link from 'next/link'
import {
  Users, Calendar, Heart, MessageSquare, DollarSign, FileText,
  BarChart3, Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown,
  Settings, BookOpen, Church, GraduationCap, MapPin, UserCheck,
  Activity, Star,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const stats = [
  { label: 'Total Members', value: '247', icon: Users, change: '+12 this month', trend: 'up', color: 'text-[var(--church-primary)]', bg: 'bg-[var(--church-primary)]/10' },
  { label: 'Prayer Requests', value: '34', icon: Heart, change: '8 pending response', trend: 'neutral', color: 'text-rose-500', bg: 'bg-rose-50' },
  { label: 'Upcoming Events', value: '6', icon: Calendar, change: 'Next: Sunday Service', trend: 'neutral', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Monthly Donations', value: '₱85,400', icon: DollarSign, change: '+18% vs last month', trend: 'up', color: 'text-[var(--church-gold)]', bg: 'bg-[var(--church-gold)]/10' },
]

const recentActivity = [
  { type: 'prayer', message: 'New prayer request submitted by Maria Cruz', time: '5 minutes ago', status: 'pending' },
  { type: 'member', message: 'New member registration: Sarah Johnson', time: '1 hour ago', status: 'complete' },
  { type: 'donation', message: 'Donation received: ₱2,500 from anonymous', time: '2 hours ago', status: 'complete' },
  { type: 'counseling', message: 'Counseling request from Jose Dela Cruz', time: '3 hours ago', status: 'pending' },
  { type: 'training', message: 'New training registration: Carlos Mendoza', time: '4 hours ago', status: 'pending' },
  { type: 'event', message: 'Youth Fellowship RSVP: 24 attending', time: 'Yesterday', status: 'complete' },
  { type: 'testimony', message: 'New testimony submitted for review', time: 'Yesterday', status: 'pending' },
]

const adminActions = [
  { icon: Users, label: 'Manage Members', href: '/super_admin/members', description: 'View and manage church members' },
  { icon: Heart, label: 'Prayer Requests', href: '/super_admin/prayers', description: 'Review and respond to prayers' },
  { icon: Calendar, label: 'Manage Events', href: '/super_admin/events', description: 'Create and edit events' },
  { icon: MessageSquare, label: 'Counseling Requests', href: '/super_admin/counseling', description: 'View counseling appointments' },
  { icon: BookOpen, label: 'Bible Study', href: '/super_admin/bible-study', description: 'Manage groups & study requests' },
  { icon: FileText, label: 'Daily Devotion', href: '/super_admin/devotion', description: 'Create & publish daily devotionals' },
  { icon: GraduationCap, label: 'Missions Training', href: '/super_admin/missions-training', description: 'Manage training programs' },
  { icon: Church, label: 'Branches', href: '/super_admin/branches', description: 'Manage satellite branches' },
  { icon: Settings, label: 'Permissions', href: '/super_admin/permissions', description: 'Manage user access & privileges' },
]

const branchStats = [
  { name: 'Main Church — Baguio', members: 89, attendance: 76, trend: 'up' },
  { name: 'Camp 8 Branch', members: 47, attendance: 38, trend: 'up' },
  { name: 'Itogon Branch', members: 31, attendance: 24, trend: 'down' },
  { name: 'La Trinidad Branch', members: 52, attendance: 44, trend: 'up' },
  { name: 'Bokod Branch', members: 28, attendance: 21, trend: 'neutral' },
]

const donationBreakdown = [
  { label: 'Tithes', amount: 42000, percent: 49 },
  { label: 'Offerings', amount: 28500, percent: 33 },
  { label: 'Missions Fund', amount: 10200, percent: 12 },
  { label: 'Building Fund', amount: 4700, percent: 6 },
]

const ministryEngagement = [
  { ministry: 'Youth Ministry', members: 58, active: 43 },
  { ministry: "Women's Ministry", members: 42, active: 38 },
  { ministry: "Men's Ministry", members: 37, active: 29 },
  { ministry: 'Worship Team', members: 22, active: 22 },
  { ministry: 'Missions Team', members: 18, active: 15 },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Church-wide overview and management.</p>
        </div>

        {/* Top Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                  {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Row 2: Activity + Week Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="w-4 h-4" /> Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your church community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.status === 'pending' ? 'bg-[var(--church-gold)]' : 'bg-emerald-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="secondary" className={`flex-shrink-0 text-xs ${activity.status === 'pending' ? 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        {activity.status === 'pending' ? <><AlertCircle className="w-3 h-3 mr-1" /> Pending</> : <><CheckCircle className="w-3 h-3 mr-1" /> Done</>}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">This Week</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Service Attendance', value: '189', pct: 77 },
                { label: 'New Visitors', value: '7', pct: null },
                { label: 'Bible Studies', value: '4 sessions', pct: null },
                { label: 'Prayers Answered', value: '12', pct: null },
                { label: 'Volunteers Active', value: '32', pct: null },
                { label: 'Missions Training Slots', value: '23 / 40', pct: 57 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground text-sm">{item.value}</span>
                  </div>
                  {item.pct != null && <Progress value={item.pct} className="h-1.5" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Branch Attendance + Donations */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Branch Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4" /> Branch Attendance</CardTitle>
              <CardDescription>Weekly attendance across all satellite churches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branchStats.map(b => (
                  <div key={b.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">{b.name}</span>
                        {b.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                        {b.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                      </div>
                      <span className="text-sm text-muted-foreground flex-shrink-0 ml-2">{b.attendance}/{b.members}</span>
                    </div>
                    <Progress value={Math.round((b.attendance / b.members) * 100)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4" /> Donation Breakdown</CardTitle>
              <CardDescription>This month — ₱85,400 total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donationBreakdown.map(d => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{d.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">₱{d.amount.toLocaleString()}</span>
                        <Badge variant="secondary" className="text-xs min-w-[44px] justify-center">{d.percent}%</Badge>
                      </div>
                    </div>
                    <Progress value={d.percent} className="h-2" />
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-semibold text-foreground pt-1">
                  <span>Total</span>
                  <span>₱85,400</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 4: Ministry Engagement + Pending Items */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ministry Engagement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Church className="w-4 h-4" /> Ministry Engagement</CardTitle>
              <CardDescription>Active vs enrolled members per ministry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ministryEngagement.map(m => (
                  <div key={m.ministry}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{m.ministry}</span>
                      <span className="text-sm text-muted-foreground">{m.active}/{m.members} active</span>
                    </div>
                    <Progress value={Math.round((m.active / m.members) * 100)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><AlertCircle className="w-4 h-4 text-[var(--church-gold)]" /> Needs Attention</CardTitle>
              <CardDescription>Items requiring admin action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Pending Prayer Requests', count: 8, href: '/super_admin/prayers', color: 'text-rose-500', bg: 'bg-rose-50' },
                  { label: 'Pending Counseling Requests', count: 3, href: '/super_admin/counseling', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Training Registrations', count: 5, href: '/super_admin/missions-training', color: 'text-[var(--church-primary)]', bg: 'bg-[var(--church-primary)]/10' },
                  { label: 'Unread Messages', count: 4, href: '/super_admin/messages', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Pending Testimonies', count: 2, href: '/super_admin/testimony', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'New Member Registrations', count: 6, href: '/super_admin/members', color: 'text-[var(--church-gold)]', bg: 'bg-[var(--church-gold)]/10' },
                ].map(item => (
                  <Link key={item.label} href={item.href}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-[var(--church-primary)]/40 hover:bg-muted/40 transition-all cursor-pointer">
                      <span className="text-sm text-foreground">{item.label}</span>
                      <Badge className={`${item.bg} ${item.color} border-none font-semibold`}>{item.count}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <action.icon className="w-6 h-6 text-[var(--church-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{action.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}

function Separator({ className }: { className?: string }) {
  return <div className={`border-t border-border ${className ?? ''}`} />
}
