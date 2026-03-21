"use client"

import { useState } from 'react'
import { DollarSign, Heart, CheckCircle, Copy, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const myHistory = [
  { id: 1, type: 'Tithe', amount: 500, method: 'GCash', date: 'Mar 7, 2026', status: 'received' },
  { id: 2, type: 'Offering', amount: 200, method: 'Cash', date: 'Feb 28, 2026', status: 'received' },
  { id: 3, type: 'Missions Fund', amount: 300, method: 'GCash', date: 'Feb 14, 2026', status: 'received' },
  { id: 4, type: 'Tithe', amount: 500, method: 'GCash', date: 'Feb 7, 2026', status: 'received' },
  { id: 5, type: 'Building Fund', amount: 150, method: 'Bank Transfer', date: 'Jan 30, 2026', status: 'received' },
]

const fundTypes = ['Tithe', 'Offering', 'Missions Fund', 'Building Fund', 'Special Gift']
const quickAmounts = [100, 200, 500, 1000, 2000]

const paymentAccounts = [
  { method: 'GCash', number: '0917-XXX-XXXX', name: 'ARISE AND BUILD FOR CHRIST MINISTRIES INC.' },
  { method: 'BPI', number: '1234-5678-90', name: 'ARISE AND BUILD FOR CHRIST MINISTRIES INC.' },
  { method: 'BDO', number: '0098-7654-321', name: 'ARISE AND BUILD FOR CHRIST MINISTRIES INC.' },
]

const totalGiven = myHistory.reduce((sum, h) => sum + h.amount, 0)
const thisMonthGiven = myHistory.filter(h => h.date.includes('Mar')).reduce((sum, h) => sum + h.amount, 0)

const typeColors: Record<string, string> = {
  'Tithe': 'bg-[var(--church-primary)]/10 text-[var(--church-primary)]',
  'Offering': 'bg-emerald-500/10 text-emerald-600',
  'Missions Fund': 'bg-blue-500/10 text-blue-600',
  'Building Fund': 'bg-[var(--church-gold)]/10 text-[var(--church-gold)]',
  'Special Gift': 'bg-rose-500/10 text-rose-600',
}

export default function MemberDonatePage() {
  const [amount, setAmount] = useState('')
  const [selectedFund, setSelectedFund] = useState('Tithe')
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmit = () => {
    if (!amount) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setAmount('')
  }

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Give / Donate</h1>
          <p className="text-muted-foreground mt-1">Support the ministry through your faithful giving</p>
        </div>

        {/* Scripture Banner */}
        <Card className="mb-6 bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-0">
          <CardContent className="p-6">
            <p className="text-xs font-medium opacity-80 mb-2 uppercase tracking-wide">A Word on Giving</p>
            <blockquote className="text-base font-serif italic leading-relaxed">
              {'"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."'}
            </blockquote>
            <p className="mt-3 text-sm font-medium">— 2 Corinthians 9:7 (NIV)</p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₱{thisMonthGiven.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Given This Month</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₱{totalGiven.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Given</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{myHistory.length}</p>
                <p className="text-sm text-muted-foreground">Transactions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="give">
          <TabsList className="mb-6">
            <TabsTrigger value="give">Give Now</TabsTrigger>
            <TabsTrigger value="accounts">Payment Accounts</TabsTrigger>
            <TabsTrigger value="history">My History</TabsTrigger>
          </TabsList>

          {/* Give Now */}
          <TabsContent value="give">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Record Your Giving</CardTitle>
                  <CardDescription>Log a donation after completing your transfer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {submitted && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      <p className="text-sm font-medium">Thank you! Your giving record has been submitted.</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Fund Type</Label>
                    <Select value={selectedFund} onValueChange={setSelectedFund}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fundTypes.map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (₱)</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {quickAmounts.map(q => (
                        <Button
                          key={q}
                          variant={amount === String(q) ? 'default' : 'outline'}
                          size="sm"
                          className={amount === String(q) ? 'bg-[var(--church-primary)] text-white' : ''}
                          onClick={() => setAmount(String(q))}
                        >
                          ₱{q}
                        </Button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      placeholder="Or enter custom amount"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gcash">GCash</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bpi">BPI Bank Transfer</SelectItem>
                        <SelectItem value="bdo">BDO Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Note (optional)</Label>
                    <Textarea placeholder="e.g. For the missions fund, designated for Laos..." rows={2} />
                  </div>
                  <Button
                    className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                    onClick={handleSubmit}
                    disabled={!amount}
                  >
                    Submit Record
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Give</CardTitle>
                  <CardDescription>Step-by-step guide for digital giving</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: 1, title: 'Choose your fund', desc: 'Decide whether your giving is for tithes, offering, missions, or another fund.' },
                    { step: 2, title: 'Send your payment', desc: 'Transfer to any of our church accounts (see Payment Accounts tab).' },
                    { step: 3, title: 'Record your giving', desc: 'Log your donation using the form on this page for your records.' },
                    { step: 4, title: 'Keep your reference', desc: 'Save your transfer reference number in case of any follow-up.' },
                  ].map(item => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Accounts */}
          <TabsContent value="accounts">
            <div className="grid md:grid-cols-3 gap-4">
              {paymentAccounts.map(account => (
                <Card key={account.method}>
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-[var(--church-primary)]" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg">{account.method}</p>
                      <p className="text-sm text-muted-foreground mt-1">{account.name}</p>
                      <p className="text-base font-mono font-semibold text-foreground mt-2">{account.number}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => handleCopy(account.number)}
                    >
                      {copied === account.number ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Number
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>My Giving History</CardTitle>
                <CardDescription>Your personal donation records</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {myHistory.map(item => (
                    <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-[var(--church-gold)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground text-sm">{item.type}</p>
                          <Badge variant="secondary" className={`${typeColors[item.type]} text-xs`}>
                            {item.method}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                      </div>
                      <p className="font-bold text-[var(--church-gold)] text-base">₱{item.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
