import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Globe, Calendar, Clock, Users, BookOpen, MapPin, ArrowRight, CheckCircle } from "lucide-react"

const trainingModules = [
  "Biblical Foundation for Missions",
  "Cross-Cultural Communication",
  "Church Planting Strategies",
  "Evangelism & Discipleship",
  "Spiritual Warfare & Prayer",
  "Practical Ministry Skills",
]

const trainingSchedule = [
  { date: "April 5, 2026", topic: "Introduction & Biblical Foundation", time: "9:00 AM - 12:00 PM" },
  { date: "April 12, 2026", topic: "Cross-Cultural Communication", time: "9:00 AM - 12:00 PM" },
  { date: "April 19, 2026", topic: "Church Planting Strategies", time: "9:00 AM - 12:00 PM" },
  { date: "April 26, 2026", topic: "Evangelism & Discipleship", time: "9:00 AM - 12:00 PM" },
  { date: "May 3, 2026", topic: "Spiritual Warfare & Prayer", time: "9:00 AM - 12:00 PM" },
  { date: "May 10, 2026", topic: "Practical Ministry & Commissioning", time: "9:00 AM - 3:00 PM" },
]

export default function MissionsTrainingPage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block px-4 py-2 bg-[var(--church-gold)] text-[var(--church-dark-text)] rounded-full text-sm font-bold mb-6">
              Now Accepting Applications
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Missions Training Program</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Equipping believers for cross-cultural ministry and church planting. 
              Answer the call to {'"'}Go and make disciples of all nations.{'"'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-[var(--church-gold)] hover:bg-[#d4a934] text-[var(--church-dark-text)] font-semibold px-8 w-full sm:w-auto">
                  Register Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/counseling">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 lg:py-20 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">About the Program</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-6">
                  Train for the Mission Field
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Missions Training Program is designed to equip believers with the knowledge, skills, and spiritual 
                  foundation needed for effective cross-cultural ministry and church planting.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Whether you feel called to serve locally or internationally, this training will prepare you to make 
                  disciples and plant churches that transform communities.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[var(--church-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">6 Sessions</p>
                      <p className="text-xs text-muted-foreground">Over 6 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[var(--church-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Saturdays</p>
                      <p className="text-xs text-muted-foreground">9:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[var(--church-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Online & In-Person</p>
                      <p className="text-xs text-muted-foreground">Hybrid format</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--church-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Limited Slots</p>
                      <p className="text-xs text-muted-foreground">Register early</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image/Video Placeholder */}
              <div className="bg-background rounded-2xl shadow-lg p-8 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-[var(--church-primary)] mx-auto mb-4" />
                  <p className="text-muted-foreground">Promotional Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Modules */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">What You{`'`}ll Learn</h2>
              <p className="text-muted-foreground mt-2">Our comprehensive curriculum covers all aspects of missions</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainingModules.map((module, index) => (
                <Card key={index} className="border border-border hover:border-[var(--church-primary)] transition-colors">
                  <CardContent className="p-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-[var(--church-primary)]" />
                    </div>
                    <span className="font-medium text-foreground">{module}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-12 lg:py-16 bg-[var(--church-soft-gray)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Training Schedule</h2>
              <p className="text-muted-foreground mt-2">Mark your calendar for these dates</p>
            </div>

            <div className="space-y-3">
              {trainingSchedule.map((session, index) => (
                <Card key={index} className="bg-background border-none shadow-md">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--church-primary)] text-white flex flex-col items-center justify-center text-xs font-bold">
                        <span>{session.date.split(' ')[1].replace(',', '')}</span>
                        <span>{session.date.split(' ')[0].slice(0, 3)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{session.topic}</h4>
                        <p className="text-sm text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {session.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-20 bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Answer the Call?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join our next training cohort and be equipped for the mission field.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-[var(--church-gold)] hover:bg-[#d4a934] text-[var(--church-dark-text)] font-semibold px-8">
                Register for Training
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
