"use client"

import Link from "next/link"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar, MapPin, Users, ChevronRight,
  GraduationCap, Clock, BookOpen, Award
} from "lucide-react"

const trainings = [
  {
    id: 1,
    slug: "church-planting-missions-2025",
    title: "Church Planting & Missions Training",
    subtitle: "Equipping Faithful Servants for Local and Global Church Planting",
    startDate: "July 14, 2025",
    endDate: "July 21, 2025",
    registrationDeadline: "June 30, 2025",
    location: "ABCMI Main Church, Baguio City + Online",
    slots: 40,
    slotsLeft: 17,
    overview: "This intensive one-week Missions Training is designed to teach, train, and equip men and women called to plant churches, lead house groups, or serve in cross-cultural missions.",
    modules: 6,
    days: 7,
    badge: "Registration Open",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    slug: "evangelism-discipleship-2025",
    title: "Evangelism & Discipleship Intensive",
    subtitle: "Practical Training for Reaching Your Community",
    startDate: "September 8, 2025",
    endDate: "September 12, 2025",
    registrationDeadline: "August 25, 2025",
    location: "ABCMI Main Church, Baguio City",
    slots: 30,
    slotsLeft: 22,
    overview: "A 5-day intensive focused on personal evangelism methods, one-on-one discipleship, and leading small group Bible studies. Perfect for cell group leaders and lay ministers.",
    modules: 4,
    days: 5,
    badge: "Coming Soon",
    badgeColor: "bg-blue-100 text-blue-700",
  },
]

const stats = [
  { label: "Trained", value: "200+", icon: GraduationCap },
  { label: "Churches Planted", value: "13", icon: Award },
  { label: "Years Running", value: "15+", icon: Clock },
  { label: "Curriculum Modules", value: "30+", icon: BookOpen },
]

export default function MissionsTrainingPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="container mx-auto px-4 text-center text-white relative">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Missions Training</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
            To teach, train, and equip strong faithful servants to establish local and house churches — relationally joined together to the Holy Spirit in fulfilling the God-given vision.
          </p>
        </div>
      </section>

      {/* Training cards */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">Available Programs</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 text-balance">Current Training Offerings</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-pretty">
                Click on any training to view the full details, curriculum, schedule, and registration form.
              </p>
            </div>

            <div className="space-y-6">
              {trainings.map(t => (
                <Link key={t.id} href={`/missions-training/${t.slug}`} className="block group">
                  <Card className="border border-border shadow-md hover:border-[var(--church-primary)] hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Colored side accent */}
                        <div className="lg:w-2 w-full h-2 lg:h-auto rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none bg-[var(--church-primary)] flex-shrink-0" />

                        <div className="flex-1 p-7">
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap mb-2">
                                <Badge className={`${t.badgeColor} border-none text-xs font-semibold`}>{t.badge}</Badge>
                              </div>
                              <h3 className="text-xl font-bold text-foreground group-hover:text-[var(--church-primary)] transition-colors text-balance">
                                {t.title}
                              </h3>
                              <p className="text-muted-foreground text-sm mt-1">{t.subtitle}</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-[var(--church-primary)] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                          </div>

                          {/* Overview */}
                          <p className="text-muted-foreground text-sm leading-relaxed mb-5 text-pretty line-clamp-2">{t.overview}</p>

                          {/* Details grid */}
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
                              <span>{t.startDate} – {t.endDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
                              <span className="truncate">{t.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
                              <span>{t.slotsLeft} of {t.slots} slots left</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <GraduationCap className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0" />
                              <span>{t.modules} modules · {t.days} days</span>
                            </div>
                          </div>

                          {/* Progress bar for slots */}
                          <div className="mb-5">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Registration progress</span>
                              <span>{t.slots - t.slotsLeft} / {t.slots} registered</span>
                            </div>
                            <div className="h-1.5 bg-[var(--church-soft-gray)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--church-primary)] rounded-full transition-all"
                                style={{ width: `${((t.slots - t.slotsLeft) / t.slots) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white gap-1.5"
                            >
                              View Details & Register <ChevronRight className="w-4 h-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              Deadline: {t.registrationDeadline}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why join section */}
      <section className="py-16 bg-[var(--church-soft-gray)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 text-balance">Why Join ABCMI Missions Training?</h2>
            <p className="text-muted-foreground mb-10 text-pretty">
              Our training programs have equipped over 200 servants of God who have gone on to plant churches, lead ministries, and serve in cross-cultural missions across the Philippines and beyond.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {[
                { icon: BookOpen, title: "Biblical Foundation", desc: "Every curriculum is rooted in the Word of God and aligned with sound evangelical theology." },
                { icon: GraduationCap, title: "Practical Equipping", desc: "Hands-on fieldwork, role plays, and mentoring from experienced pastors and missionaries." },
                { icon: Award, title: "Lasting Community", desc: "Join a network of trained servants across 13 branches and beyond, supporting one another in ministry." },
              ].map((item, i) => (
                <Card key={i} className="border-none shadow-sm bg-background">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-[var(--church-primary)]" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
