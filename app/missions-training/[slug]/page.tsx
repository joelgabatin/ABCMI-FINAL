"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Calendar, MapPin, Users, BookOpen, Clock, CheckCircle,
  ChevronRight, GraduationCap, Award, ArrowLeft
} from "lucide-react"

const trainingDB: Record<string, {
  title: string; subtitle: string; startDate: string; endDate: string
  registrationDeadline: string; location: string; slots: number; slotsLeft: number
  overview: string; badge: string; badgeColor: string
  curriculum: { module: string; title: string; description: string }[]
  schedule: { day: string; activities: string }[]
  requirements: string[]
}> = {
  "church-planting-missions-2025": {
    title: "Church Planting & Missions Training",
    subtitle: "Equipping Faithful Servants for Local and Global Church Planting",
    startDate: "July 14, 2025", endDate: "July 21, 2025",
    registrationDeadline: "June 30, 2025",
    location: "ABCMI Main Church, East Quirino Hill, Baguio City (with Online Option)",
    slots: 40, slotsLeft: 17,
    badge: "Registration Open", badgeColor: "bg-green-100 text-green-700",
    overview: "This intensive one-week Missions Training is designed to teach, train, and equip men and women who feel called to plant churches, lead house groups, or serve in cross-cultural missions. Rooted in the ABCMI vision — to build God's wall of salvation to the nations — this training equips participants with both biblical foundations and practical ministry tools.",
    curriculum: [
      { module: "Module 1", title: "Biblical Basis of Missions", description: "Understanding God's heart for the nations through Scripture." },
      { module: "Module 2", title: "Church Planting Principles", description: "Methods, models, and challenges of establishing local and house churches." },
      { module: "Module 3", title: "Evangelism & Discipleship", description: "How to lead people to Christ and disciple them toward maturity." },
      { module: "Module 4", title: "Cross-Cultural Ministry", description: "Navigating culture, language, and contextualization in missions." },
      { module: "Module 5", title: "Leadership in Ministry", description: "Servant leadership, team dynamics, and pastoral care basics." },
      { module: "Module 6", title: "Practical Field Work", description: "Supervised outreach and community ministry in Baguio City." },
    ],
    schedule: [
      { day: "Day 1 — Mon", activities: "Orientation, Opening Worship, Module 1: Biblical Basis of Missions" },
      { day: "Day 2 — Tue", activities: "Module 2: Church Planting Principles, Workshop & Case Studies" },
      { day: "Day 3 — Wed", activities: "Module 3: Evangelism & Discipleship, Role Play & Practicum" },
      { day: "Day 4 — Thu", activities: "Module 4: Cross-Cultural Ministry, Panel Discussion" },
      { day: "Day 5 — Fri", activities: "Module 5: Leadership in Ministry, Group Projects" },
      { day: "Day 6 — Sat", activities: "Module 6: Field Work — Community Outreach & Evangelism" },
      { day: "Day 7 — Sun", activities: "Commissioning Service, Certificate Awarding, Closing Worship" },
    ],
    requirements: [
      "Must be a committed Christian with a minimum of 1 year church attendance",
      "Letter of recommendation from your local pastor or church leader",
      "Willingness to participate in all training sessions",
      "For in-person: Ability to attend all 7 days on-site in Baguio City",
      "For online: Stable internet connection and Zoom access",
      "Completion of pre-training reading materials (provided upon registration)",
    ],
  },
  "evangelism-discipleship-2025": {
    title: "Evangelism & Discipleship Intensive",
    subtitle: "Practical Training for Reaching Your Community",
    startDate: "September 8, 2025", endDate: "September 12, 2025",
    registrationDeadline: "August 25, 2025",
    location: "ABCMI Main Church, Baguio City",
    slots: 30, slotsLeft: 22,
    badge: "Coming Soon", badgeColor: "bg-blue-100 text-blue-700",
    overview: "A 5-day intensive focused on personal evangelism methods, one-on-one discipleship, and leading small group Bible studies. Perfect for cell group leaders and lay ministers who want to grow in their ability to reach and multiply disciples.",
    curriculum: [
      { module: "Module 1", title: "Understanding the Gospel", description: "Clearly presenting the message of salvation." },
      { module: "Module 2", title: "Sharing Your Faith", description: "Practical tools for personal evangelism in everyday contexts." },
      { module: "Module 3", title: "One-on-One Discipleship", description: "How to walk alongside a new believer toward spiritual maturity." },
      { module: "Module 4", title: "Leading Small Groups", description: "Facilitating effective Bible study groups in homes and communities." },
    ],
    schedule: [
      { day: "Day 1 — Mon", activities: "Orientation, Module 1: Understanding the Gospel" },
      { day: "Day 2 — Tue", activities: "Module 2: Sharing Your Faith, Outreach Practicum" },
      { day: "Day 3 — Wed", activities: "Module 3: One-on-One Discipleship, Role Play Sessions" },
      { day: "Day 4 — Thu", activities: "Module 4: Leading Small Groups, Group Workshop" },
      { day: "Day 5 — Fri", activities: "Field Evangelism, Closing Ceremony & Commissioning" },
    ],
    requirements: [
      "Active member of a local church or ministry",
      "Heart for evangelism and reaching the lost",
      "Willingness to participate in outreach activities",
    ],
  },
}

export default function TrainingDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const training = trainingDB[slug]
  const [submitted, setSubmitted] = useState(false)
  const [availability, setAvailability] = useState(false)

  if (!training) {
    return (
      <SiteLayout>
        <div className="pt-32 pb-24 text-center container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-4">Training Not Found</h1>
          <p className="text-muted-foreground mb-8">The training you are looking for does not exist or may have been removed.</p>
          <Link href="/missions-training">
            <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Trainings
            </Button>
          </Link>
        </div>
      </SiteLayout>
    )
  }

  const registered = training.slots - training.slotsLeft

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-0 lg:pt-32 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container mx-auto px-4 pb-16 relative">
          <Link href="/missions-training" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to All Trainings
          </Link>
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className={`${training.badgeColor} border-none mb-5 text-sm px-4 py-1 font-semibold`}>
              {training.badge}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance leading-tight">{training.title}</h1>
            <p className="text-xl text-white/90 mb-8 text-pretty max-w-2xl mx-auto">{training.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-6 text-white/85 text-sm mb-10">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{training.startDate} – {training.endDate}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{training.location}</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4" />{training.slotsLeft} slots remaining</span>
            </div>
            <Button
              size="lg"
              className="bg-[var(--church-gold)] hover:bg-yellow-500 text-[var(--church-primary-deep)] font-bold px-10 text-base"
              onClick={() => document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" })}
            >
              Register Now <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-xl mx-auto">
              <div className="flex justify-between text-white/80 text-xs mb-1.5">
                <span>{registered} registered</span>
                <span>{training.slotsLeft} slots left of {training.slots}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--church-gold)] rounded-full" style={{ width: `${(registered / training.slots) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[var(--church-primary)]" /> Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{training.overview}</p>
              </div>
              <Separator />

              {training.curriculum.length > 0 && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-[var(--church-primary)]" /> Curriculum Breakdown
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {training.curriculum.map((item, i) => (
                        <Card key={i} className="border border-border hover:border-[var(--church-primary)] transition-colors">
                          <CardContent className="p-5">
                            <Badge className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-none mb-2 text-xs">{item.module}</Badge>
                            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                            <p className="text-muted-foreground text-sm">{item.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {training.schedule.length > 0 && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-[var(--church-primary)]" /> Daily Schedule
                    </h2>
                    <div className="space-y-3">
                      {training.schedule.map((s, i) => (
                        <div key={i} className="flex items-start gap-4 bg-[var(--church-soft-gray)] rounded-lg px-5 py-4">
                          <span className="text-[var(--church-primary)] font-bold text-sm w-28 flex-shrink-0 pt-0.5">{s.day}</span>
                          <p className="text-muted-foreground text-sm leading-relaxed">{s.activities}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {training.requirements.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-[var(--church-primary)]" /> Requirements
                  </h2>
                  <ul className="space-y-3">
                    {training.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            <div>
              <Card className="border-[var(--church-primary)] border-2 shadow-lg sticky top-24">
                <CardHeader className="bg-[var(--church-primary)] text-white rounded-t-lg pb-4">
                  <CardTitle className="text-lg">Training Details</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {[
                    { icon: Calendar, label: "Dates", value: `${training.startDate} – ${training.endDate}` },
                    { icon: Clock, label: "Deadline", value: training.registrationDeadline },
                    { icon: MapPin, label: "Location", value: training.location },
                    { icon: Users, label: "Slots Left", value: `${training.slotsLeft} of ${training.slots}` },
                    { icon: Award, label: "Modules", value: `${training.curriculum.length} modules · ${training.schedule.length} days` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 text-sm">
                      <Icon className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">{label}</p>
                        <p className="text-muted-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <Button
                    className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white font-semibold"
                    onClick={() => document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="registration" className="py-16 lg:py-24 bg-[var(--church-soft-gray)]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">Sign Up Today</span>
              <h2 className="text-3xl font-bold text-foreground mt-2">Registration Form</h2>
              <p className="text-muted-foreground mt-3 text-pretty">
                Fill out the form below to reserve your slot for <strong>{training.title}</strong>.
              </p>
            </div>
            {submitted ? (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="p-10 text-center">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Registration Submitted!</h3>
                  <p className="text-muted-foreground text-pretty">
                    Thank you for registering. Our Missions Training coordinator will contact you within 2 business days.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border shadow-lg bg-background">
                <CardContent className="p-8">
                  <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>First Name *</Label><Input placeholder="Juan" required /></div>
                      <div className="space-y-2"><Label>Last Name *</Label><Input placeholder="dela Cruz" required /></div>
                    </div>
                    <div className="space-y-2"><Label>Email Address *</Label><Input type="email" placeholder="you@email.com" required /></div>
                    <div className="space-y-2"><Label>Phone Number *</Label><Input type="tel" placeholder="+63 9XX XXX XXXX" required /></div>
                    <div className="space-y-2"><Label>Home Church / Branch *</Label><Input placeholder="e.g. ABCMI Main Church, Baguio City" required /></div>
                    <div className="space-y-2">
                      <Label>Ministry Experience Level *</Label>
                      <Select required>
                        <SelectTrigger><SelectValue placeholder="Select your level" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No prior ministry experience</SelectItem>
                          <SelectItem value="beginner">1–2 years</SelectItem>
                          <SelectItem value="intermediate">3–5 years</SelectItem>
                          <SelectItem value="experienced">5+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Participation Mode *</Label>
                      <Select required>
                        <SelectTrigger><SelectValue placeholder="Select how you will attend" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person — Baguio City</SelectItem>
                          <SelectItem value="online">Online — via Zoom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Why do you want to join this training?</Label>
                      <Textarea placeholder="Share your heart and calling..." rows={4} />
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="avail" checked={availability} onCheckedChange={v => setAvailability(!!v)} />
                      <Label htmlFor="avail" className="cursor-pointer font-normal leading-snug">
                        I confirm that I am available for all training sessions from {training.startDate} to {training.endDate}.
                      </Label>
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white font-semibold" disabled={!availability}>
                      Submit Registration
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
