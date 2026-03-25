'use client'

import { useEffect, useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Pastor {
  id: number
  name: string
  role: string
  status: string
  branch_id: number | null
  branches: { name: string; location: string } | null
}

interface ServiceSchedule {
  id: number
  day: string
  time: string
  type: string
  description: string
}

interface Branch {
  id: number
  name: string
  location: string
  established: string
  maps_url: string | null
  pastors: { id: number; name: string; role: string }[]
  service_schedules: ServiceSchedule[]
}

const typeColor: Record<string, string> = {
  "Sunday Worship":   "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  "Bible Study":      "bg-emerald-500/10 text-emerald-600",
  "Prayer Meeting":   "bg-rose-500/10 text-rose-600",
  "Youth Fellowship": "bg-orange-500/10 text-orange-600",
  "Cell Group":       "bg-[var(--church-gold)]/15 text-amber-700",
  "Fasting Prayer":   "bg-purple-500/10 text-purple-600",
  "Missions Meeting": "bg-blue-500/10 text-blue-600",
}

const dayOrder = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

export default function PastoralTeamPage() {
  const supabase = createClient()
  const [pastors, setPastors] = useState<Pastor[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [{ data: pastorData }, { data: branchData }] = await Promise.all([
        supabase
          .from("pastors")
          .select("id, name, role, status, branch_id, branches(name, location)")
          .eq("status", "active")
          .order("id"),
        supabase
          .from("branches")
          .select("id, name, location, established, maps_url, pastors(id, name, role), service_schedules(id, day, time, type, description)")
          .eq("status", "active")
          .order("id"),
      ])
      if (pastorData) setPastors(pastorData as Pastor[])
      if (branchData) setBranches(branchData as Branch[])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="pt-24 pb-16 lg:pt-32 lg:pb-20 relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1662644287860-ba9f2ee65ec9?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Pastoral Team</h1>
            <p className="text-xl text-white/90">
              Meet the dedicated pastors and pastoras who shepherd our church family with love and faith.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-12 text-center">
              Leadership Team
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="text-center animate-pulse">
                    <div className="aspect-square mb-4 rounded-lg bg-muted" />
                    <div className="h-3 bg-muted rounded w-3/4 mx-auto mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {pastors.map((pastor) => (
                  <div key={pastor.id} className="text-center">
                    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden border-2 border-[var(--church-primary)] shadow-lg hover:shadow-xl transition-shadow bg-[var(--church-light-blue)] flex items-center justify-center">
                      <User className="w-12 h-12 text-[var(--church-primary)]/40" />
                    </div>
                    <h3 className="font-bold text-sm lg:text-base text-foreground leading-tight">{pastor.name}</h3>
                    <p className="text-xs text-muted-foreground">{pastor.role}</p>
                    {pastor.branches && (
                      <p className="text-xs text-[var(--church-primary)] mt-1 leading-tight">{pastor.branches.name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Church Locations & Assignments */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-12 text-center">
              Church Locations & Pastoral Assignments
            </h2>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-background shadow-lg p-6 animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {branches.map((branch) => {
                  const schedules = [...branch.service_schedules].sort(
                    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
                  )
                  return (
                    <Card key={branch.id} className="bg-background border-none shadow-lg">
                      <CardContent className="p-6 space-y-4">
                        {/* Branch name + location */}
                        <div>
                          <h3 className="font-bold text-base text-[var(--church-primary)] leading-tight">
                            ▸ {branch.name}
                          </h3>
                          <div className="flex items-start gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-muted-foreground">{branch.location}</p>
                          </div>
                          {branch.maps_url && (
                            <a
                              href={branch.maps_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[var(--church-primary)] hover:underline mt-0.5"
                            >
                              <ExternalLink className="w-3 h-3" /> View on Google Maps
                            </a>
                          )}
                        </div>

                        {/* Pastors */}
                        {branch.pastors.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Pastors</p>
                            <div className="space-y-1">
                              {branch.pastors.map((p) => (
                                <p key={p.id} className="text-sm flex items-center gap-2">
                                  <span className="text-[var(--church-primary)]">•</span>
                                  <span className="italic">{p.name}</span>
                                  <span className="text-xs text-muted-foreground">({p.role})</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Service Schedules */}
                        {schedules.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Service Schedule</p>
                            <div className="space-y-1.5">
                              {schedules.map((s) => (
                                <div key={s.id} className="flex items-center gap-2 flex-wrap">
                                  <Badge className={`text-xs px-2 py-0.5 font-medium border-0 ${typeColor[s.type] ?? "bg-muted text-muted-foreground"}`}>
                                    {s.type}
                                  </Badge>
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {s.day} · {s.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
