"use client"

import { useState, useEffect } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Image as ImageIcon, Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns"

interface ChurchEvent {
  id: number
  title: string
  date: string
  time: string
  location: string
  category: string
  description?: string | null
  image_url?: string | null
  status: string
  is_published: boolean
  is_featured_past: boolean
  highlights: string[]
}

const categoryColors: Record<string, string> = {
  Outreach: "bg-purple-500/10 text-purple-700",
  Anniversary: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Fellowship: "bg-emerald-500/10 text-emerald-700",
  Children: "bg-orange-500/10 text-orange-700",
  Youth: "bg-emerald-500/10 text-emerald-700",
  Missions: "bg-blue-500/10 text-blue-700",
  "Special Service": "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Men: "bg-indigo-500/10 text-indigo-700",
  Worship: "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  General: "bg-muted text-muted-foreground",
}

export default function PastActivitiesPage() {
  const [activities, setActivities] = useState<ChurchEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const past = data.filter((e: ChurchEvent) => 
            e.status === "completed" && 
            e.is_published && 
            e.is_featured_past
          ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setActivities(past)
        }
      })
      .catch(() => setActivities([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-slate-700 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">God&apos;s Faithfulness in Action</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto text-pretty">
              A record of what God has done through ABCMI — in our churches, communities, and mission fields.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--church-primary)]" />
              </div>
            ) : activities.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No featured past activities to show yet.</p>
                </CardContent>
              </Card>
            ) : (
              activities.map((activity) => (
                <Card key={activity.id} className="w-full bg-background border-none shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image container */}
                      <div className="lg:w-80 h-64 lg:h-auto bg-[var(--church-soft-gray)] flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {activity.image_url ? (
                          <img 
                            src={activity.image_url} 
                            alt={activity.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                            <p className="text-xs text-muted-foreground/50 mt-2">Photo Gallery</p>
                          </>
                        )}
                        <Badge className={`absolute top-3 left-3 ${categoryColors[activity.category] || categoryColors.General}`}>
                          {activity.category}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 lg:p-8">
                        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[var(--church-primary)]" />
                            {format(parseISO(activity.date), "MMMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[var(--church-primary)]" />
                            {activity.location}
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-3 text-balance">{activity.title}</h2>
                        {activity.description && (
                          <p className="text-muted-foreground leading-relaxed mb-5 text-pretty">{activity.description}</p>
                        )}

                        {/* Highlights */}
                        {activity.highlights && activity.highlights.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Highlights</p>
                            <div className="flex flex-wrap gap-2">
                              {activity.highlights.map((h, j) => (
                                <span key={j} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--church-primary)]/8 text-[var(--church-primary)] rounded-full text-sm font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--church-primary)] flex-shrink-0" />
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
