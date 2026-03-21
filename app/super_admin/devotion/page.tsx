"use client"

import { useState } from "react"
import {
  BookOpen, Plus, Edit, Trash2, Search, Calendar, Eye,
  Save, X, Star, ChevronLeft, ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Devotional {
  id: number
  date: string
  title: string
  scripture: string
  scriptureText: string
  reflection: string
  featuredVerse: string
  featuredVerseRef: string
  published: boolean
  featured: boolean
  author: string
}

const initialDevotionals: Devotional[] = [
  {
    id: 1, date: "2026-03-21", title: "Walking in the Light",
    scripture: "John 8:12",
    scriptureText: "Again Jesus spoke to them, saying, 'I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life.'",
    reflection: "Jesus declares Himself the Light of the world — not a light, but the light. In a world filled with confusion, moral ambiguity, and spiritual darkness, Christ offers clear direction and life. To follow Him is to walk in clarity, purpose, and peace. Today, let us choose to walk closely with Him, letting His Word illuminate our steps and His Spirit guide our decisions. When we face uncertainty, we can trust that the One who made the stars knows the path ahead.",
    featuredVerse: "Your word is a lamp to my feet and a light to my path.",
    featuredVerseRef: "Psalm 119:105",
    published: true, featured: true, author: "Ptr. Ysrael Coyoy"
  },
  {
    id: 2, date: "2026-03-20", title: "The God Who Provides",
    scripture: "Philippians 4:19",
    scriptureText: "And my God will supply every need of yours according to his riches in glory in Christ Jesus.",
    reflection: "Paul wrote this from prison — and yet he speaks with absolute confidence in God's provision. He did not say God might supply, or sometimes supplies, but that God will supply every need according to His riches in glory. This is not a promise for comfort and luxury, but for sufficiency. God knows your needs before you ask. He sees the gaps in your life and is already working to fill them. Trust in His timing and His goodness.",
    featuredVerse: "Cast all your anxiety on him because he cares for you.",
    featuredVerseRef: "1 Peter 5:7",
    published: true, featured: false, author: "Ptr. Fhey Coyoy"
  },
  {
    id: 3, date: "2026-03-19", title: "Arise and Build",
    scripture: "Nehemiah 2:18",
    scriptureText: "I also told them about the gracious hand of my God on me and what the king had said to me. They replied, 'Let us start rebuilding.' So they began this good work.",
    reflection: "Nehemiah faced a broken Jerusalem and a seemingly impossible mission. But when the people heard about God's gracious hand, they were stirred to action — 'Let us start rebuilding.' This is the spirit of ABCMI: to arise from what is broken and build what God has purposed. Every ministry, every outreach, every local church planted is a stone laid in God's wall of salvation. Today, be encouraged. The work is not in vain. God's hand is upon it.",
    featuredVerse: "We are God's handiwork, created in Christ Jesus to do good works.",
    featuredVerseRef: "Ephesians 2:10",
    published: true, featured: false, author: "Ptr. Ysrael Coyoy"
  },
  {
    id: 4, date: "2026-03-18", title: "The Power of Prayer",
    scripture: "James 5:16",
    scriptureText: "The prayer of a righteous person is powerful and effective.",
    reflection: "James reminds us that prayer is not a religious ritual — it is a powerful, effective force. The Greek word for 'effective' suggests something that accomplishes its purpose. When we pray according to God's will, in faith, and in righteousness, heaven moves. Elijah was a man just like us, and his prayers shut and opened the heavens. Your prayers matter. Do not treat them as a last resort. Make them your first response.",
    featuredVerse: "Devote yourselves to prayer, being watchful and thankful.",
    featuredVerseRef: "Colossians 4:2",
    published: false, featured: false, author: "Ptr. Julio Coyoy"
  },
  {
    id: 5, date: "2026-03-17", title: "Faithful in Little",
    scripture: "Luke 16:10",
    scriptureText: "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.",
    reflection: "God's kingdom operates on the principle of faithfulness. Before God entrusts us with greater responsibility, He watches how we handle the small things — our time, our words, our daily commitments. The servant who was faithful with little was given charge over much. Whatever God has placed in your hands today — whether a small ministry, a family to care for, or a job that feels insignificant — do it with excellence. Faithfulness in small things is the training ground for great things.",
    featuredVerse: "Well done, good and faithful servant!",
    featuredVerseRef: "Matthew 25:21",
    published: true, featured: false, author: "Ptr. Fhey Coyoy"
  },
]

const emptyDevotional: Omit<Devotional, "id"> = {
  date: new Date().toISOString().split("T")[0], title: "", scripture: "", scriptureText: "",
  reflection: "", featuredVerse: "", featuredVerseRef: "", published: false, featured: false, author: ""
}

const ITEMS_PER_PAGE = 5

export default function AdminDevotionPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>(initialDevotionals)
  const [dialog, setDialog] = useState(false)
  const [editing, setEditing] = useState<Devotional | null>(null)
  const [form, setForm] = useState<Omit<Devotional, "id">>(emptyDevotional)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [preview, setPreview] = useState<Devotional | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyDevotional); setDialog(true) }
  const openEdit = (d: Devotional) => {
    setEditing(d)
    setForm({ date: d.date, title: d.title, scripture: d.scripture, scriptureText: d.scriptureText, reflection: d.reflection, featuredVerse: d.featuredVerse, featuredVerseRef: d.featuredVerseRef, published: d.published, featured: d.featured, author: d.author })
    setDialog(true)
  }
  const save = () => {
    if (editing) setDevotionals(prev => prev.map(d => d.id === editing.id ? { ...d, ...form } : d))
    else setDevotionals(prev => [{ id: Date.now(), ...form }, ...prev])
    setDialog(false)
  }
  const remove = (id: number) => { setDevotionals(prev => prev.filter(d => d.id !== id)); setDeleteId(null) }
  const togglePublish = (id: number) => setDevotionals(prev => prev.map(d => d.id === id ? { ...d, published: !d.published } : d))
  const toggleFeatured = (id: number) => setDevotionals(prev => prev.map(d => d.id === id ? { ...d, featured: !d.featured } : d))

  const sorted = [...devotionals].sort((a, b) => b.date.localeCompare(a.date))
  const filtered = sorted.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.scripture.toLowerCase().includes(search.toLowerCase()) || d.author.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const todaysDevotional = sorted.find(d => d.published)

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Daily Devotional</h1>
          <p className="text-muted-foreground mt-1">Create, manage, and publish daily devotionals for the website.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Devotionals", value: devotionals.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10", icon: BookOpen },
            { label: "Published", value: devotionals.filter(d => d.published).length, color: "text-emerald-600", bg: "bg-emerald-500/10", icon: Eye },
            { label: "Drafts", value: devotionals.filter(d => !d.published).length, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15", icon: Edit },
            { label: "Featured", value: devotionals.filter(d => d.featured).length, color: "text-rose-500", bg: "bg-rose-500/10", icon: Star },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="list">
          <TabsList className="mb-6">
            <TabsTrigger value="list" className="gap-2"><BookOpen className="w-4 h-4" /> All Devotionals</TabsTrigger>
            <TabsTrigger value="today" className="gap-2"><Star className="w-4 h-4" /> Today's Devotional</TabsTrigger>
          </TabsList>

          {/* ALL DEVOTIONALS */}
          <TabsContent value="list">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search devotionals..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
              </div>
              <Button onClick={openAdd} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                <Plus className="w-4 h-4" /> New Devotional
              </Button>
            </div>

            <div className="space-y-3">
              {paginated.length === 0 ? (
                <Card><CardContent className="p-12 text-center text-muted-foreground">No devotionals found.</CardContent></Card>
              ) : paginated.map(d => (
                <Card key={d.id} className={d.featured ? "border-[var(--church-gold)]/40 bg-[var(--church-gold)]/5" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-[var(--church-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-semibold text-foreground">{d.title}</p>
                              {d.featured && <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30 text-xs">Featured</Badge>}
                              <Badge className={d.published ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs" : "bg-muted text-muted-foreground text-xs"}>
                                {d.published ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <p className="text-xs text-[var(--church-primary)] font-medium">{d.scripture}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{d.date} &middot; By {d.author}</p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{d.reflection}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setPreview(d)} title="Preview"><Eye className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(d)} title="Edit"><Edit className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(d.id)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Switch checked={d.published} onCheckedChange={() => togglePublish(d.id)} id={`pub-${d.id}`} />
                        <Label htmlFor={`pub-${d.id}`} className="text-xs text-muted-foreground cursor-pointer">Published</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={d.featured} onCheckedChange={() => toggleFeatured(d.id)} id={`feat-${d.id}`} />
                        <Label htmlFor={`feat-${d.id}`} className="text-xs text-muted-foreground cursor-pointer">Featured on Website</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* TODAY'S DEVOTIONAL */}
          <TabsContent value="today">
            {todaysDevotional ? (
              <div className="max-w-2xl space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {todaysDevotional.date}
                      {todaysDevotional.featured && <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30 ml-1">Featured</Badge>}
                    </div>
                    <CardTitle className="text-2xl">{todaysDevotional.title}</CardTitle>
                    <CardDescription>By {todaysDevotional.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Scripture — {todaysDevotional.scripture}</p>
                      <blockquote className="border-l-4 border-[var(--church-primary)] pl-4 italic text-foreground leading-relaxed">
                        {todaysDevotional.scriptureText}
                      </blockquote>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Reflection</p>
                      <p className="text-foreground leading-relaxed">{todaysDevotional.reflection}</p>
                    </div>
                    <div className="bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/20 rounded-xl p-5">
                      <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide mb-2">Featured Verse</p>
                      <p className="text-lg font-serif italic text-foreground leading-relaxed">"{todaysDevotional.featuredVerse}"</p>
                      <p className="text-sm font-semibold text-[var(--church-primary)] mt-2">— {todaysDevotional.featuredVerseRef}</p>
                    </div>
                    <Button onClick={() => openEdit(todaysDevotional)} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                      <Edit className="w-4 h-4" /> Edit This Devotional
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No published devotional found.</p>
                  <Button onClick={openAdd} className="mt-4 gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                    <Plus className="w-4 h-4" /> Create Today's Devotional
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Add/Edit Dialog */}
        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Devotional" : "New Devotional"}</DialogTitle>
              <DialogDescription>Fill in the devotional content below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Author</Label>
                  <Input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="e.g. Ptr. Ysrael Coyoy" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Devotional title" />
              </div>
              <div className="space-y-1.5">
                <Label>Scripture Reference</Label>
                <Input value={form.scripture} onChange={e => setForm(p => ({ ...p, scripture: e.target.value }))} placeholder="e.g. John 3:16" />
              </div>
              <div className="space-y-1.5">
                <Label>Scripture Text</Label>
                <Textarea value={form.scriptureText} onChange={e => setForm(p => ({ ...p, scriptureText: e.target.value }))} placeholder="Full Bible verse text..." rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>Reflection</Label>
                <Textarea value={form.reflection} onChange={e => setForm(p => ({ ...p, reflection: e.target.value }))} placeholder="Write the devotional reflection..." rows={5} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Featured Verse</Label>
                  <Textarea value={form.featuredVerse} onChange={e => setForm(p => ({ ...p, featuredVerse: e.target.value }))} placeholder="Key verse to highlight..." rows={2} />
                </div>
                <div className="space-y-1.5">
                  <Label>Featured Verse Reference</Label>
                  <Input value={form.featuredVerseRef} onChange={e => setForm(p => ({ ...p, featuredVerseRef: e.target.value }))} placeholder="e.g. Psalm 119:105" />
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch checked={form.published} onCheckedChange={v => setForm(p => ({ ...p, published: v }))} id="form-pub" />
                  <Label htmlFor="form-pub" className="cursor-pointer">Publish</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.featured} onCheckedChange={v => setForm(p => ({ ...p, featured: v }))} id="form-feat" />
                  <Label htmlFor="form-feat" className="cursor-pointer">Feature on Website</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
                <Button onClick={save} className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                  <Save className="w-4 h-4" /> {editing ? "Save Changes" : "Create Devotional"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={preview !== null} onOpenChange={() => setPreview(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview: {preview?.title}</DialogTitle>
            </DialogHeader>
            {preview && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">{preview.date} &middot; By {preview.author}</p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{preview.scripture}</p>
                  <blockquote className="border-l-4 border-[var(--church-primary)] pl-4 italic text-foreground text-sm leading-relaxed">
                    {preview.scriptureText}
                  </blockquote>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{preview.reflection}</p>
                <div className="bg-[var(--church-primary)]/5 border border-[var(--church-primary)]/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide mb-2">Featured Verse</p>
                  <p className="font-serif italic text-foreground">"{preview.featuredVerse}"</p>
                  <p className="text-sm font-semibold text-[var(--church-primary)] mt-1">— {preview.featuredVerseRef}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Devotional?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this devotional. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteId && remove(deleteId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
