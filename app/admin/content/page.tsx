"use client"

import { useState } from "react"
import {
  FileText, Edit, Plus, Eye, Trash2, BookOpen, Calendar,
  Church, Target, Lightbulb, Shield, History, CheckCircle, X, Save
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { churchContent } from "@/lib/church-content"

// ── Sample data ──────────────────────────────────────────────────────────────
const sermons = [
  { id: 1, title: "Walking in Faith", scripture: "Hebrews 11:1-6", pastor: "Ptr. Ysrael Coyoy", date: "Mar 16, 2026", status: "published", views: 142 },
  { id: 2, title: "The Power of Prayer", scripture: "Matthew 6:5-15", pastor: "Ptr. Fhey Coyoy", date: "Mar 9, 2026", status: "published", views: 98 },
  { id: 3, title: "Forgiveness and Grace", scripture: "Ephesians 4:31-32", pastor: "Ptr. Ysrael Coyoy", date: "Mar 2, 2026", status: "published", views: 211 },
  { id: 4, title: "Easter Message 2026", scripture: "John 20:1-18", pastor: "Ptr. Ysrael Coyoy", date: "Apr 5, 2026", status: "draft", views: 0 },
  { id: 5, title: "Stewardship and Giving", scripture: "Malachi 3:10", pastor: "Ptr. Julio Coyoy", date: "Feb 23, 2026", status: "published", views: 76 },
]

const announcements = [
  { id: 1, title: "Easter Sunday Service Schedule", content: "This year's Easter celebration will have two services: 7 AM Easter Sunrise Service and 9 AM main worship service. All are welcome!", date: "Mar 20, 2026", status: "active" },
  { id: 2, title: "Youth Camp Registration Open", content: "Registration for our annual youth camp is now open. Camp will be held April 18–20 at Sto. Tomas, Benguet. Slots are limited!", date: "Mar 15, 2026", status: "active" },
  { id: 3, title: "Water Baptism Schedule", content: "Next water baptism is scheduled for April 12 after the morning service. Those interested, please sign up at the church office.", date: "Mar 10, 2026", status: "active" },
  { id: 4, title: "Church Anniversary Celebration", content: "Our 25th church anniversary will be celebrated on May 18, 2026. Begin inviting your friends and family for this special occasion!", date: "Mar 5, 2026", status: "upcoming" },
]

const bibleStudyMaterials = [
  { id: 1, title: "Romans Study Guide - Week 5", topic: "Righteousness Through Faith", date: "Mar 20, 2026", status: "published" },
  { id: 2, title: "Romans Study Guide - Week 4", topic: "Abraham's Faith as a Model", date: "Mar 13, 2026", status: "published" },
  { id: 3, title: "Romans Study Guide - Week 6 (Draft)", topic: "Life in the Spirit", date: "Mar 27, 2026", status: "draft" },
]

// ── About page editor state helpers ─────────────────────────────────────────
type CoreValue = { title: string; description: string }
type TimelineEntry = { year: string; event: string }

export default function AdminContentPage() {
  const [newSermonOpen, setNewSermonOpen] = useState(false)
  const [newSermon, setNewSermon] = useState({ title: "", scripture: "", content: "" })

  // About editor state — initialised from the shared data file
  const [mission, setMission] = useState(churchContent.mission.body)
  const [vision, setVision] = useState(churchContent.vision.body)
  const [drivingForce, setDrivingForce] = useState(churchContent.vision.drivingForce)
  const [coreValues, setCoreValues] = useState<CoreValue[]>(churchContent.coreValues)
  const [beliefs, setBeliefs] = useState<string[]>(churchContent.statementOfFaith.beliefs)
  const [timeline, setTimeline] = useState<TimelineEntry[]>(churchContent.history.timeline)

  // Saved indicator
  const [savedSection, setSavedSection] = useState<string | null>(null)

  const showSaved = (section: string) => {
    setSavedSection(section)
    setTimeout(() => setSavedSection(null), 2000)
  }

  const SaveButton = ({ section }: { section: string }) => (
    <Button
      onClick={() => showSaved(section)}
      className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
    >
      {savedSection === section ? (
        <><CheckCircle className="w-4 h-4 mr-2" />Saved</>
      ) : (
        <><Save className="w-4 h-4 mr-2" />Save Changes</>
      )}
    </Button>
  )

  // Core value helpers
  const updateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    setCoreValues(prev => prev.map((cv, i) => i === index ? { ...cv, [field]: value } : cv))
  }
  const addCoreValue = () => setCoreValues(prev => [...prev, { title: "", description: "" }])
  const removeCoreValue = (index: number) => setCoreValues(prev => prev.filter((_, i) => i !== index))

  // Belief helpers
  const updateBelief = (index: number, value: string) => {
    setBeliefs(prev => prev.map((b, i) => i === index ? value : b))
  }
  const addBelief = () => setBeliefs(prev => [...prev, ""])
  const removeBelief = (index: number) => setBeliefs(prev => prev.filter((_, i) => i !== index))

  // Timeline helpers
  const updateTimeline = (index: number, field: keyof TimelineEntry, value: string) => {
    setTimeline(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t))
  }
  const addTimelineEntry = () => setTimeline(prev => [...prev, { year: "", event: "" }])
  const removeTimelineEntry = (index: number) => setTimeline(prev => prev.filter((_, i) => i !== index))

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage sermons, announcements, study materials, and about page content.
            </p>
          </div>
          <Dialog open={newSermonOpen} onOpenChange={setNewSermonOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" />
                New Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Sermon</DialogTitle>
                <DialogDescription>Add a new sermon or message to the archive.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Sermon title" value={newSermon.title} onChange={e => setNewSermon(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Scripture Reference</Label>
                  <Input placeholder="e.g. John 3:16-17" value={newSermon.scripture} onChange={e => setNewSermon(p => ({ ...p, scripture: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Sermon Notes / Content</Label>
                  <Textarea placeholder="Enter sermon content or outline…" rows={5} value={newSermon.content} onChange={e => setNewSermon(p => ({ ...p, content: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setNewSermonOpen(false)}>Cancel</Button>
                  <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={() => setNewSermonOpen(false)}>
                    Publish
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: BookOpen, label: "Published Sermons", value: sermons.filter(s => s.status === "published").length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
            { icon: FileText, label: "Announcements", value: announcements.length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: Edit, label: "Draft Content", value: sermons.filter(s => s.status === "draft").length + bibleStudyMaterials.filter(b => b.status === "draft").length, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/10" },
            { icon: Eye, label: "Total Views", value: sermons.reduce((sum, s) => sum + s.views, 0), color: "text-rose-500", bg: "bg-rose-500/10" },
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

        <Tabs defaultValue="about">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="about" className="gap-2">
              <Church className="w-4 h-4" />
              About Page
            </TabsTrigger>
            <TabsTrigger value="sermons" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Sermons
            </TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2">
              <FileText className="w-4 h-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="bible-study" className="gap-2">
              <Calendar className="w-4 h-4" />
              Bible Study
            </TabsTrigger>
          </TabsList>

          {/* ── ABOUT PAGE EDITOR ── */}
          <TabsContent value="about" className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Edit the content displayed on the public About Us page. Changes are applied immediately on save.
            </p>

            {/* Mission */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[var(--church-primary)]" />
                </div>
                <div>
                  <CardTitle className="text-base">Mission Statement</CardTitle>
                  <CardDescription>What ABCMI is called to do.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  rows={4}
                  value={mission}
                  onChange={e => setMission(e.target.value)}
                  className="text-sm leading-relaxed"
                />
                <div className="flex justify-end">
                  <SaveButton section="mission" />
                </div>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--church-gold)]/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[var(--church-gold)]" />
                </div>
                <div>
                  <CardTitle className="text-base">Vision Statement</CardTitle>
                  <CardDescription>The God-given picture of where ABCMI is going.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Vision Body</Label>
                  <Textarea rows={4} value={vision} onChange={e => setVision(e.target.value)} className="text-sm leading-relaxed" />
                </div>
                <div className="space-y-2">
                  <Label>Driving Force</Label>
                  <Input value={drivingForce} onChange={e => setDrivingForce(e.target.value)} className="text-sm" />
                </div>
                <div className="flex justify-end">
                  <SaveButton section="vision" />
                </div>
              </CardContent>
            </Card>

            {/* Core Values */}
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
                <Button variant="outline" size="sm" onClick={addCoreValue}>
                  <Plus className="w-4 h-4 mr-1" /> Add Value
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {coreValues.map((cv, i) => (
                  <div key={i} className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Value {i + 1}</span>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => removeCoreValue(i)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Title</Label>
                      <Input value={cv.title} onChange={e => updateCoreValue(i, "title", e.target.value)} className="text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Description</Label>
                      <Textarea rows={2} value={cv.description} onChange={e => updateCoreValue(i, "description", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <SaveButton section="core-values" />
                </div>
              </CardContent>
            </Card>

            {/* Statement of Beliefs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[var(--church-primary)]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Statement of Fundamentals of Truth and Faith</CardTitle>
                    <CardDescription>The 14 doctrinal beliefs of ABCMI.</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={addBelief}>
                  <Plus className="w-4 h-4 mr-1" /> Add Belief
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {beliefs.map((belief, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[var(--church-primary)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <Input
                      value={belief}
                      onChange={e => updateBelief(i, e.target.value)}
                      className="text-sm flex-1"
                    />
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive flex-shrink-0" onClick={() => removeBelief(i)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <SaveButton section="beliefs" />
                </div>
              </CardContent>
            </Card>

            {/* History Timeline */}
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
                <Button variant="outline" size="sm" onClick={addTimelineEntry}>
                  <Plus className="w-4 h-4 mr-1" /> Add Entry
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {timeline.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Input
                      value={entry.year}
                      onChange={e => updateTimeline(i, "year", e.target.value)}
                      className="text-sm w-24 flex-shrink-0 font-semibold"
                      placeholder="Year"
                    />
                    <Input
                      value={entry.event}
                      onChange={e => updateTimeline(i, "event", e.target.value)}
                      className="text-sm flex-1"
                      placeholder="Event description"
                    />
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive flex-shrink-0" onClick={() => removeTimelineEntry(i)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <SaveButton section="history" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SERMONS ── */}
          <TabsContent value="sermons">
            <div className="space-y-3">
              {sermons.map(sermon => (
                <Card key={sermon.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-[var(--church-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm">{sermon.title}</p>
                        <Badge variant="secondary" className={
                          sermon.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 text-xs"
                            : "bg-[var(--church-gold)]/10 text-[var(--church-gold)] text-xs"
                        }>
                          {sermon.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{sermon.scripture} · {sermon.pastor} · {sermon.date}</p>
                      {sermon.status === "published" && (
                        <p className="text-xs text-muted-foreground mt-0.5">{sermon.views} views</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── ANNOUNCEMENTS ── */}
          <TabsContent value="announcements">
            <div className="space-y-3">
              {announcements.map(ann => (
                <Card key={ann.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">{ann.title}</CardTitle>
                        <CardDescription>{ann.date}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary" className={
                          ann.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 text-xs"
                            : "bg-[var(--church-gold)]/10 text-[var(--church-gold)] text-xs"
                        }>
                          {ann.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{ann.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── BIBLE STUDY ── */}
          <TabsContent value="bible-study">
            <div className="space-y-3">
              {bibleStudyMaterials.map(material => (
                <Card key={material.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm">{material.title}</p>
                        <Badge variant="secondary" className={
                          material.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 text-xs"
                            : "bg-[var(--church-gold)]/10 text-[var(--church-gold)] text-xs"
                        }>
                          {material.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{material.topic} · {material.date}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  )
}
