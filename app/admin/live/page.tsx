"use client"

import { useState } from "react"
import {
  Radio, Play, Eye, Edit, Trash2, Plus, ExternalLink, Save,
  Clock, Calendar, Users, Signal
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

const initialLiveSettings = {
  isLive: true,
  title: "Sunday Morning Worship Service",
  description: "Join us live as we worship together and receive the Word of God. Everyone is welcome!",
  facebookUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FABCMIofficial%2Fvideos%2F",
  facebookPageUrl: "https://www.facebook.com/ABCMIofficial",
  viewerCount: 312,
  startedAt: "10:00",
}

const pastStreams = [
  { id: 1, title: "Sunday Worship — Mar 16, 2026", date: "Mar 16, 2026", duration: "1h 45m", views: 489, url: "https://www.facebook.com/ABCMIofficial" },
  { id: 2, title: "Wednesday Bible Study — Mar 11, 2026", date: "Mar 11, 2026", duration: "1h 10m", views: 213, url: "https://www.facebook.com/ABCMIofficial" },
  { id: 3, title: "Sunday Worship — Mar 9, 2026", date: "Mar 9, 2026", duration: "1h 52m", views: 541, url: "https://www.facebook.com/ABCMIofficial" },
  { id: 4, title: "Prayer Night — Mar 4, 2026", date: "Mar 4, 2026", duration: "2h 5m", views: 378, url: "https://www.facebook.com/ABCMIofficial" },
]

const scheduledServices = [
  { id: 1, title: "Wednesday Prayer & Bible Study", date: "2026-03-25", time: "19:00", speaker: "Ptr. Ysrael Coyoy", type: "Prayer" },
  { id: 2, title: "Sunday Morning Worship", date: "2026-03-29", time: "10:00", speaker: "Ptr. Fhey Coyoy", type: "Worship" },
  { id: 3, title: "Good Friday Service", date: "2026-04-03", time: "18:00", speaker: "Ptr. Ysrael Coyoy", type: "Special" },
]

export default function AdminLivePage() {
  const [settings, setSettings] = useState(initialLiveSettings)
  const [saved, setSaved] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [services, setServices] = useState(scheduledServices)
  const [streams, setStreams] = useState(pastStreams)
  const [editForm, setEditForm] = useState(settings)
  const [newService, setNewService] = useState({ title: "", date: "", time: "", speaker: "", type: "Worship" })
  const [deleteStreamId, setDeleteStreamId] = useState<number | null>(null)

  const handleSaveSettings = () => {
    setSettings(editForm)
    setSaved(true)
    setEditOpen(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleLive = () => {
    setSettings(s => ({ ...s, isLive: !s.isLive }))
  }

  const handleAddService = () => {
    if (!newService.title || !newService.date || !newService.time) return
    setServices(prev => [...prev, { ...newService, id: Date.now() }])
    setNewService({ title: "", date: "", time: "", speaker: "", type: "Worship" })
    setScheduleOpen(false)
  }

  const handleDeleteService = (id: number) => {
    setServices(prev => prev.filter(s => s.id !== id))
  }

  const handleDeleteStream = (id: number) => {
    setStreams(prev => prev.filter(s => s.id !== id))
    setDeleteStreamId(null)
  }

  return (
    <DashboardLayout variant="admin">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Facebook Live Management</h1>
            <p className="text-muted-foreground mt-1">Control the live stream displayed on the website</p>
          </div>
          <div className="flex gap-2">
            <a href="/live" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Preview Page
              </Button>
            </a>
            {saved && (
              <Badge className="bg-emerald-500 text-white border-0 px-3 py-1.5">Settings saved</Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${settings.isLive ? "bg-red-500/10" : "bg-muted"}`}>
                <Signal className={`w-5 h-5 ${settings.isLive ? "text-red-500" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{settings.isLive ? "LIVE" : "Offline"}</p>
                <p className="text-xs text-muted-foreground">Stream Status</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--church-primary)]" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{settings.viewerCount}</p>
                <p className="text-xs text-muted-foreground">Current Viewers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-[var(--church-gold)]/10 flex items-center justify-center">
                <Play className="w-5 h-5 text-[var(--church-gold)]" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{streams.length}</p>
                <p className="text-xs text-muted-foreground">Past Streams</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{services.length}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live Stream Settings */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Live Stream Settings</CardTitle>
                  <CardDescription>Control what appears on the website live page</CardDescription>
                </div>
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditForm(settings)}>
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Live Stream Settings</DialogTitle>
                      <DialogDescription>Update the live stream content shown on the website</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Service Title</Label>
                        <Input
                          value={editForm.title}
                          onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                          placeholder="e.g. Sunday Morning Worship"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={editForm.description}
                          onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                          rows={3}
                          placeholder="Brief description of the service..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Facebook Video Embed URL</Label>
                        <Input
                          value={editForm.facebookUrl}
                          onChange={e => setEditForm(f => ({ ...f, facebookUrl: e.target.value }))}
                          placeholder="https://www.facebook.com/plugins/video.php?href=..."
                        />
                        <p className="text-xs text-muted-foreground">
                          Get this from Facebook: Share video → Embed → Copy the src URL
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Facebook Page URL</Label>
                        <Input
                          value={editForm.facebookPageUrl}
                          onChange={e => setEditForm(f => ({ ...f, facebookPageUrl: e.target.value }))}
                          placeholder="https://www.facebook.com/ABCMIofficial"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={editForm.startedAt}
                            onChange={e => setEditForm(f => ({ ...f, startedAt: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Viewer Count (approx.)</Label>
                          <Input
                            type="number"
                            value={editForm.viewerCount}
                            onChange={e => setEditForm(f => ({ ...f, viewerCount: Number(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button
                          className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-2"
                          onClick={handleSaveSettings}
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Go Live Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-muted bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.isLive ? "bg-red-500" : "bg-muted"}`}>
                    <Radio className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {settings.isLive ? "Stream is LIVE" : "Stream is Offline"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {settings.isLive ? "Embed is visible on the website" : "Offline placeholder shown"}
                    </p>
                  </div>
                </div>
                <Switch checked={settings.isLive} onCheckedChange={toggleLive} />
              </div>

              <Separator />

              {/* Current settings display */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Title</p>
                  <p className="text-sm text-foreground font-medium">{settings.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{settings.description}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Facebook Embed URL</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted rounded p-2 break-all">{settings.facebookUrl}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Facebook Page</p>
                  <a href={settings.facebookPageUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--church-primary)] hover:underline flex items-center gap-1">
                    {settings.facebookPageUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Start Time</p>
                    <p className="text-sm text-foreground">{settings.startedAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Viewers</p>
                    <p className="text-sm text-foreground">{settings.viewerCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Services */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Upcoming Services</CardTitle>
                  <CardDescription>Shown in the sidebar of the live page</CardDescription>
                </div>
                <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Upcoming Service</DialogTitle>
                      <DialogDescription>This will appear in the live page sidebar</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={newService.title} onChange={e => setNewService(s => ({ ...s, title: e.target.value }))} placeholder="e.g. Sunday Morning Worship" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" value={newService.date} onChange={e => setNewService(s => ({ ...s, date: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input type="time" value={newService.time} onChange={e => setNewService(s => ({ ...s, time: e.target.value }))} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Speaker</Label>
                        <Input value={newService.speaker} onChange={e => setNewService(s => ({ ...s, speaker: e.target.value }))} placeholder="e.g. Ptr. Ysrael Coyoy" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setScheduleOpen(false)}>Cancel</Button>
                        <Button className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white" onClick={handleAddService}>Add Service</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {services.map(service => (
                <div key={service.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                  <div className="w-9 h-9 rounded-lg bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-[var(--church-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{service.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{service.date}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{service.time}</span>
                    </div>
                    {service.speaker && (
                      <p className="text-xs text-[var(--church-primary)] mt-0.5">{service.speaker}</p>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove service?</AlertDialogTitle>
                        <AlertDialogDescription>This will remove "{service.title}" from the upcoming list on the live page.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => handleDeleteService(service.id)}>Remove</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No upcoming services scheduled</p>
              )}
            </CardContent>
          </Card>

          {/* Past Streams */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Past Streams Archive</CardTitle>
              <CardDescription>Manage past recorded services shown on the live page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {streams.map(stream => (
                  <div key={stream.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{stream.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>{stream.date}</span>
                        <span>{stream.duration}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{stream.views} views</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a href={stream.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1 text-xs">
                          <ExternalLink className="w-3 h-3" />
                          View
                        </Button>
                      </a>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1 text-xs text-destructive hover:text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete stream record?</AlertDialogTitle>
                            <AlertDialogDescription>This removes "{stream.title}" from the archive shown on the website.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => handleDeleteStream(stream.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  )
}
