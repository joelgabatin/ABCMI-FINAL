"use client"

import { useState, useEffect } from "react"
import {
  Church, Target, Lightbulb, Shield, History,
  CheckCircle, Plus, Save, Loader2, Trash2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

// ── Types ─────────────────────────────────────────────────────────────────────
type CoreValue = { id: number | null; title: string }
type Belief    = { id: number | null; belief: string }
type HistEntry = { id: number | null; year: string; event: string }

// ── Per-row Save / Delete button ───────────────────────────────────────────────
function RowBtn({
  rowKey, savingKey, savedKey, onClick, variant = "save",
}: {
  rowKey:    string
  savingKey: string | null
  savedKey:  string | null
  onClick:   () => void
  variant?:  "save" | "delete"
}) {
  const busy  = savingKey === rowKey
  const done  = savedKey  === rowKey
  const isDel = variant === "delete"

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`w-8 h-8 flex-shrink-0 ${
        isDel
          ? "text-destructive hover:text-destructive"
          : done
            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
            : "text-[var(--church-primary)] hover:text-[var(--church-primary)]"
      }`}
      disabled={busy}
      onClick={onClick}
    >
      {busy   ? <Loader2 className="w-4 h-4 animate-spin" />
       : done  ? <CheckCircle className="w-4 h-4" />
       : isDel ? <Trash2 className="w-4 h-4" />
               : <Save className="w-4 h-4" />}
    </Button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminContentPage() {
  // ── VMD ──
  const [mission,      setMission]      = useState("")
  const [vision,       setVision]       = useState("")
  const [drivingForce, setDrivingForce] = useState("")
  const [vmdSaving,    setVmdSaving]    = useState(false)
  const [vmdSaved,     setVmdSaved]     = useState(false)
  const [vmdError,     setVmdError]     = useState<string | null>(null)

  // ── Lists ──
  const [coreValues, setCoreValues] = useState<CoreValue[]>([])
  const [beliefs,    setBeliefs]    = useState<Belief[]>([])
  const [history,    setHistory]    = useState<HistEntry[]>([])

  // ── Per-row feedback ──
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedKey,  setSavedKey]  = useState<string | null>(null)

  const flashSaved = (key: string) => {
    setSavedKey(key)
    setTimeout(() => setSavedKey(k => k === key ? null : k), 2000)
  }

  // ── Fetch from DB on mount ──
  useEffect(() => {
    fetch("/api/church-content")
      .then(r => r.json())
      .then(d => {
        setMission(d.mission ?? "")
        setVision(d.vision ?? "")
        setDrivingForce(d.drivingForce ?? "")
        setCoreValues(d.coreValues ?? [])
        setBeliefs(d.beliefs ?? [])
        setHistory(d.history ?? [])
      })
      .catch(() => {})
  }, [])

  // ── VMD save ──
  const saveVMD = async () => {
    setVmdSaving(true)
    setVmdError(null)
    try {
      const res  = await fetch("/api/church-vmd", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_body: mission, vision_body: vision, driving_force: drivingForce }),
      })
      const data = await res.json()
      if (!res.ok) {
        setVmdError(data.error ?? "Failed to save. Please try again.")
      } else {
        setVmdSaved(true)
        setTimeout(() => setVmdSaved(false), 2000)
      }
    } catch {
      setVmdError("Network error. Please try again.")
    } finally {
      setVmdSaving(false)
    }
  }

  // ── Core value ops ──
  const saveCoreValue = async (cv: CoreValue, idx: number) => {
    const key = `cv-save-${idx}`
    setSavingKey(key)
    if (cv.id === null) {
      const res  = await fetch("/api/church-core-values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: cv.title, sort_order: idx }),
      })
      const data = await res.json()
      setCoreValues(prev => prev.map((v, i) => i === idx ? { ...v, id: data.id } : v))
    } else {
      await fetch("/api/church-core-values", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cv.id, title: cv.title }),
      })
    }
    setSavingKey(null)
    flashSaved(key)
  }

  const deleteCoreValue = async (cv: CoreValue, idx: number) => {
    setSavingKey(`cv-del-${idx}`)
    if (cv.id !== null) {
      await fetch("/api/church-core-values", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cv.id }),
      })
    }
    setCoreValues(prev => prev.filter((_, i) => i !== idx))
    setSavingKey(null)
  }

  // ── Belief ops ──
  const saveBelief = async (b: Belief, idx: number) => {
    const key = `b-save-${idx}`
    setSavingKey(key)
    if (b.id === null) {
      const res  = await fetch("/api/church-beliefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ belief: b.belief, sort_order: idx }),
      })
      const data = await res.json()
      setBeliefs(prev => prev.map((v, i) => i === idx ? { ...v, id: data.id } : v))
    } else {
      await fetch("/api/church-beliefs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, belief: b.belief }),
      })
    }
    setSavingKey(null)
    flashSaved(key)
  }

  const deleteBelief = async (b: Belief, idx: number) => {
    setSavingKey(`b-del-${idx}`)
    if (b.id !== null) {
      await fetch("/api/church-beliefs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id }),
      })
    }
    setBeliefs(prev => prev.filter((_, i) => i !== idx))
    setSavingKey(null)
  }

  // ── History ops ──
  const saveHistory = async (h: HistEntry, idx: number) => {
    const key = `h-save-${idx}`
    setSavingKey(key)
    if (h.id === null) {
      const res  = await fetch("/api/church-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: h.year, event: h.event, sort_order: idx }),
      })
      const data = await res.json()
      setHistory(prev => prev.map((v, i) => i === idx ? { ...v, id: data.id } : v))
    } else {
      await fetch("/api/church-history", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: h.id, year: h.year, event: h.event }),
      })
    }
    setSavingKey(null)
    flashSaved(key)
  }

  const deleteHistory = async (h: HistEntry, idx: number) => {
    setSavingKey(`h-del-${idx}`)
    if (h.id !== null) {
      await fetch("/api/church-history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: h.id }),
      })
    }
    setHistory(prev => prev.filter((_, i) => i !== idx))
    setSavingKey(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Edit the content displayed on the public About Us page. Changes reflect immediately on save.
          </p>
        </div>

        {/* Stats from live DB data */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: CheckCircle, label: "Core Values",       value: coreValues.length, color: "text-emerald-600",              bg: "bg-emerald-500/10" },
            { icon: Shield,      label: "Statements of Faith", value: beliefs.length,  color: "text-[var(--church-primary)]",  bg: "bg-[var(--church-primary)]/10" },
            { icon: History,     label: "History Entries",   value: history.length,    color: "text-[var(--church-gold)]",     bg: "bg-[var(--church-gold)]/10" },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">

          {/* ── Mission, Vision & Driving Force ── */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[var(--church-primary)]" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-[var(--church-gold)]/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[var(--church-gold)]" />
                </div>
              </div>
              <div>
                <CardTitle className="text-base">Mission, Vision & Driving Force</CardTitle>
                <CardDescription>Core directional statements of ABCMI.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mission Statement</Label>
                <Textarea rows={3} value={mission} onChange={e => setMission(e.target.value)} className="text-sm leading-relaxed" />
              </div>
              <div className="space-y-2">
                <Label>Vision Statement</Label>
                <Textarea rows={3} value={vision} onChange={e => setVision(e.target.value)} className="text-sm leading-relaxed" />
              </div>
              <div className="space-y-2">
                <Label>Driving Force</Label>
                <Input value={drivingForce} onChange={e => setDrivingForce(e.target.value)} className="text-sm" />
              </div>
              {vmdError && <p className="text-sm text-destructive">{vmdError}</p>}
              <div className="flex justify-end">
                <Button
                  onClick={saveVMD}
                  disabled={vmdSaving}
                  className={vmdSaved
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"}
                >
                  {vmdSaving  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
                   : vmdSaved ? <><CheckCircle className="w-4 h-4 mr-2" />Saved</>
                              : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Core Values ── */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Core Values</CardTitle>
                  <CardDescription>The values that guide every ministry decision.</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCoreValues(prev => [...prev, { id: null, title: "" }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Value
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {coreValues.map((cv, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[var(--church-primary)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <Input
                    value={cv.title}
                    onChange={e => setCoreValues(prev => prev.map((v, j) => j === i ? { ...v, title: e.target.value } : v))}
                    className={`text-sm flex-1 ${cv.id === null ? "border-[var(--church-gold)]/60" : ""}`}
                    placeholder="Core value title"
                  />
                  <RowBtn rowKey={`cv-save-${i}`} savingKey={savingKey} savedKey={savedKey} onClick={() => saveCoreValue(cv, i)} />
                  <RowBtn rowKey={`cv-del-${i}`}  savingKey={savingKey} savedKey={savedKey} onClick={() => deleteCoreValue(cv, i)} variant="delete" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── Statement of Beliefs ── */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[var(--church-primary)]" />
                </div>
                <div>
                  <CardTitle className="text-base">Statement of Fundamentals of Truth and Faith</CardTitle>
                  <CardDescription>Doctrinal beliefs of ABCMI.</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setBeliefs(prev => [...prev, { id: null, belief: "" }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Belief
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {beliefs.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[var(--church-primary)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <Input
                    value={b.belief}
                    onChange={e => setBeliefs(prev => prev.map((v, j) => j === i ? { ...v, belief: e.target.value } : v))}
                    className={`text-sm flex-1 ${b.id === null ? "border-[var(--church-gold)]/60" : ""}`}
                    placeholder="Enter belief statement"
                  />
                  <RowBtn rowKey={`b-save-${i}`} savingKey={savingKey} savedKey={savedKey} onClick={() => saveBelief(b, i)} />
                  <RowBtn rowKey={`b-del-${i}`}  savingKey={savingKey} savedKey={savedKey} onClick={() => deleteBelief(b, i)} variant="delete" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── Church History ── */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--church-gold)]/20 flex items-center justify-center">
                  <History className="w-5 h-5 text-[var(--church-gold)]" />
                </div>
                <div>
                  <CardTitle className="text-base">Church History Timeline</CardTitle>
                  <CardDescription>Key milestones in the journey of ABCMI since 1984.</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setHistory(prev => [...prev, { id: null, year: "", event: "" }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Entry
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={h.year}
                    onChange={e => setHistory(prev => prev.map((v, j) => j === i ? { ...v, year: e.target.value } : v))}
                    className={`text-sm w-20 flex-shrink-0 font-semibold ${h.id === null ? "border-[var(--church-gold)]/60" : ""}`}
                    placeholder="Year"
                  />
                  <Input
                    value={h.event}
                    onChange={e => setHistory(prev => prev.map((v, j) => j === i ? { ...v, event: e.target.value } : v))}
                    className={`text-sm flex-1 ${h.id === null ? "border-[var(--church-gold)]/60" : ""}`}
                    placeholder="Event description"
                  />
                  <RowBtn rowKey={`h-save-${i}`} savingKey={savingKey} savedKey={savedKey} onClick={() => saveHistory(h, i)} />
                  <RowBtn rowKey={`h-del-${i}`}  savingKey={savingKey} savedKey={savedKey} onClick={() => deleteHistory(h, i)} variant="delete" />
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </main>
    </DashboardLayout>
  )
}
