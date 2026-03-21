"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Radio,
  Calendar,
  Clock,
  Bell,
  Share2,
  ExternalLink,
  ChevronRight,
  Play,
  Users
} from "lucide-react"

// Sample data — admin controls this via /admin/live
const liveConfig = {
  isLive: true,
  title: "Sunday Morning Worship Service",
  description: "Join us live as we worship together and receive the Word of God. Everyone is welcome!",
  facebookUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FABCMIofficial%2Fvideos%2F",
  facebookPageUrl: "https://www.facebook.com/ABCMIofficial",
  viewerCount: 312,
  startedAt: "10:00 AM",
  branch: "ABCMI Main Church, East Quirino Hill, Baguio City",
}

const upcomingServices = [
  {
    id: 1,
    title: "Wednesday Prayer & Bible Study",
    date: "Mar 25, 2026",
    time: "7:00 PM",
    speaker: "Ptr. Ysrael Coyoy",
    type: "Prayer",
  },
  {
    id: 2,
    title: "Sunday Morning Worship",
    date: "Mar 29, 2026",
    time: "10:00 AM",
    speaker: "Ptr. Fhey Coyoy",
    type: "Worship",
  },
  {
    id: 3,
    title: "Good Friday Service",
    date: "Apr 3, 2026",
    time: "6:00 PM",
    speaker: "Ptr. Ysrael Coyoy",
    type: "Special",
  },
  {
    id: 4,
    title: "Easter Sunday Celebration",
    date: "Apr 5, 2026",
    time: "9:00 AM",
    speaker: "Pastoral Team",
    type: "Special",
  },
]

const pastStreams = [
  {
    id: 1,
    title: "Sunday Worship — Mar 16, 2026",
    date: "Mar 16, 2026",
    duration: "1h 45m",
    views: 489,
    thumbnail: "/placeholder.svg",
    url: "https://www.facebook.com/ABCMIofficial",
  },
  {
    id: 2,
    title: "Wednesday Bible Study — Mar 11, 2026",
    date: "Mar 11, 2026",
    duration: "1h 10m",
    views: 213,
    thumbnail: "/placeholder.svg",
    url: "https://www.facebook.com/ABCMIofficial",
  },
  {
    id: 3,
    title: "Sunday Worship — Mar 9, 2026",
    date: "Mar 9, 2026",
    duration: "1h 52m",
    views: 541,
    thumbnail: "/placeholder.svg",
    url: "https://www.facebook.com/ABCMIofficial",
  },
]

const typeColors: Record<string, string> = {
  Worship: "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Prayer: "bg-blue-500/10 text-blue-600",
  Special: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Study: "bg-emerald-500/10 text-emerald-600",
}

export default function LivePage() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-4">
              {liveConfig.isLive ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-sm font-semibold tracking-wide">LIVE NOW</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-wide">NEXT SERVICE</span>
                </>
              )}
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-3 text-balance">
              {liveConfig.isLive ? liveConfig.title : "Watch Us Live"}
            </h1>
            <p className="text-white/80 text-base lg:text-lg max-w-2xl mx-auto">
              {liveConfig.isLive
                ? liveConfig.description
                : "Join our services online via Facebook Live. Subscribe to be notified when we go live."}
            </p>
            {liveConfig.isLive && (
              <div className="flex items-center justify-center gap-4 mt-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Started at {liveConfig.startedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {liveConfig.viewerCount.toLocaleString()} watching
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">

              {/* Video Player */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="overflow-hidden">
                  {liveConfig.isLive ? (
                    <div className="relative w-full bg-black" style={{ paddingTop: "56.25%" }}>
                      <iframe
                        src={liveConfig.facebookUrl}
                        className="absolute inset-0 w-full h-full"
                        style={{ border: "none" }}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        title="Facebook Live Stream"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full bg-slate-900 flex flex-col items-center justify-center text-white" style={{ paddingTop: "56.25%" }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                          <Play className="w-10 h-10 text-white ml-1" />
                        </div>
                        <p className="text-white/70 text-sm">No live stream at the moment</p>
                        <a
                          href={liveConfig.facebookPageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" className="text-white border-white/40 hover:bg-white/10 gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Visit our Facebook Page
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        {liveConfig.isLive && (
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-red-500 text-white text-xs border-0">LIVE</Badge>
                            <span className="text-xs text-muted-foreground">{liveConfig.branch}</span>
                          </div>
                        )}
                        <h2 className="font-bold text-foreground text-lg leading-tight">
                          {liveConfig.title}
                        </h2>
                        {liveConfig.isLive && (
                          <p className="text-muted-foreground text-sm mt-1">{liveConfig.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShare}>
                          <Share2 className="w-4 h-4" />
                          {copied ? "Copied!" : "Share"}
                        </Button>
                        <a href={liveConfig.facebookPageUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <ExternalLink className="w-4 h-4" />
                            Facebook
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Past Streams */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recent Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pastStreams.map(stream => (
                      <a
                        key={stream.id}
                        href={stream.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="w-24 h-14 rounded-md bg-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <Play className="w-6 h-6 text-slate-400 group-hover:text-[var(--church-primary)] transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-[var(--church-primary)] transition-colors">
                            {stream.title}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span>{stream.date}</span>
                            <span>{stream.duration}</span>
                            <span>{stream.views} views</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Notify Me */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[var(--church-primary)]" />
                      Get Notified
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subscribed ? (
                      <div className="text-center py-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                          <Bell className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium text-foreground">You're subscribed!</p>
                        <p className="text-xs text-muted-foreground mt-1">We'll notify you when we go live.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubscribe} className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Enter your email to be notified when we go live or a new service is posted.
                        </p>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                        <Button
                          type="submit"
                          className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                        >
                          Notify Me
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Services */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--church-primary)]" />
                      Upcoming Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingServices.map((service, i) => (
                      <div key={service.id}>
                        {i > 0 && <Separator className="my-3" />}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-foreground leading-tight">{service.title}</p>
                            <Badge variant="secondary" className={`text-xs flex-shrink-0 ${typeColors[service.type]}`}>
                              {service.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {service.date}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {service.time}
                          </div>
                          <p className="text-xs text-[var(--church-primary)] font-medium">{service.speaker}</p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <a href="/events" className="flex items-center gap-1 text-xs text-[var(--church-primary)] hover:underline font-medium">
                      View all events
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>

                {/* Facebook Page Link */}
                <Card className="bg-[var(--church-primary)] border-0">
                  <CardContent className="p-5 text-center">
                    <p className="text-white font-semibold text-sm mb-1">Follow us on Facebook</p>
                    <p className="text-white/70 text-xs mb-3">Stay updated with our latest services and announcements</p>
                    <a href={liveConfig.facebookPageUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" className="w-full gap-2" size="sm">
                        <ExternalLink className="w-4 h-4" />
                        ABCMI Official
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
