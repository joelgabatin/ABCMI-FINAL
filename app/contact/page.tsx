"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
            We would love to hear from you. Reach out to us for any questions, prayer needs, or to learn more about our church.
          </p>
        </div>
      </section>

      {/* Contact Info row */}
      <section className="py-12 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm bg-background">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[var(--church-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">Address</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    East Quirino Hill, Baguio City<br />Benguet, Philippines 2600
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-background">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[var(--church-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">Phone</p>
                  <p className="text-muted-foreground text-sm">+63 74 XXX XXXX</p>
                  <p className="text-muted-foreground text-sm">+63 9XX XXX XXXX</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-background">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[var(--church-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">Email</p>
                  <p className="text-muted-foreground text-sm">info@abcmi.org</p>
                  <p className="text-muted-foreground text-sm">pastor@abcmi.org</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-background">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[var(--church-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">Office Hours</p>
                  <p className="text-muted-foreground text-sm">Mon–Fri: 8AM – 5PM</p>
                  <p className="text-muted-foreground text-sm">Sat: 8AM – 12PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Form (left) + Map (right) */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>

              {submitted ? (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground text-pretty">
                      Thank you for reaching out. We will get back to you within 1–2 business days. God bless you!
                    </p>
                    <Button
                      className="mt-6 bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-border shadow-md">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" placeholder="Juan dela Cruz" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" type="email" placeholder="you@email.com" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+63 9XX XXX XXXX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="prayer">Prayer Request</SelectItem>
                            <SelectItem value="membership">Church Membership</SelectItem>
                            <SelectItem value="missions">Missions &amp; Training</SelectItem>
                            <SelectItem value="donation">Donations &amp; Giving</SelectItem>
                            <SelectItem value="counseling">Counseling</SelectItem>
                            <SelectItem value="events">Events &amp; Activities</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Write your message here..."
                          rows={6}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white font-semibold"
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Google Map — right side */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[var(--church-primary)]" /> Find Us
              </h2>
              <div className="rounded-2xl overflow-hidden border border-border shadow-md h-[520px] bg-[var(--church-soft-gray)]">
                <iframe
                  title="ABCMI Main Church Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3828.7165538370545!2d120.59718!3d16.40298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDI0JzEwLjciTiAxMjDCsDM1JzUwLjAiRQ!5e0!3m2!1sen!2sph!4v1620000000000!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="text-muted-foreground text-sm mt-4 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--church-primary)] flex-shrink-0 mt-0.5" />
                East Quirino Hill, Baguio City, Benguet, Philippines 2600
              </p>
            </div>

          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
