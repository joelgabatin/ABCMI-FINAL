"use client"

import Link from 'next/link'
import { 
  Users, 
  Calendar, 
  Heart, 
  MessageSquare, 
  DollarSign,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const stats = [
  { label: 'Total Members', value: '247', icon: Users, change: '+12 this month', color: 'text-[var(--church-primary)]' },
  { label: 'Prayer Requests', value: '34', icon: Heart, change: '8 pending', color: 'text-rose-500' },
  { label: 'Upcoming Events', value: '6', icon: Calendar, change: 'Next: Sunday Service', color: 'text-emerald-500' },
  { label: 'Monthly Donations', value: '$4,280', icon: DollarSign, change: '+18% vs last month', color: 'text-[var(--church-gold)]' },
]

const recentActivity = [
  { type: 'prayer', message: 'New prayer request submitted', time: '5 minutes ago', status: 'pending' },
  { type: 'member', message: 'New member registration: Sarah Johnson', time: '1 hour ago', status: 'complete' },
  { type: 'donation', message: 'Donation received: $150', time: '2 hours ago', status: 'complete' },
  { type: 'counseling', message: 'Counseling request from John D.', time: '3 hours ago', status: 'pending' },
  { type: 'event', message: 'Youth Fellowship RSVP: 24 attending', time: 'Yesterday', status: 'complete' },
]

const adminActions = [
  { icon: Users, label: 'Manage Members', href: '/admin/members', description: 'View and manage church members' },
  { icon: Heart, label: 'Prayer Requests', href: '/admin/prayers', description: 'Review and respond to prayers' },
  { icon: Calendar, label: 'Manage Events', href: '/admin/events', description: 'Create and edit events' },
  { icon: MessageSquare, label: 'Counseling Requests', href: '/admin/counseling', description: 'View counseling appointments' },
  { icon: FileText, label: 'Content Management', href: '/admin/content', description: 'Edit website content' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports', description: 'View analytics and reports' },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your church community and activities
          </p>
        </div>

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
                <CardDescription>Latest updates from your church community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'pending' ? 'bg-[var(--church-gold)]' : 'bg-emerald-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.status === 'pending' ? (
                        <Badge variant="secondary" className="bg-[var(--church-gold)]/10 text-[var(--church-gold)]">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
              <CardDescription>Key metrics overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Service Attendance</span>
                <span className="font-semibold text-foreground">189</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">New Visitors</span>
                <span className="font-semibold text-foreground">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bible Studies</span>
                <span className="font-semibold text-foreground">4 sessions</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Prayers Answered</span>
                <span className="font-semibold text-foreground">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Volunteers Active</span>
                <span className="font-semibold text-foreground">32</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
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
      </main>
    </DashboardLayout>
  )
}
