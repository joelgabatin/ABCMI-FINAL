"use client"

import { useState } from "react"
import { Users, TrendingUp, Calendar, Clock, Church, UserCheck, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

const attendanceData = [
  { week: "Feb W1", count: 58 }, { week: "Feb W2", count: 61 }, { week: "Feb W3", count: 55 },
  { week: "Feb W4", count: 67 }, { week: "Mar W1", count: 63 }, { week: "Mar W2", count: 64 },
]

const members = [
  { id: 1, name: "Anna Bautista", status: "active", role: "Member", joined: "Jan 2024" },
  { id: 2, name: "Pedro Villanueva", status: "pending", role: "New Member", joined: "Feb 2024" },
  { id: 3, name: "Rosa Fernandez", status: "active", role: "Cell Leader", joined: "Mar 2022" },
  { id: 4, name: "Marco Santos", status: "active", role: "Worship Team", joined: "Jun 2023" },
  { id: 5, name: "Elena Cruz", status: "active", role: "Member", joined: "Aug 2023" },
]

const schedules = [
  { day: "Sunday", time: "10:00 AM", type: "Sunday Worship", desc: "Morning worship service" },
  { day: "Thursday", time: "6:30 PM", type: "Bible Study", desc: "Weekly Bible study" },
]

const maxAtt = Math.max(...attendanceData.map(d => d.count))

export default function PastorBranchPage() {
  return (
    <DashboardLayout variant="pastor">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Branch Monitoring</h1>
          <p className="text-muted-foreground mt-1">Overview of Camp 8 Branch — attendance, members, and activity.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Members", value: "87", icon: Users, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
            { label: "Active Members", value: "81", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Pending Requests", value: "4", icon: UserCheck, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15" },
            { label: "Avg. Attendance", value: "61", icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                <div><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Attendance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Attendance Trend</CardTitle>
              <CardDescription>Last 6 weeks Sunday service attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-40">
                {attendanceData.map(d => (
                  <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-foreground">{d.count}</span>
                    <div className="w-full bg-[var(--church-primary)] rounded-t-md transition-all" style={{ height: `${(d.count / maxAtt) * 120}px` }} />
                    <span className="text-xs text-muted-foreground">{d.week}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Service Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedules.map(s => (
                <div key={s.day + s.time} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--church-primary)]" />
                    <span className="text-sm font-medium">{s.day} — {s.time}</span>
                  </div>
                  <Badge className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-xs">{s.type}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Branch Members</CardTitle>
            <CardDescription>Showing 5 of 87 members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-xs font-semibold">
                    {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role} &middot; Joined {m.joined}</p>
                </div>
                <Badge className={m.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30"}>
                  {m.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  )
}
