"use client"

import Link from 'next/link'
import {
  Users, Calendar, MessageSquare, BarChart3, Clock,
  CheckCircle, AlertCircle, TrendingUp, Church, Heart,
  FileText, UserCheck
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useAuth } from '@/lib/auth-context'

const stats = [
  { label: 'Branch Members', value: '87', icon: Users, change: '+3 this month', color: 'text-[var(--church-primary)]' },
  { label: 'Pending Requests', value: '4', icon: UserCheck, change: '4 awaiting acceptance', color: 'text-[var(--church-gold)]' },
  { label: 'Counseling Sessions', value: '6', icon: MessageSquare, change: '2 this week', color: 'text-emerald-500' },
  { label: 'Prayer Requests', value: '12', icon: Heart, change: '5 unresponded', color: 'text-rose-500' },
]

const recentActivity = [
  { type: 'member', message: 'New member registration: Carlos Mendoza', time: '1 hour ago', status: 'pending' },
  { type: 'prayer', message: 'Prayer request submitted by Elena R.', time: '3 hours ago', status: 'pending' },
  { type: 'counseling', message: 'Counseling session completed with Jose F.', time: 'Yesterday', status: 'complete' },
  { type: 'member', message: 'Accepted Anna Bautista as active member', time: 'Yesterday', status: 'complete' },
  { type: 'report', message: 'Monthly report due in 3 days', time: '2 days ago', status: 'pending' },
]

const pastorActions = [
  { icon: Users, label: 'Branch Members', href: '/pastor/members', description: 'View and accept members in your branch' },
  { icon: Church, label: 'Branch Monitoring', href: '/pastor/branch', description: 'Monitor your branch attendance & growth' },
  { icon: MessageSquare, label: 'Counseling', href: '/pastor/counseling', description: 'Manage counseling appointments' },
  { icon: BarChart3, label: 'Report Submission', href: '/pastor/reports', description: 'Submit monthly and annual reports' },
  { icon: Heart, label: 'Prayer Requests', href: '/pastor/prayers', description: 'Respond to branch prayer requests' },
  { icon: Calendar, label: 'Service Schedule', href: '/pastor/schedule', description: 'View your branch service schedule' },
]

export default function PastorDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout variant="pastor">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Pastor Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Pastor'}. Here is your branch overview.
          </p>
        </div>

        {/* Branch Banner */}
        <Card className="mb-8 bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Church className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80">Your Assigned Branch</p>
                <h2 className="text-xl font-bold">Camp 8 Branch</h2>
                <p className="text-sm opacity-80">Camp 8, Baguio City &middot; Est. 2005</p>
              </div>
              <div className="ml-auto hidden md:grid grid-cols-3 gap-6 text-center">
                {[{ label: "Members", val: "87" }, { label: "Services/Week", val: "2" }, { label: "Groups", val: "3" }].map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold">{s.val}</p>
                    <p className="text-xs opacity-80">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your branch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.status === 'pending' ? 'bg-[var(--church-gold)]' : 'bg-emerald-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.status === 'pending' ? (
                        <Badge variant="secondary" className="bg-[var(--church-gold)]/10 text-[var(--church-gold)] flex-shrink-0">
                          <AlertCircle className="w-3 h-3 mr-1" /> Pending
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 flex-shrink-0">
                          <CheckCircle className="w-3 h-3 mr-1" /> Done
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* This Week */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
              <CardDescription>Branch metrics overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Service Attendance", value: "64" },
                { label: "New Visitors", value: "2" },
                { label: "Bible Study Groups", value: "1 session" },
                { label: "Prayers Answered", value: "3" },
                { label: "Pending Members", value: "4" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-border">
                <Link href="/pastor/reports">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <FileText className="w-4 h-4" /> Submit Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pastor Actions */}
        <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastorActions.map((action) => (
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
      </main>
    </DashboardLayout>
  )
}
