"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Clock, User, Globe, Send, CheckCircle } from "lucide-react"

const localOutreaches = [
  { name: "ABCMI Quirino Hill (Main)", location: "Quirino Hill, Baguio City", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Camp 8 Outreach", location: "Camp 8, Baguio City", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Kias Outreach", location: "Kias, Baguio City", schedule: "Sundays, 9:00 AM", contact: "Ptr. Julio Coyoy" },
  { name: "San Carlos Outreach", location: "San Carlos, Baguio City", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Idogan Outreach", location: "Idogan, San Carlos, Baguio City", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Patiacan Outreach", location: "Patiacan, Quirino, Ilocos Sur", schedule: "Sundays, 9:00 AM", contact: "Ptr. Ernesto Paleyan" },
  { name: "Nangobongan Outreach", location: "Nangobongan, San Juan, Abra", schedule: "Sundays, 9:00 AM", contact: "Ptr. Vergie W." },
  { name: "Manabo Outreach", location: "Manabo, Abra", schedule: "Sundays, 9:00 AM", contact: "Ptr. Elmo Salingbay" },
  { name: "Maria Aurora Outreach", location: "Maria Aurora, Aurora", schedule: "Sundays, 9:00 AM", contact: "Ptr. Calixto Ngateb" },
  { name: "Lower Decoliat Outreach", location: "Alfonso Castañeda, Nueva Vizcaya", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Dalic Outreach", location: "Dalic, Bontoc, Mt. Province", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Ansagan Outreach", location: "Ansagan, Tuba, Benguet", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Abas Outreach", location: "Abas, Sallapadan, Abra", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Tuding Outreach", location: "Tuding, Itogon, Benguet", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
  { name: "Palina Outreach", location: "Palina, Tuba, Benguet", schedule: "Sundays, 9:00 AM", contact: "Contact Pastor" },
]

const internationalOutreach = {
  name: "Vientiane Outreach",
  location: "Vientiane, Laos",
  schedule: "Sundays, 9:00 AM (Local Time)",
  contact: "Contact Missions Team"
}

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Service Schedules</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find a worship location near you. We have outreaches across the Philippines and internationally.
            </p>
          </div>
        </div>
      </section>

      {/* Main Schedule */}
      <section className="py-12 lg:py-16 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-none shadow-xl">
              <CardContent className="p-8 lg:p-12">
                <div className="text-center">
                  <span className="inline-block px-4 py-1 bg-[var(--church-gold)] text-[var(--church-dark-text)] rounded-full text-sm font-semibold mb-4">
                    Main Church
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">ABCMI Quirino Hill</h2>
                  <p className="text-lg text-white/90 mb-6">Join us for our weekly worship services</p>
                  <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="bg-white/10 rounded-xl p-4">
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-semibold">Sunday Service</p>
                      <p className="text-sm text-white/80">9:00 AM - 12:00 PM</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-semibold">Prayer Meeting</p>
                      <p className="text-sm text-white/80">Wed, 7:00 PM</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-semibold">Bible Study</p>
                      <p className="text-sm text-white/80">Fri, 7:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Local Outreaches */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">Local Presence</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">Local Outreach Locations</h2>
              <p className="text-muted-foreground mt-2">15 locations across the Philippines</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localOutreaches.map((outreach, index) => (
                <Card key={index} className="border border-border hover:border-[var(--church-primary)] hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground mb-3">{outreach.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--church-primary)]" />
                        <span>{outreach.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 shrink-0 text-[var(--church-primary)]" />
                        <span>{outreach.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4 shrink-0 text-[var(--church-primary)]" />
                        <span>{outreach.contact}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* International Outreach */}
      <section className="py-12 lg:py-16 bg-[var(--church-soft-gray)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[var(--church-gold)] font-semibold text-sm uppercase tracking-wider">Global Mission</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">International Outreach</h2>
            </div>

            <Card className="bg-background border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center">
                    <Globe className="w-7 h-7 text-[var(--church-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">{internationalOutreach.name}</h3>
                    <p className="text-[var(--church-primary)] font-medium">Southeast Asia</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--church-primary)]" />
                    <span>{internationalOutreach.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 shrink-0 text-[var(--church-primary)]" />
                    <span>{internationalOutreach.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4 shrink-0 text-[var(--church-primary)]" />
                    <span>{internationalOutreach.contact}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* No Nearby Location Form */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              No Outreach Near You?
            </h2>
            <p className="text-muted-foreground mb-6">
              Leave your information and we{`'`}ll help you connect with a nearby fellowship or explore starting one in your area.
            </p>
            
            {!showForm && !isSubmitted && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
              >
                Leave Your Information
              </Button>
            )}

            {isSubmitted && (
              <Card className="bg-[var(--church-light-blue)] border-none">
                <CardContent className="p-6 flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <p className="text-foreground font-medium">Thank you! We{`'`}ll be in touch soon.</p>
                </CardContent>
              </Card>
            )}

            {showForm && !isSubmitted && (
              <Card className="bg-background border border-border shadow-lg mt-6 text-left">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number *</Label>
                      <Input id="contact" type="tel" placeholder="+63 912 345 6789" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Your Location *</Label>
                      <Input id="location" placeholder="City, Province" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea id="message" placeholder="Any additional information..." rows={3} />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Submitting..." : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit
                          </>
                        )}
                      </Button>
                    </div>
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
