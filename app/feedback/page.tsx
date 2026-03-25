"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, CheckCircle, Star } from "lucide-react"
import { toast } from "sonner"

const BRANCHES = [
  "ABCMI Main Church, Baguio City",
  "Camp 8, Baguio City",
  "San Carlos, Baguio City",
  "Kias, Baguio City",
  "Patiacan, Quirino, Ilocos Sur",
  "Villa Conchita, Manabo, Abra",
  "Casacgudan, Manabo, Abra",
  "San Juan, Abra",
  "Dianawan, Maria Aurora, Aurora",
  "Lower Decoliat, Alfonso Castaneda, Nueva Vizcaya",
  "Dalic, Bontoc, Mt. Province",
  "Ansagan, Tuba, Benguet",
  "Vientiane, Laos",
  "Other",
]

const FEEDBACK_TYPES = [
  "General Feedback",
  "Service Improvement",
  "Pastoral Care",
  "Facilities",
  "Programs",
  "Other",
] as const

export default function FeedbackPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [branch, setBranch] = useState("")
  const [feedbackType, setFeedbackType] = useState<string>("General Feedback")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [wantsResponse, setWantsResponse] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (rating === 0) { toast.error("Please select a star rating"); return }
    if (!branch) { toast.error("Please select your branch"); return }

    // Rate limiting: 5 minutes
    const lastSubmission = localStorage.getItem("last_feedback_at")
    if (lastSubmission) {
      const diff = Date.now() - parseInt(lastSubmission)
      const waitTime = 5 * 60 * 1000 // 5 minutes
      if (diff < waitTime) {
        const remaining = Math.ceil((waitTime - diff) / 1000 / 60)
        toast.error(`Please wait ${remaining} minute${remaining > 1 ? "s" : ""} before submitting another feedback.`)
        return
      }
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: anonymous ? "Anonymous" : name || "Anonymous",
          email: anonymous ? null : email,
          branch,
          type: feedbackType,
          subject,
          message,
          rating,
          anonymous,
          wants_response: wantsResponse,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit")
      
      localStorage.setItem("last_feedback_at", Date.now().toString())
      setIsSubmitted(true)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName(""); setEmail(""); setAnonymous(false); setBranch(""); setFeedbackType("General Feedback")
    setSubject(""); setMessage(""); setRating(0); setHoveredRating(0); setWantsResponse(false)
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
                <h2 className="text-2xl font-bold text-foreground mb-4">Thank You!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your feedback! We value your input and will use it to improve our ministry and serve you better.
                </p>
                <Button
                  onClick={resetForm}
                  className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                >
                  Submit Another
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Share Your Feedback</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Your thoughts and suggestions help us serve you and our church community better.
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
                <CardTitle className="text-xl text-foreground">Feedback Form</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Share your thoughts, suggestions, or concerns with us. All feedback is reviewed by our admin team.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={anonymous}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address {!wantsResponse && "(Optional)"}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={anonymous}
                      required={wantsResponse && !anonymous}
                    />
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="anonymous"
                        checked={anonymous}
                        onCheckedChange={v => setAnonymous(!!v)}
                      />
                      <Label htmlFor="anonymous" className="cursor-pointer text-sm font-normal text-muted-foreground">
                        Submit anonymously
                      </Label>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="space-y-2">
                    <Label>Branch / Location *</Label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCHES.map(b => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Feedback Type */}
                  <div className="space-y-2">
                    <Label>Feedback Type *</Label>
                    <RadioGroup
                      value={feedbackType}
                      onValueChange={setFeedbackType}
                      className="grid grid-cols-2 gap-2"
                    >
                      {FEEDBACK_TYPES.map(t => (
                        <div key={t} className="flex items-center gap-2">
                          <RadioGroupItem value={t} id={t} />
                          <Label htmlFor={t} className="cursor-pointer font-normal text-sm">{t}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief title for your feedback"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Feedback *</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your thoughts, suggestions, or concerns..."
                      rows={5}
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="resize-none"
                    />
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-2">
                    <Label>Overall Rating *</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoveredRating(n)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              n <= (hoveredRating || rating)
                                ? "text-[var(--church-gold)] fill-[var(--church-gold)]"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wants Response */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="wants_response"
                      checked={wantsResponse}
                      onCheckedChange={v => setWantsResponse(!!v)}
                    />
                    <Label htmlFor="wants_response" className="cursor-pointer text-sm font-normal">
                      I would like a response from the admin team
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
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
