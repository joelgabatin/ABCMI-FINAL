"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Link2, Plus, Edit, Trash2, Search, Copy, Check,
  ExternalLink, Loader2, Globe, Tag, Eye, EyeOff,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { toast } from "sonner"

// ── Types ──────────────────────────────────────────────────────────────────

interface WebsitePage {
  id: number
  page_name: string
  path: string
  category: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

type PageForm = Omit<WebsitePage, "id" | "created_at" | "updated_at">

const CATEGORIES = ["Public", "Events", "Resources", "Auth", "Member", "Other"]

const CATEGORY_COLORS: Record<string, string> = {
  Public:    "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Events:    "bg-emerald-500/10 text-emerald-600",
  Resources: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Auth:      "bg-slate-500/10 text-slate-600",
  Member:    "bg-purple-500/10 text-purple-600",
  Other:     "bg-muted text-muted-foreground",
}

function blankForm(): PageForm {
  return { page_name: "", path: "/", category: "Public", description: "", is_active: true }
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function WebsitePagesPage() {
  const [pages, setPages]           = useState<WebsitePage[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [filterCat, setFilterCat]   = useState("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [form, setForm]             = useState<PageForm>(blankForm())
  const [saving, setSaving]         = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WebsitePage | null>(null)
  const [copiedId, setCopiedId]     = useState<number | null>(null)

  // base URL — uses window.location.origin so it works in both dev and prod
  const [baseUrl, setBaseUrl] = useState("")
  useEffect(() => { setBaseUrl(window.location.origin) }, [])

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchPages = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/pages")
      const data = await res.json()
      if (Array.isArray(data)) setPages(data)
    } catch {
      toast.error("Failed to load pages.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPages() }, [])

  // ── Derived ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => pages.filter(p => {
    const matchSearch = p.page_name.toLowerCase().includes(search.toLowerCase()) ||
      p.path.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === "All" || p.category === filterCat
    return matchSearch && matchCat
  }), [pages, search, filterCat])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, WebsitePage[]>>((acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    }, {})
  }, [filtered])

  const stats = {
    total:  pages.length,
    active: pages.filter(p => p.is_active).length,
    cats:   [...new Set(pages.map(p => p.category))].length,
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null)
    setForm(blankForm())
    setDialogOpen(true)
  }

  const openEdit = (p: WebsitePage) => {
    setEditingId(p.id)
    setForm({
      page_name: p.page_name,
      path: p.path,
      category: p.category,
      description: p.description ?? "",
      is_active: p.is_active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.page_name.trim()) return toast.error("Page name is required.")
    if (!form.path.trim() || !form.path.startsWith("/")) return toast.error("Path must start with /")

    setSaving(true)
    try {
      const res = editingId !== null
        ? await fetch(`/api/pages/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          })
        : await fetch("/api/pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed")
      }
      const saved = await res.json()
      if (editingId !== null) {
        setPages(prev => prev.map(p => p.id === editingId ? saved : p))
        toast.success("Page updated.")
      } else {
        setPages(prev => [...prev, saved])
        toast.success("Page added.")
      }
      setDialogOpen(false)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/pages/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setPages(prev => prev.filter(p => p.id !== deleteTarget.id))
      toast.success("Page removed.")
    } catch {
      toast.error("Failed to delete.")
    } finally {
      setDeleteTarget(null)
    }
  }

  const toggleActive = async (p: WebsitePage) => {
    try {
      const res = await fetch(`/api/pages/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !p.is_active }),
      })
      if (!res.ok) throw new Error()
      setPages(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
    } catch {
      toast.error("Failed to update.")
    }
  }

  const copyUrl = (p: WebsitePage) => {
    const fullUrl = `${baseUrl}${p.path}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(p.id)
    toast.success("URL copied to clipboard.")
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Link2 className="w-8 h-8 text-[var(--church-primary)]" />
              Website Pages
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all public-facing page URLs for use in the chatbot and other integrations.
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
          >
            <Plus className="w-4 h-4" /> Add Page
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Pages",    value: stats.total,  icon: Globe,  color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10" },
            { label: "Active Pages",   value: stats.active, icon: Eye,    color: "text-emerald-600",              bg: "bg-emerald-500/10" },
            { label: "Categories",     value: stats.cats,   icon: Tag,    color: "text-[var(--church-gold)]",     bg: "bg-[var(--church-gold)]/10" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
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

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCat} onValueChange={setFilterCat}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Pages list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Link2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No pages found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).sort().map(([category, items]) => (
              <div key={category}>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other}`}>
                    {category}
                  </span>
                  <span className="text-muted-foreground/60">{items.length} page{items.length !== 1 ? "s" : ""}</span>
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {items.map((p, i) => (
                        <div
                          key={p.id}
                          className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 ${!p.is_active ? "opacity-50" : ""}`}
                        >
                          {/* Page info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-foreground text-sm">{p.page_name}</p>
                              {!p.is_active && (
                                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">Hidden</Badge>
                              )}
                            </div>
                            {p.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
                            )}
                            {/* Full URL */}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-[var(--church-primary)] select-all">
                                {baseUrl}{p.path}
                              </code>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Active toggle */}
                            <Switch
                              checked={p.is_active}
                              onCheckedChange={() => toggleActive(p)}
                            />
                            {/* Copy URL */}
                            <Button
                              variant="ghost" size="sm"
                              className="gap-1.5 text-xs"
                              onClick={() => copyUrl(p)}
                            >
                              {copiedId === p.id
                                ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                                : <Copy className="w-3.5 h-3.5" />}
                            </Button>
                            {/* Open in new tab */}
                            <Button
                              variant="ghost" size="sm"
                              className="gap-1.5 text-xs"
                              onClick={() => window.open(p.path, "_blank")}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                            {/* Edit */}
                            <Button
                              variant="outline" size="sm"
                              className="gap-1.5 text-xs"
                              onClick={() => openEdit(p)}
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </Button>
                            {/* Delete */}
                            <Button
                              variant="ghost" size="sm"
                              className="text-destructive hover:text-destructive px-2"
                              onClick={() => setDeleteTarget(p)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* ── Add / Edit Dialog ── */}
        <Dialog open={dialogOpen} onOpenChange={open => { if (!open) setDialogOpen(false) }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId !== null ? "Edit Page" : "Add Page"}</DialogTitle>
              <DialogDescription>
                {editingId !== null ? "Update the page details." : "Add a new website page URL."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Page Name *</Label>
                <Input
                  value={form.page_name}
                  onChange={e => setForm(p => ({ ...p, page_name: e.target.value }))}
                  placeholder="e.g. About Us"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Path *</Label>
                <Input
                  value={form.path}
                  onChange={e => setForm(p => ({ ...p, path: e.target.value }))}
                  placeholder="e.g. /about"
                  className="font-mono"
                />
                {form.path && (
                  <p className="text-xs text-muted-foreground">
                    Full URL: <span className="text-[var(--church-primary)] font-mono">{baseUrl}{form.path}</span>
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description ?? ""}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of this page..."
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Active (visible to chatbot)</Label>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                >
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : editingId !== null ? "Update" : "Add Page"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Delete Confirm ── */}
        <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Page?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove <strong>{deleteTarget?.page_name}</strong> from the list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-white">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
    </DashboardLayout>
  )
}
