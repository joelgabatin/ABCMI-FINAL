"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function PrayerRequestPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [address, setAddress] = useState('')
  const [request, setRequest] = useState('')
  const [faceToFace, setFaceToFace] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!request.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || null,
          contact: contact.trim() || null,
          address: address.trim() || null,
          request: request.trim(),
          is_anonymous: !name.trim(),
          face_to_face: faceToFace,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Submission failed')
      }

      setIsSubmitted(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setContact('')
    setAddress('')
    setRequest('')
    setFaceToFace(false)
    setIsSubmitted(false)
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
                <h2 className="text-2xl font-bold text-foreground mb-4">Prayer Request Received</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for sharing your prayer request with us. Our Intercessory Ministry will lift you up in prayer.
                  God hears every prayer, and we are honored to stand with you in faith.
                </p>
                <Button
                  onClick={resetForm}
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
      <section
        className="pt-24 pb-12 lg:pt-32 lg:pb-16 relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520187044487-b2efb58f0cba?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Prayer Request</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {'"'}The prayer of a righteous person is powerful and effective.{'"'} </p>
            <p>- James 5:16
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 lg:py-20 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-background border-none shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-foreground">Share Your Prayer Need</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Our Intercessory Ministry is committed to praying for you. All requests are handled with care and confidentiality.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                    />
                    <p className="text-xs text-muted-foreground">You may remain anonymous if you prefer.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+63 912 345 6789"
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Your address"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="request">Prayer Request *</Label>
                    <Textarea
                      id="request"
                      placeholder="Share your prayer request here..."
                      rows={5}
                      required
                      value={request}
                      onChange={e => setRequest(e.target.value)}
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)] resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--church-light-blue)] rounded-lg">
                    <Checkbox
                      id="face-to-face"
                      className="mt-0.5"
                      checked={faceToFace}
                      onCheckedChange={v => setFaceToFace(!!v)}
                    />
                    <div>
                      <Label htmlFor="face-to-face" className="text-sm font-medium cursor-pointer">
                        I would like to be prayed for face-to-face
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        If selected, a member of our prayer team will contact you to arrange a personal prayer session.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                    disabled={isLoading || !request.trim()}
                  >
                    {isLoading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Prayer Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-background rounded-xl shadow-md">
              <h3 className="font-semibold text-foreground mb-3">About Our Intercessory Ministry</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our dedicated prayer warriors meet regularly to intercede for the needs of our church family and community.
                Every prayer request is treated with utmost confidentiality and brought before God with faith and love.
                We believe in the power of prayer and stand with you in agreement for God{`'`}s answers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
