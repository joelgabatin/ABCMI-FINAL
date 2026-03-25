"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Send, CheckCircle, Users, MapPin, Calendar, Clock } from "lucide-react"
import { toast } from "sonner"

const branches = [
  "ABCMI Main Church", "Camp 8 Branch", "San Carlos Branch",
  "Kias Branch", "Patiacan Branch", "Villa Conchita Branch", "Casacgudan Branch",
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function BibleStudyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [interestType, setInterestType] = useState("join")
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    branch: "ABCMI Main Church",
    preferredDay: "Sunday",
    preferredTime: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const res = await fetch("/api/bible-study/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_type: interestType === "open" ? "open_house" : "join",
          name: formData.name,
          phone: formData.contact,
          email: formData.email,
          branch: formData.branch,
          address: interestType === "open" ? formData.location : null,
          preferred_day: formData.preferredDay,
          preferred_time: formData.preferredTime,
          message: formData.message,
          // For 'join' type, location might be stored differently or not at all depending on DB schema
          // but we'll include it in message if it's not 'open'
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit request")
      }

      setIsSubmitted(true)
      toast.success("Request submitted successfully!")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <SiteLayout>
        <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 min-h-[80vh] flex items-center bg-[var(--church-light-blue)]">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto bg-background border-none shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Request Received!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest in Bible study! Our Discipleship Team will contact you soon to discuss 
                  the next steps. We{`'`}re excited to grow in God{`'`}s Word together with you!
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                >
                  Submit Another Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Bible Study</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Grow deeper in your faith through intentional study of God{`'`}s Word with fellow believers.
            </p>
          </div>
        </div>
      </section>

      {/* Options Section */}
      <section className="py-12 lg:py-16 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-[var(--church-primary)]" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-foreground">Join a Group</h3>
                  <p className="text-muted-foreground">
                    Connect with an existing Bible study group in your area and grow together in God's Word.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-8 h-8 text-[var(--church-gold)]" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-foreground">Open a Study</h3>
                  <p className="text-muted-foreground">
                    Start a new Bible study in your home or community to reach those around you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-background border border-border shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-foreground">Express Your Interest</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Fill out the form below and our team will get in touch with you.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        placeholder="Your name" 
                        required
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number *</Label>
                      <Input 
                        id="contact" 
                        type="tel" 
                        placeholder="+63 912 345 6789" 
                        required
                        value={formData.contact}
                        onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="your@email.com" 
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch">Nearest Branch *</Label>
                      <Select value={formData.branch} onValueChange={v => setFormData(p => ({ ...p, branch: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{interestType === "open" ? "Home Address *" : "General Location / Barangay *"}</Label>
                    <Input 
                      id="location" 
                      placeholder={interestType === "open" ? "Full address for the study group" : "Your city or barangay"} 
                      required
                      value={formData.location}
                      onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>What would you like to do? *</Label>
                    <RadioGroup value={interestType} onValueChange={setInterestType} className="grid sm:grid-cols-2 gap-4">
                      <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${interestType === 'join' ? 'border-[var(--church-primary)] bg-[var(--church-primary)]/5' : 'border-border hover:border-muted-foreground/30'}`}>
                        <RadioGroupItem value="join" id="join" className="mt-1" />
                        <Label htmlFor="join" className="flex-1 cursor-pointer">
                          <span className="font-bold block mb-1">Join a Group</span>
                          <p className="text-xs text-muted-foreground leading-relaxed text-balance">I want to participate in a current group</p>
                        </Label>
                      </div>
                      <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${interestType === 'open' ? 'border-[var(--church-gold)] bg-[var(--church-gold)]/5' : 'border-border hover:border-muted-foreground/30'}`}>
                        <RadioGroupItem value="open" id="open" className="mt-1" />
                        <Label htmlFor="open" className="flex-1 cursor-pointer">
                          <span className="font-bold block mb-1">Open a Study</span>
                          <p className="text-xs text-muted-foreground leading-relaxed text-balance">I want to host a new study group</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="day">Preferred Day</Label>
                      <Select value={formData.preferredDay} onValueChange={v => setFormData(p => ({ ...p, preferredDay: v }))}>
                        <SelectTrigger id="day">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="time" 
                          placeholder="e.g. 6:00 PM" 
                          className="pl-9"
                          value={formData.preferredTime}
                          onChange={e => setFormData(p => ({ ...p, preferredTime: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Message</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any additional information you'd like to share..."
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
