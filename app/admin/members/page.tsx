"use client"

import { useState } from 'react'
import {
  Users, Search, Filter, MoreHorizontal, Mail, Phone,
  CheckCircle, Clock, UserPlus, Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const members = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 234-567-8901', ministry: 'Worship Team', status: 'active', joined: 'Jan 2022', attendance: '95%' },
  { id: 2, name: 'Michael Torres', email: 'michael.t@email.com', phone: '+1 234-567-8902', ministry: 'Youth Ministry', status: 'active', joined: 'Mar 2021', attendance: '88%' },
  { id: 3, name: 'Grace Mendoza', email: 'grace.m@email.com', phone: '+1 234-567-8903', ministry: "Children's Church", status: 'active', joined: 'Jun 2020', attendance: '92%' },
  { id: 4, name: 'James Reyes', email: 'james.r@email.com', phone: '+1 234-567-8904', ministry: 'Missions', status: 'inactive', joined: 'Feb 2019', attendance: '41%' },
  { id: 5, name: 'Mary Santos', email: 'mary.s@email.com', phone: '+1 234-567-8905', ministry: 'Prayer Team', status: 'active', joined: 'Sep 2022', attendance: '79%' },
  { id: 6, name: 'David Cruz', email: 'david.c@email.com', phone: '+1 234-567-8906', ministry: 'Worship Team', status: 'active', joined: 'Nov 2021', attendance: '83%' },
  { id: 7, name: 'Ana Villanueva', email: 'ana.v@email.com', phone: '+1 234-567-8907', ministry: 'Bible Study', status: 'active', joined: 'Apr 2023', attendance: '97%' },
  { id: 8, name: 'Pedro Bautista', email: 'pedro.b@email.com', phone: '+1 234-567-8908', ministry: 'Outreach', status: 'inactive', joined: 'Aug 2020', attendance: '52%' },
  { id: 9, name: 'Rosa Dela Cruz', email: 'rosa.d@email.com', phone: '+1 234-567-8909', ministry: 'Prayer Team', status: 'active', joined: 'Jul 2022', attendance: '91%' },
  { id: 10, name: 'Emmanuel Flores', email: 'emman.f@email.com', phone: '+1 234-567-8910', ministry: 'Youth Ministry', status: 'active', joined: 'Dec 2021', attendance: '76%' },
]

const ministries = ['All', 'Worship Team', 'Youth Ministry', "Children's Church", 'Missions', 'Prayer Team', 'Bible Study', 'Outreach']

export default function AdminMembersPage() {
  const [search, setSearch] = useState('')
  const [filterMinistry, setFilterMinistry] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchMinistry = filterMinistry === 'All' || m.ministry === filterMinistry
    const matchStatus = filterStatus === 'All' || m.status === filterStatus
    return matchSearch && matchMinistry && matchStatus
  })

  const activeCount = members.filter(m => m.status === 'active').length
  const inactiveCount = members.filter(m => m.status === 'inactive').length

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Members</h1>
            <p className="text-muted-foreground mt-1">Manage your church membership directory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{members.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{inactiveCount}</p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterMinistry}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {ministries.map(m => (
                  <DropdownMenuItem key={m} onClick={() => setFilterMinistry(m)}>{m}</DropdownMenuItem>
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
                {['All', 'active', 'inactive'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)} className="capitalize">{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Member Directory</CardTitle>
            <CardDescription>{filtered.length} members found</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead className="hidden md:table-cell">Ministry</TableHead>
                    <TableHead className="hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Attendance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-xs">
                          {member.ministry}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={`text-sm font-medium ${
                          parseInt(member.attendance) >= 80 ? 'text-emerald-600' : 'text-[var(--church-gold)]'
                        }`}>
                          {member.attendance}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={member.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-muted text-muted-foreground'
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {member.joined}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Edit Member</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  )
}
