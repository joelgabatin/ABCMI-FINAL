"use client"

import { useState } from 'react'
import {
  DollarSign, TrendingUp, Download, Search, Filter, Calendar,
  Users, ChevronLeft, Eye, ArrowUpDown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

// --- Sample data ---
const allDonations = [
  { id: 1, donor: 'Sarah Johnson', memberId: 1, amount: 500, type: 'Tithe', method: 'GCash', date: 'Mar 21, 2026', note: 'Monthly tithe' },
  { id: 2, donor: 'Anonymous', memberId: null, amount: 200, type: 'Offering', method: 'Cash', date: 'Mar 21, 2026', note: '' },
  { id: 3, donor: 'Michael Torres', memberId: 2, amount: 1000, type: 'Missions Fund', method: 'Bank Transfer', date: 'Mar 20, 2026', note: 'For Laos mission trip' },
  { id: 4, donor: 'Grace Mendoza', memberId: 3, amount: 300, type: 'Tithe', method: 'GCash', date: 'Mar 19, 2026', note: '' },
  { id: 5, donor: 'James Reyes', memberId: 4, amount: 150, type: 'Building Fund', method: 'Cash', date: 'Mar 18, 2026', note: 'Church renovation' },
  { id: 6, donor: 'Sarah Johnson', memberId: 1, amount: 500, type: 'Tithe', method: 'GCash', date: 'Feb 21, 2026', note: '' },
  { id: 7, donor: 'Michael Torres', memberId: 2, amount: 500, type: 'Offering', method: 'GCash', date: 'Feb 20, 2026', note: 'Valentine offering' },
  { id: 8, donor: 'Grace Mendoza', memberId: 3, amount: 300, type: 'Tithe', method: 'GCash', date: 'Feb 19, 2026', note: '' },
  { id: 9, donor: 'Sarah Johnson', memberId: 1, amount: 250, type: 'Missions Fund', method: 'Bank Transfer', date: 'Feb 5, 2026', note: '' },
  { id: 10, donor: 'James Reyes', memberId: 4, amount: 200, type: 'Tithe', method: 'Cash', date: 'Feb 18, 2026', note: '' },
  { id: 11, donor: 'Mary Santos', memberId: 5, amount: 250, type: 'Offering', method: 'GCash', date: 'Mar 17, 2026', note: 'Easter offering pledge' },
  { id: 12, donor: 'David Cruz', memberId: 6, amount: 400, type: 'Tithe', method: 'GCash', date: 'Mar 14, 2026', note: '' },
  { id: 13, donor: 'Ana Villanueva', memberId: 7, amount: 100, type: 'Offering', method: 'Cash', date: 'Mar 10, 2026', note: '' },
  { id: 14, donor: 'Rosa Dela Cruz', memberId: 8, amount: 350, type: 'Missions Fund', method: 'Bank Transfer', date: 'Mar 8, 2026', note: '' },
  { id: 15, donor: 'David Cruz', memberId: 6, amount: 400, type: 'Tithe', method: 'GCash', date: 'Feb 14, 2026', note: '' },
  { id: 16, donor: 'Mary Santos', memberId: 5, amount: 150, type: 'Building Fund', method: 'Cash', date: 'Feb 10, 2026', note: '' },
]

const memberProfiles: Record<number, { name: string; branch: string; email: string; joinDate: string; memberSince: string }> = {
  1: { name: 'Sarah Johnson', branch: 'ABCMI Main Church', email: 'sarah@email.com', joinDate: 'Jan 2024', memberSince: '2024-01-15' },
  2: { name: 'Michael Torres', branch: 'Camp 8, Baguio City', email: 'michael@email.com', joinDate: 'Mar 2023', memberSince: '2023-03-10' },
  3: { name: 'Grace Mendoza', branch: 'ABCMI Main Church', email: 'grace@email.com', joinDate: 'Jun 2022', memberSince: '2022-06-01' },
  4: { name: 'James Reyes', branch: 'San Carlos, Baguio City', email: 'james@email.com', joinDate: 'Sep 2023', memberSince: '2023-09-20' },
  5: { name: 'Mary Santos', branch: 'ABCMI Main Church', email: 'mary@email.com', joinDate: 'Feb 2024', memberSince: '2024-02-05' },
  6: { name: 'David Cruz', branch: 'Kias, Baguio City', email: 'david@email.com', joinDate: 'Apr 2022', memberSince: '2022-04-12' },
  7: { name: 'Ana Villanueva', branch: 'ABCMI Main Church', email: 'ana@email.com', joinDate: 'Jul 2023', memberSince: '2023-07-08' },
  8: { name: 'Rosa Dela Cruz', branch: 'Dalic, Bontoc, Mt. Province', email: 'rosa@email.com', joinDate: 'Nov 2021', memberSince: '2021-11-30' },
}

const monthlyData = [
  { month: 'Jan 2026', amount: 3200 },
  { month: 'Feb 2026', amount: 3850 },
  { month: 'Mar 2026', amount: 4750 },
]

const typeBreakdown = [
  { type: 'Tithe', amount: 2550, percentage: 34 },
  { type: 'Offering', amount: 1100, percentage: 15 },
  { type: 'Missions Fund', amount: 1850, percentage: 25 },
  { type: 'Building Fund', amount: 500, percentage: 7 },
  { type: 'Special Gift', amount: 1500, percentage: 20 },
]

const types = ['All', 'Tithe', 'Offering', 'Missions Fund', 'Building Fund', 'Special Gift']
const methods = ['All', 'GCash', 'Cash', 'Bank Transfer']

const typeColors: Record<string, string> = {
  'Tithe': 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]',
  'Offering': 'bg-emerald-500/10 text-emerald-600',
  'Missions Fund': 'bg-blue-500/10 text-blue-600',
  'Building Fund': 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]',
  'Special Gift': 'bg-rose-500/10 text-rose-600',
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Compute per-member totals
function getMemberSummaries() {
  const map: Record<number, { total: number; count: number; lastDate: string; types: Record<string, number> }> = {}
  for (const d of allDonations) {
    if (!d.memberId) continue
    if (!map[d.memberId]) map[d.memberId] = { total: 0, count: 0, lastDate: d.date, types: {} }
    map[d.memberId].total += d.amount
    map[d.memberId].count += 1
    map[d.memberId].types[d.type] = (map[d.memberId].types[d.type] || 0) + d.amount
  }
  return Object.entries(map).map(([id, data]) => ({
    memberId: Number(id),
    ...memberProfiles[Number(id)],
    ...data,
    topType: Object.entries(data.types).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '',
  }))
}

export default function AdminDonationsPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterMethod, setFilterMethod] = useState('All')
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [memberSearch, setMemberSearch] = useState('')

  const memberSummaries = getMemberSummaries()

  const filtered = allDonations.filter(d => {
    const matchSearch = d.donor.toLowerCase().includes(search.toLowerCase()) || d.note.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'All' || d.type === filterType
    const matchMethod = filterMethod === 'All' || d.method === filterMethod
    return matchSearch && matchType && matchMethod
  })

  const totalThisMonth = allDonations.filter(d => d.date.includes('Mar 2026')).reduce((s, d) => s + d.amount, 0)
  const avgDonation = Math.round(allDonations.reduce((s, d) => s + d.amount, 0) / allDonations.length)
  const uniqueMembers = new Set(allDonations.filter(d => d.memberId).map(d => d.memberId)).size

  // Member detail view
  const selectedMember = selectedMemberId ? memberProfiles[selectedMemberId] : null
  const memberDonations = selectedMemberId
    ? allDonations.filter(d => d.memberId === selectedMemberId)
    : []
  const memberTotal = memberDonations.reduce((s, d) => s + d.amount, 0)

  const filteredMemberSummaries = memberSummaries.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.branch.toLowerCase().includes(memberSearch.toLowerCase())
  )

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Donations</h1>
            <p className="text-muted-foreground mt-1">Track and manage church giving records</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₱{totalThisMonth.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">+23%</p>
                <p className="text-sm text-muted-foreground">vs Last Month</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{uniqueMembers}</p>
                <p className="text-sm text-muted-foreground">Giving Members</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₱{avgDonation.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Avg. Donation</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Trend</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {monthlyData.map(row => (
                <div key={row.month}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{row.month}</span>
                    <span className="font-semibold text-foreground">₱{row.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-[var(--church-primary)] h-2 rounded-full" style={{ width: `${(row.amount / 5000) * 100}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Fund Breakdown</CardTitle>
              <CardDescription>All-time allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {typeBreakdown.map(item => (
                <div key={item.type} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-32 flex-shrink-0">{item.type}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-[var(--church-primary)] h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-28 text-right">₱{item.amount.toLocaleString()} ({item.percentage}%)</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tabs: All Donations | Per Member */}
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Donations</TabsTrigger>
            <TabsTrigger value="members">Per Member</TabsTrigger>
          </TabsList>

          {/* All Donations Tab */}
          <TabsContent value="all">
            <Card className="mb-4">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search donations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" />{filterType}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>{types.map(t => <DropdownMenuItem key={t} onClick={() => setFilterType(t)}>{t}</DropdownMenuItem>)}</DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" />{filterMethod}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>{methods.map(m => <DropdownMenuItem key={m} onClick={() => setFilterMethod(m)}>{m}</DropdownMenuItem>)}</DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Donation Records</CardTitle>
                <CardDescription>{filtered.length} transactions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donor</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead className="hidden md:table-cell">Method</TableHead>
                        <TableHead className="hidden lg:table-cell">Note</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(donation => (
                        <TableRow key={donation.id}>
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              {donation.memberId && (
                                <div className="w-7 h-7 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--church-primary)]">
                                  {getInitials(donation.donor)}
                                </div>
                              )}
                              {donation.donor}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-[var(--church-gold)]">₱{donation.amount.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary" className={`${typeColors[donation.type]} text-xs`}>{donation.type}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{donation.method}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{donation.note || '-'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{donation.date}</TableCell>
                          <TableCell>
                            {donation.memberId && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                title="View member profile"
                                onClick={() => setSelectedMemberId(donation.memberId)}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Per Member Tab */}
          <TabsContent value="members">
            {selectedMemberId && selectedMember ? (
              // Individual member view
              <div className="space-y-4">
                <Button variant="outline" className="gap-2" onClick={() => setSelectedMemberId(null)}>
                  <ChevronLeft className="w-4 h-4" />
                  Back to All Members
                </Button>

                {/* Member header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 flex-wrap">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-[var(--church-primary)] text-white text-xl font-bold">
                          {getInitials(selectedMember.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground">{selectedMember.name}</h2>
                        <p className="text-muted-foreground text-sm">{selectedMember.branch}</p>
                        <p className="text-muted-foreground text-sm">{selectedMember.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">Member since {selectedMember.joinDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-[var(--church-gold)]">₱{memberTotal.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Donations</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{memberDonations.length} transactions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Type breakdown for this member */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {Object.entries(
                    memberDonations.reduce((acc, d) => { acc[d.type] = (acc[d.type] || 0) + d.amount; return acc }, {} as Record<string, number>)
                  ).map(([type, amount]) => (
                    <Card key={type}>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className={`${typeColors[type]} text-xs mb-2`}>{type}</Badge>
                        <p className="text-xl font-bold text-foreground">₱{amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{memberDonations.filter(d => d.type === type).length} donations</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Transaction list */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Transaction History</CardTitle>
                    <CardDescription>{memberDonations.length} total records</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Note</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {memberDonations.map(d => (
                          <TableRow key={d.id}>
                            <TableCell className="font-bold text-[var(--church-gold)]">₱{d.amount.toLocaleString()}</TableCell>
                            <TableCell><Badge variant="secondary" className={`${typeColors[d.type]} text-xs`}>{d.type}</Badge></TableCell>
                            <TableCell className="text-sm text-muted-foreground">{d.method}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{d.note || '-'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{d.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Member list
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search members..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} className="pl-10 max-w-sm" />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Member Giving Summary</CardTitle>
                    <CardDescription>{filteredMemberSummaries.length} members with donation records</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Branch</TableHead>
                          <TableHead className="hidden md:table-cell">Transactions</TableHead>
                          <TableHead className="hidden md:table-cell">Top Fund</TableHead>
                          <TableHead>
                            <div className="flex items-center gap-1">
                              Total Given
                              <ArrowUpDown className="w-3 h-3" />
                            </div>
                          </TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMemberSummaries
                          .sort((a, b) => b.total - a.total)
                          .map(member => (
                            <TableRow key={member.memberId} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedMemberId(member.memberId)}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-[var(--church-primary)] text-white text-xs font-bold">
                                      {getInitials(member.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">Since {member.joinDate}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{member.branch}</TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{member.count}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {member.topType && (
                                  <Badge variant="secondary" className={`${typeColors[member.topType]} text-xs`}>{member.topType}</Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-bold text-[var(--church-gold)]">₱{member.total.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
