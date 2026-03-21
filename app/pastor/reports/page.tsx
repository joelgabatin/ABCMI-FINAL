"use client"

import { useState } from "react"
import { FileText, Send, CheckCircle, Clock, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

const reports = [
  { id: 1, title: "February 2026 Monthly Report", type: "Monthly", period: "February 2026", submittedAt: "2026-03-01", status: "approved", attendance: "258", salvations: "3", baptisms: "1", notes: "Good month overall. Prayer meeting attendance increased." },
  { id: 2, title: "January 2026 Monthly Report", type: "Monthly", period: "January 2026", submittedAt: "2026-02-02", status: "approved", attendance: "241", salvations: "2", baptisms: "0", notes: "Started new year with 3 day fasting." },
  { id: 3, title: "Q4 2025 Quarterly Report", type: "Quarterly", period: "Q4 2025", submittedAt: "2026-01-05", status: "under_review", attendance: "780", salvations: "7", baptisms: "3", notes: "Christmas outreach reached 45 households." },
]

const emptyForm = { title: "", type: "Monthly", period: "", attendance: "", salvations: "", baptisms: "", notes: "" }

export default function PastorReportsPage() {
  const [reportList, setReportList] = useState(reports)
  const [dialog, setDialog] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setReportList(prev => [{ id: Date.now(), ...form, submittedAt: new Date().toISOString().split("T")[0], status: "pending" }, ...prev])
    setDialog(false)
    setForm(emptyForm)
    setSubmitted(true)
  }

  const statusBadge: Record<string, string> = {
    approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    pending: "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30",
    under_review: "bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-[var(--church-primary)]/20",
  }

  return (
    <DashboardLayout variant="pastor">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Report Submission</h1>
          <p className="text-muted-foreground mt-1">Submit monthly, quarterly, and annual reports to the administration.</p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-700">Your report has been submitted successfully and is under review.</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{reportList.length} reports submitted</p>
          <Button onClick={() => setDialog(true)} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
            <Plus className="w-4 h-4" /> Submit New Report
          </Button>
        </div>

        <div className="space-y-4">
          {reportList.map(r => (
            <Card key={r.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[var(--church-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{r.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Badge variant="secondary" className="text-xs">{r.type}</Badge>
                        <span>{r.period}</span>
                        <span>Submitted: {r.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={statusBadge[r.status] || "bg-muted text-muted-foreground"}>{r.status.replace("_", " ")}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg text-center">
                  <div><p className="text-lg font-bold text-foreground">{r.attendance}</p><p className="text-xs text-muted-foreground">Attendance</p></div>
                  <div><p className="text-lg font-bold text-emerald-600">{r.salvations}</p><p className="text-xs text-muted-foreground">Salvations</p></div>
                  <div><p className="text-lg font-bold text-[var(--church-primary)]">{r.baptisms}</p><p className="text-xs text-muted-foreground">Baptisms</p></div>
                </div>
                {r.notes && <p className="text-sm text-muted-foreground mt-3 italic">"{r.notes}"</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit Branch Report</DialogTitle>
              <DialogDescription>Fill in your branch report for the specified period.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Report Title</Label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. March 2026 Monthly Report" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Report Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="Special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Period</Label>
                  <Input value={form.period} onChange={e => setForm(p => ({ ...p, period: e.target.value }))} placeholder="e.g. March 2026" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Total Attendance</Label>
                  <Input type="number" value={form.attendance} onChange={e => setForm(p => ({ ...p, attendance: e.target.value }))} placeholder="0" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Salvations</Label>
                  <Input type="number" value={form.salvations} onChange={e => setForm(p => ({ ...p, salvations: e.target.value }))} placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <Label>Baptisms</Label>
                  <Input type="number" value={form.baptisms} onChange={e => setForm(p => ({ ...p, baptisms: e.target.value }))} placeholder="0" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Notes & Highlights</Label>
                  <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Key highlights, challenges, prayer requests for the period..." rows={4} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
                <Button type="submit" className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <Send className="w-4 h-4" /> Submit Report
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </DashboardLayout>
  )
}
