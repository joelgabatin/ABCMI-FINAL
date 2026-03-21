"use client"

import { useState } from 'react'
import {
  DollarSign, TrendingUp, Download, Search, Filter, Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const donations = [
  { id: 1, donor: 'Sarah Johnson', amount: 500, type: 'Tithe', method: 'GCash', date: 'Mar 21, 2026', status: 'received', note: 'Monthly tithe' },
  { id: 2, donor: 'Anonymous', amount: 200, type: 'Offering', method: 'Cash', date: 'Mar 21, 2026', status: 'received', note: '' },
  { id: 3, donor: 'Michael Torres', amount: 1000, type: 'Missions Fund', method: 'Bank Transfer', date: 'Mar 20, 2026', status: 'received', note: 'For Laos mission trip' },
  { id: 4, donor: 'Grace Mendoza', amount: 300, type: 'Tithe', method: 'GCash', date: 'Mar 19, 2026', status: 'received', note: '' },
  { id: 5, donor: 'James Reyes', amount: 150, type: 'Building Fund', method: 'Cash', date: 'Mar 18, 2026', status: 'received', note: 'Church renovation' },
  { id: 6, donor: 'Mary Santos', amount: 250, type: 'Offering', method: 'GCash', date: 'Mar 17, 2026', status: 'received', note: 'Easter offering pledge' },
  { id: 7, donor: 'Anonymous', amount: 1500, type: 'Special Gift', method: 'Bank Transfer', date: 'Mar 15, 2026', status: 'received', note: 'Youth ministry equipment' },
  { id: 8, donor: 'David Cruz', amount: 400, type: 'Tithe', method: 'GCash', date: 'Mar 14, 2026', status: 'received', note: '' },
  { id: 9, donor: 'Ana Villanueva', amount: 100, type: 'Offering', method: 'Cash', date: 'Mar 10, 2026', status: 'received', note: '' },
  { id: 10, donor: 'Rosa Dela Cruz', amount: 350, type: 'Missions Fund', method: 'Bank Transfer', date: 'Mar 8, 2026', status: 'received', note: '' },
]

const monthlyData = [
  { month: 'Jan 2026', amount: 3200 },
  { month: 'Feb 2026', amount: 3850 },
  { month: 'Mar 2026', amount: 4750 },
]

const typeBreakdown = [
  { type: 'Tithe', amount: 1550, percentage: 33 },
  { type: 'Offering', amount: 750, percentage: 16 },
  { type: 'Missions Fund', amount: 1300, percentage: 27 },
  { type: 'Building Fund', amount: 150, percentage: 3 },
  { type: 'Special Gift', amount: 1500, percentage: 32 },
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

export default function AdminDonationsPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterMethod, setFilterMethod] = useState('All')

  const filtered = donations.filter(d => {
    const matchSearch = d.donor.toLowerCase().includes(search.toLowerCase()) ||
      d.note.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'All' || d.type === filterType
    const matchMethod = filterMethod === 'All' || d.method === filterMethod
    return matchSearch && matchType && matchMethod
  })

  const totalThisMonth = donations.reduce((sum, d) => sum + d.amount, 0)
  const avgDonation = Math.round(totalThisMonth / donations.length)

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
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
                <Calendar className="w-6 h-6 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{donations.length}</p>
                <p className="text-sm text-muted-foreground">Transactions</p>
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

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {monthlyData.map(row => (
                <div key={row.month}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{row.month}</span>
                    <span className="font-semibold text-foreground">₱{row.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-[var(--church-primary)] h-2 rounded-full"
                      style={{ width: `${(row.amount / 5000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fund Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Fund Breakdown</CardTitle>
              <CardDescription>Current month allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {typeBreakdown.map(item => (
                <div key={item.type} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-32 flex-shrink-0">{item.type}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-[var(--church-primary)] h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-24 text-right">
                    ₱{item.amount.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search donations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {types.map(t => (
                  <DropdownMenuItem key={t} onClick={() => setFilterType(t)}>{t}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterMethod}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {methods.map(m => (
                  <DropdownMenuItem key={m} onClick={() => setFilterMethod(m)}>{m}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Table */}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(donation => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium text-foreground">{donation.donor}</TableCell>
                      <TableCell className="font-bold text-[var(--church-gold)]">
                        ₱{donation.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className={`${typeColors[donation.type]} text-xs`}>
                          {donation.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {donation.method}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {donation.note || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{donation.date}</TableCell>
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
