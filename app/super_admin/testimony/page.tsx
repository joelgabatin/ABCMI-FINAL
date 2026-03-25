"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Star, Eye, EyeOff, Trash2, CheckCircle, Filter,
  Search, Sparkles, MessageSquare, User, ChevronDown, X, Loader2, Mail
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type TestimonyStatus = "pending" | "featured" | "approved" | "hidden"

interface Testimony {
  id: number
  author: string
  email?: string | null
  branch: string
  category: string
  title: string
  content: string
  created_at: string
  status: TestimonyStatus
  anonymous: boolean
  is_member: boolean
  likes: number
}

const categories = ["All", "Healing", "Provision", "Salvation", "Protection", "Answered Prayer", "Deliverance", "Other"]

const statusConfig: Record<TestimonyStatus, { label: string; color: string }> = {
  featured: { label: "Featured", color: "bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30" },
  approved: { label: "Approved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  pending: { label: "Pending Review", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  hidden: { label: "Hidden", color: "bg-muted text-muted-foreground border-border" },
}

export default function AdminTestimonyPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [viewItem, setViewItem] = useState<Testimony | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const supabase = createClient()

  const fetchTestimonies = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('testimonies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error("Failed to load testimonies")
    } else {
      setTestimonies(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchTestimonies()
  }, [fetchTestimonies])

  const updateStatus = async (id: number, status: TestimonyStatus) => {
    setActionLoading(true)
    const { error } = await supabase
      .from('testimonies')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error("Update failed")
    } else {
      toast.success(`Testimony marked as ${status}`)
      setTestimonies(prev => prev.map(t => t.id === id ? { ...t, status } : t))
      if (viewItem?.id === id) setViewItem(prev => prev ? { ...prev, status } : null)
    }
    setActionLoading(false)
  }

  const deleteTestimony = async (id: number) => {
    setActionLoading(true)
    const { error } = await supabase
      .from('testimonies')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error("Delete failed")
    } else {
      toast.success("Testimony deleted")
      setTestimonies(prev => prev.filter(t => t.id !== id))
      setDeleteId(null)
    }
    setActionLoading(false)
  }

  const filtered = (tab: "all" | TestimonyStatus) =>
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
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-sm text-foreground truncate">
                  {t.anonymous ? "Anonymous" : t.author}
                </p>
                {!t.is_member && <Badge variant="outline" className="text-[10px] h-4 px-1">Guest</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{t.branch}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${statusConfig[t.status].color}`}>
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
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </DropdownMenuItem>
                {t.status !== "featured" && (
                  <DropdownMenuItem onClick={() => updateStatus(t.id, "featured")} className="text-[var(--church-gold)]">
                    <Star className="w-4 h-4 mr-2" /> Feature on Website
                  </DropdownMenuItem>
                )}
                {t.status !== "approved" && t.status !== "featured" && (
                  <DropdownMenuItem onClick={() => updateStatus(t.id, "approved")} className="text-emerald-600">
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </DropdownMenuItem>
                )}
                {t.status !== "hidden" && (
                  <DropdownMenuItem onClick={() => updateStatus(t.id, "hidden")}>
                    <EyeOff className="w-4 h-4 mr-2" /> Hide from Public
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
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wider">
            {t.category}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
        </div>

        <h3 className="font-semibold text-foreground mb-1 text-sm line-clamp-1">{t.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {t.content}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-[var(--church-gold)]">
            <Sparkles className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-bold">{t.likes} likes</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2" onClick={() => setViewItem(t)}>
            Review Testimony
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Testimony Management</h1>
          <p className="text-muted-foreground mt-1">Review and approve stories of God's faithfulness from our community.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Sparkles className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search testimonies..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-background">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
              <TabsTrigger value="all">All ({testimonies.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({testimonies.filter(t => t.status === "pending").length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({testimonies.filter(t => t.status === "approved").length})</TabsTrigger>
              <TabsTrigger value="featured">Featured ({testimonies.filter(t => t.status === "featured").length})</TabsTrigger>
              <TabsTrigger value="hidden">Hidden ({testimonies.filter(t => t.status === "hidden").length})</TabsTrigger>
            </TabsList>

            {(["all", "pending", "approved", "featured", "hidden"] as const).map(tab => (
              <TabsContent key={tab} value={tab}>
                {filtered(tab).length === 0 ? (
                  <Card><CardContent className="p-12 text-center text-muted-foreground">No testimonies found.</CardContent></Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered(tab).map(t => <TestimonyCard key={t.id} t={t} />)}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* View Dialog */}
        <Dialog open={!!viewItem} onOpenChange={open => !open && setViewItem(null)}>
          <DialogContent className="max-w-lg">
            {viewItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewItem.title}</DialogTitle>
                  <DialogDescription>
                    {viewItem.anonymous ? "Anonymous" : viewItem.author} 
                    {viewItem.email && ` (${viewItem.email})`}
                    — {viewItem.branch}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wider">
                      {viewItem.category}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${statusConfig[viewItem.status].color}`}>
                      {statusConfig[viewItem.status].label}
                    </Badge>
                    {!viewItem.is_member && <Badge variant="outline" className="text-[10px] h-4 px-1">Guest</Badge>}
                  </div>

                  <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-4 italic">
                    "{viewItem.content}"
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant={viewItem.status === "featured" ? "default" : "outline"}
                      className={viewItem.status === "featured" ? "bg-[var(--church-gold)] text-white hover:bg-[var(--church-gold)]/90" : ""}
                      onClick={() => updateStatus(viewItem.id, "featured")}
                    >
                      <Star className="w-4 h-4 mr-2" /> Feature
                    </Button>
                    <Button
                      size="sm"
                      variant={viewItem.status === "approved" ? "default" : "outline"}
                      className={viewItem.status === "approved" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
                      onClick={() => updateStatus(viewItem.id, "approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant={viewItem.status === "hidden" ? "default" : "outline"}
                      onClick={() => updateStatus(viewItem.id, "hidden")}
                    >
                      <EyeOff className="w-4 h-4 mr-2" /> Hide
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(viewItem.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
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
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
