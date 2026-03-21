"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Calendar, MapPin, Users, BookOpen, Clock, CheckCircle,
  Video, ChevronRight, GraduationCap, Globe, Mic, Award
} from "lucide-react"

const trainingData = {
  title: "Church Planting & Missions Training",
  subtitle: "Equipping Faithful Servants for Local and Global Church Planting",
  dates: "July 14–21, 2025",
  location: "ABCMI Main Church, East Quirino Hill, Baguio City (with Online Option)",
  registrationDeadline: "June 30, 2025",
  slots: 40,
  slotsLeft: 17,
  overview: `This intensive one-week Missions Training is designed to teach, train, and equip men and women who feel called to plant churches, lead house groups, or serve in cross-cultural missions. Rooted in the ABCMI vision — to build God's wall of salvation to the nations — this training equips participants with both biblical foundations and practical ministry tools.`,
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
  highlights: [
    { label: "Trained", value: "200+", icon: GraduationCap },
    { label: "Churches Planted", value: "13", icon: Globe },
    { label: "Years Running", value: "15+", icon: Award },
    { label: "Facilitators", value: "8", icon: Mic },
  ],
  pastHighlights: [
    "2023 Training — 38 participants from 5 provinces completed the program",
    "2022 Training — 3 new church plants initiated within 6 months post-training",
    "2021 Training — First fully online cohort of 42 participants across the Philippines",
    "2019 Training — Participants from Laos joined for cross-cultural missions emphasis",
  ],
}

export default function MissionsTrainingPage() {
  const [submitted, setSubmitted] = useState(false)
  const [availability, setAvailability] = useState(false)
  const [mode, setMode] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-0 lg:pt-32 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="container mx-auto px-4 pb-16 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="bg-[var(--church-gold)] text-[var(--church-primary-deep)] border-none mb-5 text-sm px-4 py-1 font-semibold">
              Registration Open — Limited Slots
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance leading-tight">
              {trainingData.title}
            </h1>
            <p className="text-xl text-white/90 mb-8 text-pretty max-w-2xl mx-auto">
              {trainingData.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/85 text-sm mb-10">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{trainingData.dates}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />Baguio City + Online</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4" />{trainingData.slotsLeft} slots remaining</span>
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

        {/* Stats bar */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="container mx-auto px-4 py-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {trainingData.highlights.map((h, i) => (
                <div key={i} className="text-center text-white">
                  <h.icon className="w-6 h-6 mx-auto mb-1 opacity-80" />
                  <p className="text-2xl font-bold">{h.value}</p>
                  <p className="text-white/70 text-xs">{h.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview + Details */}
      <section id="overview" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">

            {/* Left: Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[var(--church-primary)]" /> Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{trainingData.overview}</p>
              </div>

              <Separator />

              {/* Curriculum */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-[var(--church-primary)]" /> Curriculum Breakdown
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {trainingData.curriculum.map((item, i) => (
                    <Card key={i} className="border border-border hover:border-[var(--church-primary)] transition-colors">
                      <CardContent className="p-5">
                        <Badge className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] border-none mb-2 text-xs">
                          {item.module}
                        </Badge>
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Schedule */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-[var(--church-primary)]" /> Daily Schedule
                </h2>
                <div className="space-y-3">
                  {trainingData.schedule.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 bg-[var(--church-soft-gray)] rounded-lg px-5 py-4">
                      <span className="text-[var(--church-primary)] font-bold text-sm w-28 flex-shrink-0 pt-0.5">{s.day}</span>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.activities}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-[var(--church-primary)]" /> Requirements
                </h2>
                <ul className="space-y-3">
                  {trainingData.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Sticky sidebar */}
            <div>
              <Card className="border-[var(--church-primary)] border-2 shadow-lg sticky top-24">
                <CardHeader className="bg-[var(--church-primary)] text-white rounded-t-lg pb-4">
                  <CardTitle className="text-lg">Training Details</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Dates</p>
                      <p className="text-muted-foreground">{trainingData.dates}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p className="text-muted-foreground">{trainingData.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Users className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Available Slots</p>
                      <p className="text-muted-foreground">
                        {trainingData.slotsLeft} of {trainingData.slots} remaining
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Registration Deadline</p>
                      <p className="text-muted-foreground">{trainingData.registrationDeadline}</p>
                    </div>
                  </div>
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

      {/* Media Section */}
      <section className="py-16 bg-[var(--church-soft-gray)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                <Video className="w-7 h-7 text-[var(--church-primary)]" /> Past Training Highlights
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Promo video placeholder */}
              <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--church-primary)]/80 to-[var(--church-primary-deep)]/80 flex flex-col items-center justify-center text-white">
                  <Video className="w-14 h-14 mb-3 opacity-80" />
                  <p className="font-semibold">2023 Missions Training</p>
                  <p className="text-white/70 text-sm">Promotional Video</p>
                </div>
              </div>

              {/* Past highlights */}
              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-lg">Previous Cohorts</h3>
                {trainingData.pastHighlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 bg-background rounded-lg px-5 py-4 shadow-sm">
                    <Award className="w-5 h-5 text-[var(--church-gold)] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="registration" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">Sign Up Today</span>
              <h2 className="text-3xl font-bold text-foreground mt-2">Registration Form</h2>
              <p className="text-muted-foreground mt-3 text-pretty">
                Fill out the form below to reserve your slot. Our team will reach out within 2 business days.
              </p>
            </div>

            {submitted ? (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="p-10 text-center">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Registration Submitted!</h3>
                  <p className="text-muted-foreground text-pretty">
                    Thank you for registering. Our Missions Training coordinator will contact you within 2 business days with confirmation and pre-training materials.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="Juan" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="dela Cruz" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="you@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="+63 9XX XXX XXXX" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="church">Home Church / Branch *</Label>
                      <Input id="church" placeholder="e.g. ABCMI Main Church, Baguio City" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Ministry Experience Level *</Label>
                      <Select required>
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No prior ministry experience</SelectItem>
                          <SelectItem value="beginner">1–2 years (cell group, Sunday school)</SelectItem>
                          <SelectItem value="intermediate">3–5 years (ministry leadership)</SelectItem>
                          <SelectItem value="experienced">5+ years (pastoral / missions work)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mode">Participation Mode *</Label>
                      <Select required onValueChange={setMode}>
                        <SelectTrigger id="mode">
                          <SelectValue placeholder="Select how you will attend" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person — Baguio City</SelectItem>
                          <SelectItem value="online">Online — via Zoom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motivation">Why do you want to join this training?</Label>
                      <Textarea id="motivation" placeholder="Share your heart and calling..." rows={4} />
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="availability"
                        checked={availability}
                        onCheckedChange={(v) => setAvailability(!!v)}
                      />
                      <Label htmlFor="availability" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        I confirm I am available for the full duration of the training ({trainingData.dates}) and commit to attending all sessions.
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white font-semibold"
                      disabled={!availability || !mode}
                    >
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
