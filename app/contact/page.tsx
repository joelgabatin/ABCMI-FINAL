"use client"

import { useState, useEffect } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" }

interface SiteInfo {
  address: string
  contact_phone: string
  contact_email: string
  office_hours: string
  google_maps_embed_url: string
  facebook_url: string
  youtube_url: string
  instagram_url: string
  tiktok_url: string
}

const DEFAULT_INFO: SiteInfo = {
  address: "East Quirino Hill, Baguio City, Benguet, Philippines 2600",
  contact_phone: "+63 74 123 4567",
  contact_email: "info@abcmi.org",
  office_hours: "Mon–Fri: 8AM – 5PM\nSat: 8AM – 12PM",
  google_maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3828.7165538370545!2d120.59718!3d16.40298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDI0JzEwLjciTiAxMjDCsDM1JzUwLjAiRQ!5e0!3m2!1sen!2sph!4v1620000000000!5m2!1sen!2sph",
  facebook_url: "",
  youtube_url: "",
  instagram_url: "",
  tiktok_url: "",
}

export default function ContactPage() {
  const supabase = createClient()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [info, setInfo] = useState<SiteInfo>(DEFAULT_INFO)

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setInfo({
            address:              data.address              ?? DEFAULT_INFO.address,
            contact_phone:        data.contact_phone        ?? DEFAULT_INFO.contact_phone,
            contact_email:        data.contact_email        ?? DEFAULT_INFO.contact_email,
            office_hours:         data.office_hours         ?? DEFAULT_INFO.office_hours,
            google_maps_embed_url: data.google_maps_embed_url ?? DEFAULT_INFO.google_maps_embed_url,
            facebook_url:         data.facebook_url         ?? "",
            youtube_url:          data.youtube_url          ?? "",
            instagram_url:        data.instagram_url        ?? "",
            tiktok_url:           data.tiktok_url           ?? "",
          })
        }
      })
      .catch(() => {})
  }, [])

  const set = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.subject) { toast.error("Please select a subject."); return }
    setLoading(true)
    const { error } = await supabase.from("contact_messages").insert({
      name:    form.name.trim(),
      email:   form.email.trim(),
      phone:   form.phone.trim() || null,
      subject: form.subject,
      message: form.message.trim(),
    })
    setLoading(false)
    if (error) { toast.error("Failed to send message. Please try again."); return }
    setSubmitted(true)
    setForm(emptyForm)
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="pt-24 pb-16 lg:pt-32 lg:pb-20 relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
            We would love to hear from you. Reach out to us for any questions, prayer needs, or to learn more about our church.
          </p>
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
                          <Input id="name" placeholder="Juan dela Cruz" required value={form.name} onChange={set("name")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" type="email" placeholder="you@email.com" required value={form.email} onChange={set("email")} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={set("phone")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select required value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: v }))}>
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
                          value={form.message}
                          onChange={set("message")}
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white font-semibold"
                      >
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send Message"}
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
              <div className="rounded-2xl overflow-hidden border border-border shadow-md h-[550px] bg-[var(--church-soft-gray)]">
                <iframe
                  title="ABCMI Main Church Location"
                  src={info.google_maps_embed_url}
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
                {info.address}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Get in Touch — info cards below */}
      <section className="py-12 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Get in Touch with Us</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-sm bg-background">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--church-primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">Address</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{info.address}</p>
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
                    <p className="text-muted-foreground text-sm">{info.contact_phone}</p>
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
                    <p className="text-muted-foreground text-sm">{info.contact_email}</p>
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
                    {info.office_hours.split("\n").map((line, i) => (
                      <p key={i} className="text-muted-foreground text-sm">{line}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media — only shown if at least one is set */}
      {(info.facebook_url || info.youtube_url || info.instagram_url || info.tiktok_url) && (
        <section className="py-12 bg-background border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Follow Us</h2>
            <p className="text-muted-foreground text-sm mb-6">Stay connected with us on social media</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {info.facebook_url && (
                <a
                  href={info.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1877F2] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.101 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              )}
              {info.youtube_url && (
                <a
                  href={info.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF0000] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              )}
              {info.instagram_url && (
                <a
                  href={info.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                  Instagram
                </a>
              )}
              {info.tiktok_url && (
                <a
                  href={info.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#010101] text-white text-sm font-semibold hover:opacity-80 transition-opacity"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                  </svg>
                  TikTok
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  )
}
