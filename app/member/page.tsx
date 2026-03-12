"use client"

import Link from 'next/link'
import { 
  Calendar, 
  BookOpen, 
  Heart, 
  MessageSquare, 
  Clock,
  TrendingUp,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const quickActions = [
  { icon: Heart, label: 'Submit Prayer Request', href: '/prayer-request', color: 'bg-rose-500' },
  { icon: Calendar, label: 'View Events', href: '/events', color: 'bg-[var(--church-primary)]' },
  { icon: BookOpen, label: "Today's Bible Reading", href: '/bible-reading', color: 'bg-emerald-500' },
  { icon: MessageSquare, label: 'Contact Pastor', href: '/counseling', color: 'bg-[var(--church-gold)]' },
]

const upcomingEvents = [
  { title: 'Sunday Worship Service', date: 'This Sunday', time: '10:00 AM', type: 'worship' },
  { title: 'Midweek Bible Study', date: 'Wednesday', time: '7:00 PM', type: 'study' },
  { title: 'Youth Fellowship', date: 'Friday', time: '6:00 PM', type: 'fellowship' },
]

const spiritualGrowth = [
  { label: 'Bible Reading Streak', value: '7 days', icon: Star },
  { label: 'Services Attended', value: '12 this month', icon: TrendingUp },
  { label: 'Prayer Requests', value: '3 answered', icon: Heart },
]

export default function MemberDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0] || 'Member'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Here's what's happening in your spiritual journey"}
          </p>
        </div>

        {/* Daily Verse Card */}
        <Card className="mb-8 bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-0">
          <CardContent className="p-6">
            <p className="text-sm font-medium opacity-90 mb-2">Verse of the Day</p>
            <blockquote className="text-lg md:text-xl font-serif italic leading-relaxed">
              {'"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."'}
            </blockquote>
            <p className="mt-3 text-sm font-medium">- Jeremiah 29:11 (NIV)</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-medium text-foreground">{action.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Spiritual Growth */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Your Growth</h2>
            <Card>
              <CardContent className="p-4 space-y-4">
                {spiritualGrowth.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-[var(--church-gold)]" />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="ghost" className="text-[var(--church-primary)]">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={
                        event.type === 'worship' ? 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]' :
                        event.type === 'study' ? 'bg-emerald-500/10 text-emerald-600' :
                        'bg-[var(--church-gold)]/10 text-[var(--church-gold)]'
                      }
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prayer Wall Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              Community Prayer Wall
            </CardTitle>
            <CardDescription>
              Pray for our church family and share your requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-foreground">Please pray for healing for my mother...</p>
                <p className="text-xs text-muted-foreground mt-1">Anonymous - 2 hours ago</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-foreground">Thankful for answered prayer! Got the job...</p>
                <p className="text-xs text-muted-foreground mt-1">Sarah M. - Yesterday</p>
              </div>
            </div>
            <Link href="/prayer-request">
              <Button className="w-full mt-4 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                Submit Prayer Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  )
}
