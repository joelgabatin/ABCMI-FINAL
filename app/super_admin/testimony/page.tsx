"use client"

import { useState } from "react"
import {
  Star, Eye, EyeOff, Trash2, CheckCircle, Filter,
  Search, Sparkles, MessageSquare, User, ChevronDown, X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

type TestimonyStatus = "pending" | "featured" | "approved" | "hidden"

interface Testimony {
  id: number
  author: string
  branch: string
  category: string
  title: string
  content: string
  date: string
  status: TestimonyStatus
  anonymous: boolean
  likes: number
}

const initialTestimonies: Testimony[] = [
  { id: 1, author: "Maria Santos", branch: "ABCMI Main Church, Baguio City", category: "Healing", title: "Healed from chronic illness", content: "After months of prayer and trusting in God's plan, my doctor confirmed last week that the tumor that was found in my kidney has completely disappeared. I want to give all the glory to God for this miraculous healing. Our church community prayed faithfully and I felt every single prayer. Thank you Lord!", date: "Mar 18, 2026", status: "featured", anonymous: false, likes: 34 },
  { id: 2, author: "Anonymous", branch: "Camp 8, Baguio City", category: "Provision", title: "God provided for our family's needs", content: "We were on the verge of losing our home when God opened an unexpected door. A relative we hadn't spoken to in years called out of nowhere and offered to help. God's timing is always perfect. He never leaves us.", date: "Mar 15, 2026", status: "approved", anonymous: true, likes: 21 },
  { id: 3, author: "Jonathan Reyes", branch: "Kias, Baguio City", category: "Salvation", title: "My son came back to the Lord", content: "My son was lost for 6 years — caught in addiction and far from God. After persistent prayer and God's grace, he walked into our church one Sunday, knelt at the altar, and surrendered his life to Christ. There is nothing too hard for God!", date: "Mar 12, 2026", status: "featured", anonymous: false, likes: 58 },
  { id: 4, author: "Grace Alcantara", branch: "Villa Conchita, Manabo, Abra", category: "Protection", title: "Survived a road accident", content: "Our family was involved in a severe road accident on the way home from a church event. Our vehicle rolled twice but everyone came out without a single serious injury. The paramedics said it was a miracle we were all alive. God protected us!", date: "Mar 10, 2026", status: "approved", anonymous: false, likes: 45 },
  { id: 5, author: "Anonymous", branch: "San Carlos, Baguio City", category: "Provision", title: "Scholarship came through", content: "I had already accepted that college was not going to be possible for me this year. Then with only 2 days left before the deadline, I received news of a full scholarship. God made a way when there seemed to be no way.", date: "Mar 8, 2026", status: "pending", anonymous: true, likes: 0 },
  { id: 6, author: "Renaldo Cruz", branch: "Dalic, Bontoc, Mt. Province", category: "Healing", title: "Delivered from depression", content: "For two years I battled severe depression and was barely able to function. Through counseling with our pastor and the prayers of the church, God restored my mind and my joy. I am now serving in the music ministry and I am truly free.", date: "Mar 5, 2026", status: "pending", anonymous: false, likes: 0 },
  { id: 7, author: "Leticia Gomez", branch: "San Juan, Abra", category: "Answered Prayer", title: "Estranged family reunited", content: "A family rift that had lasted 11 years was healed this month. God softened hearts, forgiveness was exchanged, and we gathered together for the first time in over a decade. All things are possible with God.", date: "Feb 28, 2026", status: "hidden", anonymous: false, likes: 12 },
  { id: 8, author: "Dionisio Balangyao", branch: "Patiacan, Quirino, Ilocos Sur", category: "Deliverance", title: "Freedom from years of bondage", content: "God broke chains that had held me and my household for generations. Through prayer, fasting, and the authority of Christ, our family experienced true spiritual freedom. We are now stronger in faith than ever before.", date: "Feb 25, 2026", status: "approved", anonymous: false, likes: 27 },
]

const categories = ["All", "Healing", "Provision", "Salvation", "Protection", "Answered Prayer", "Deliverance"]

const statusConfig: Record<TestimonyStatus, { label: string; color: string }> = {
  featured: { label: "Featured", color: "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30" },
  approved: { label: "Approved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  pending: { label: "Pending Review", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  hidden: { label: "Hidden", color: "bg-muted text-muted-foreground border-border" },
}

export default function AdminTestimonyPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>(initialTestimonies)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [viewItem, setViewItem] = useState<Testimony | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const updateStatus = (id: number, status: TestimonyStatus) => {
    setTestimonies(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const deleteTestimony = (id: number) => {
    setTestimonies(prev => prev.filter(t => t.id !== id))
    setDeleteId(null)
  }

  const filtered = (tab: "all" | "pending" | "featured" | "approved" | "hidden") =>
    testimonies.filter(t => {
      const matchTab = tab === "all" || t.status === tab
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.author.toLowerCase().includes(search.toLowerCase()) ||
        t.content.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === "All" || t.category === categoryFilter
      return matchTab && matchSearch && matchCat
    })

  const stats = [
    { label: "Total", value: testimonies.length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
    { label: "Featured", value: testimonies.filter(t => t.status === "featured").length, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15" },
    { label: "Pending", value: testimonies.filter(t => t.status === "pending").length, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Hidden", value: testimonies.filter(t => t.status === "hidden").length, color: "text-muted-foreground", bg: "bg-muted" },
  ]

  const TestimonyCard = ({ t }: { t: Testimony }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[var(--church-primary)]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">
                {t.anonymous ? "Anonymous" : t.author}
              </p>
              <p className="text-xs text-muted-foreground truncate">{t.branch}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className={`text-xs ${statusConfig[t.status].color}`}>
              {statusConfig[t.status].label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setViewItem(t)}>
                  <Eye className="w-4 h-4 mr-2" /> View Full
                </DropdownMenuItem>
                {t.status !== "featured" && (
                  <DropdownMenuItem onClick={() => updateStatus(t.id, "featured")} className="text-[var(--church-gold)]">
                    <Sparkles className="w-4 h-4 mr-2" /> Feature on Website
                  </DropdownMenuItem>
                )}
                {t.status !== "approved" && (
                  <DropdownMenuItem onClick={() => updateStatus(t.id, "approved")} className="text-emerald-600">
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </DropdownMenuItem>
                )}
                {t.status !== "hidden" && (
                  <DropdownMenuItem onClick={() => updateStatus(t.id, "hidden")}>
                    <EyeOff className="w-4 h-4 mr-2" /> Hide
                  </DropdownMenuItem>
                )}
                {t.status === "hidden" && (
                  <DropdownMenuItem onClick={() => updateStatus(t.id, "approved")} className="text-emerald-600">
                    <Eye className="w-4 h-4 mr-2" /> Unhide
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setDeleteId(t.id)} className="text-destructive focus:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">{t.category}</Badge>
          <span className="text-xs text-muted-foreground">{t.date}</span>
        </div>

        <h3 className="font-semibold text-foreground mb-1">{t.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{t.content}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3.5 h-3.5 text-[var(--church-gold)]" />
            <span>{t.likes} encouragements</span>
          </div>
          <div className="flex gap-2">
            {t.status === "pending" && (
              <>
                <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                  onClick={() => updateStatus(t.id, "approved")}>
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setDeleteId(t.id)}>
                  <X className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
              </>
            )}
            {t.status === "approved" && (
              <Button size="sm" variant="outline" className="h-7 text-xs text-[var(--church-gold)] border-[var(--church-gold)]/30 hover:bg-[var(--church-gold)]/10"
                onClick={() => updateStatus(t.id, "featured")}>
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Feature
              </Button>
            )}
            {t.status === "featured" && (
              <Button size="sm" variant="outline" className="h-7 text-xs"
                onClick={() => updateStatus(t.id, "approved")}>
                <EyeOff className="w-3.5 h-3.5 mr-1" /> Unfeature
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Testimony Management</h1>
          <p className="text-muted-foreground mt-1">
            Review, feature, hide, or remove testimonies from the church community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <MessageSquare className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search testimonies..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className={categoryFilter === cat ? "bg-[var(--church-primary)] text-white hover:bg-[var(--church-primary-deep)]" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="all">All ({testimonies.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({testimonies.filter(t => t.status === "pending").length})</TabsTrigger>
            <TabsTrigger value="featured">Featured ({testimonies.filter(t => t.status === "featured").length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({testimonies.filter(t => t.status === "approved").length})</TabsTrigger>
            <TabsTrigger value="hidden">Hidden ({testimonies.filter(t => t.status === "hidden").length})</TabsTrigger>
          </TabsList>

          {(["all", "pending", "featured", "approved", "hidden"] as const).map(tab => (
            <TabsContent key={tab} value={tab}>
              {filtered(tab).length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    No testimonies found.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered(tab).map(t => <TestimonyCard key={t.id} t={t} />)}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* View Dialog */}
        <Dialog open={!!viewItem} onOpenChange={open => !open && setViewItem(null)}>
          <DialogContent className="max-w-lg">
            {viewItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewItem.title}</DialogTitle>
                  <DialogDescription>
                    {viewItem.anonymous ? "Anonymous" : viewItem.author} — {viewItem.branch}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{viewItem.category}</Badge>
                    <Badge variant="outline" className={`text-xs ${statusConfig[viewItem.status].color}`}>
                      {statusConfig[viewItem.status].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{viewItem.date}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-4">
                    {viewItem.content}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-[var(--church-gold)]" />
                    {viewItem.likes} people encouraged by this testimony
                  </div>
                  <div className="flex gap-2 pt-2">
                    {viewItem.status !== "featured" && (
                      <Button className="flex-1 bg-[var(--church-gold)] hover:bg-[var(--church-gold)]/90 text-white"
                        onClick={() => { updateStatus(viewItem.id, "featured"); setViewItem(null) }}>
                        <Sparkles className="w-4 h-4 mr-2" /> Feature on Website
                      </Button>
                    )}
                    {viewItem.status !== "hidden" && (
                      <Button variant="outline" className="flex-1"
                        onClick={() => { updateStatus(viewItem.id, "hidden"); setViewItem(null) }}>
                        <EyeOff className="w-4 h-4 mr-2" /> Hide
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this testimony?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The testimony will be permanently removed from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => deleteId !== null && deleteTestimony(deleteId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
