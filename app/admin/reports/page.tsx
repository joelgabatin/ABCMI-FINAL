"use client"

import {
  BarChart3, Users, DollarSign, Heart, Calendar, TrendingUp, TrendingDown, Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const monthlyAttendance = [
  { month: 'Oct', value: 165 },
  { month: 'Nov', value: 172 },
  { month: 'Dec', value: 198 },
  { month: 'Jan', value: 181 },
  { month: 'Feb', value: 176 },
  { month: 'Mar', value: 189 },
]

const monthlyDonations = [
  { month: 'Oct', value: 2800 },
  { month: 'Nov', value: 3100 },
  { month: 'Dec', value: 4200 },
  { month: 'Jan', value: 3200 },
  { month: 'Feb', value: 3850 },
  { month: 'Mar', value: 4750 },
]

const ministryBreakdown = [
  { name: 'Worship Team', members: 24, active: 22 },
  { name: 'Youth Ministry', members: 38, active: 35 },
  { name: "Children's Church", members: 18, active: 17 },
  { name: 'Missions Team', members: 12, active: 10 },
  { name: 'Prayer Team', members: 20, active: 19 },
  { name: 'Outreach', members: 15, active: 13 },
  { name: 'Bible Study Leaders', members: 8, active: 8 },
]

const kpiCards = [
  { label: 'Total Members', value: '247', change: '+12', trend: 'up', icon: Users, color: 'text-[var(--church-primary)]', bg: 'bg-[var(--church-primary)]/10' },
  { label: 'Avg. Weekly Attendance', value: '189', change: '+7%', trend: 'up', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Monthly Giving', value: '₱4,750', change: '+23%', trend: 'up', icon: DollarSign, color: 'text-[var(--church-gold)]', bg: 'bg-[var(--church-gold)]/10' },
  { label: 'Prayer Requests', value: '34', change: '+5', trend: 'up', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
]

const prayerStats = [
  { category: 'Healing', count: 12, answered: 8 },
  { category: 'Family', count: 9, answered: 5 },
  { category: 'Financial', count: 7, answered: 4 },
  { category: 'Missions', count: 4, answered: 3 },
  { category: 'Mental Health', count: 6, answered: 2 },
  { category: 'Thanksgiving', count: 8, answered: 8 },
]

const maxAttendance = Math.max(...monthlyAttendance.map(m => m.value))
const maxDonation = Math.max(...monthlyDonations.map(m => m.value))

export default function AdminReportsPage() {
  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Overview of church health and growth metrics</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiCards.map(kpi => (
            <Card key={kpi.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {kpi.trend === 'up'
                      ? <TrendingUp className="w-3.5 h-3.5" />
                      : <TrendingDown className="w-3.5 h-3.5" />
                    }
                    {kpi.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="attendance">
          <TabsList className="mb-6">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="giving">Giving</TabsTrigger>
            <TabsTrigger value="ministry">Ministry</TabsTrigger>
            <TabsTrigger value="prayer">Prayer</TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>6-Month Attendance Trend</CardTitle>
                  <CardDescription>Weekly average service attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-3 h-40">
                    {monthlyAttendance.map(item => (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-medium text-foreground">{item.value}</span>
                        <div
                          className="w-full bg-[var(--church-primary)] rounded-t-md transition-all"
                          style={{ height: `${(item.value / maxAttendance) * 120}px` }}
                        />
                        <span className="text-xs text-muted-foreground">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                  <CardDescription>Current month breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Sunday Morning Service', value: 189, capacity: 300 },
                    { label: "Children's Sunday School", value: 54, capacity: 80 },
                    { label: 'Midweek Bible Study', value: 45, capacity: 60 },
                    { label: 'Youth Fellowship', value: 32, capacity: 50 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-semibold text-foreground">{item.value}/{item.capacity}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-[var(--church-primary)] h-2 rounded-full"
                          style={{ width: `${(item.value / item.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Giving Tab */}
          <TabsContent value="giving">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>6-Month Giving Trend</CardTitle>
                  <CardDescription>Monthly total donations (in PHP)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-3 h-40">
                    {monthlyDonations.map(item => (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-medium text-foreground">₱{(item.value / 1000).toFixed(1)}k</span>
                        <div
                          className="w-full bg-[var(--church-gold)] rounded-t-md transition-all"
                          style={{ height: `${(item.value / maxDonation) * 120}px` }}
                        />
                        <span className="text-xs text-muted-foreground">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Giving by Fund</CardTitle>
                  <CardDescription>This month{"'"}s allocation breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { fund: 'Tithe', amount: 1550, pct: 33 },
                    { fund: 'Special Gift', amount: 1500, pct: 32 },
                    { fund: 'Missions Fund', amount: 1300, pct: 27 },
                    { fund: 'Offering', amount: 750, pct: 16 },
                    { fund: 'Building Fund', amount: 150, pct: 3 },
                  ].map(item => (
                    <div key={item.fund} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-28 flex-shrink-0">{item.fund}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-[var(--church-gold)] h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-foreground w-20 text-right">
                        ₱{item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ministry Tab */}
          <TabsContent value="ministry">
            <Card>
              <CardHeader>
                <CardTitle>Ministry Involvement</CardTitle>
                <CardDescription>Member participation across all ministries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ministryBreakdown.map(ministry => (
                    <div key={ministry.name} className="flex items-center gap-4">
                      <span className="text-sm text-foreground w-40 flex-shrink-0">{ministry.name}</span>
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div
                          className="bg-[var(--church-primary)] h-3 rounded-full transition-all"
                          style={{ width: `${(ministry.active / 40) * 100}%` }}
                        />
                      </div>
                      <div className="text-sm w-20 text-right flex-shrink-0">
                        <span className="font-semibold text-foreground">{ministry.active}</span>
                        <span className="text-muted-foreground">/{ministry.members}</span>
                      </div>
                      <Badge variant="secondary" className={
                        ministry.active / ministry.members >= 0.9
                          ? 'bg-emerald-500/10 text-emerald-600 text-xs w-16 justify-center'
                          : 'bg-[var(--church-gold)]/10 text-[var(--church-gold)] text-xs w-16 justify-center'
                      }>
                        {Math.round((ministry.active / ministry.members) * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prayer Tab */}
          <TabsContent value="prayer">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prayer Requests by Category</CardTitle>
                  <CardDescription>This month{"'"}s prayer request breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prayerStats.map(item => (
                    <div key={item.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.category}</span>
                        <span className="font-medium text-foreground">{item.answered}/{item.count} answered</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-rose-400 h-2 rounded-full"
                          style={{ width: `${(item.answered / item.count) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prayer Summary</CardTitle>
                  <CardDescription>Overall prayer ministry health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Total Requests This Month', value: prayerStats.reduce((s, p) => s + p.count, 0) },
                    { label: 'Answered Prayers', value: prayerStats.reduce((s, p) => s + p.answered, 0) },
                    { label: 'Currently In Prayer', value: 5 },
                    { label: 'Answer Rate', value: `${Math.round((prayerStats.reduce((s, p) => s + p.answered, 0) / prayerStats.reduce((s, p) => s + p.count, 0)) * 100)}%` },
                    { label: 'Prayer Team Members', value: 20 },
                    { label: 'Avg. Response Time', value: '2 days' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
