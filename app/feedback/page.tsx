"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MessageSquare, Send, CheckCircle, Quote } from "lucide-react"

export default function FeedbackPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState("testimony")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubmitted(true)
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
                  {type === "testimony" 
                    ? "Thank you for sharing your testimony! Your story can inspire others and bring glory to God. We may reach out if we'd like to feature it."
                    : "Thank you for your feedback! We value your input and will use it to improve our ministry and serve you better."
                  }
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
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
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Feedback & Testimony</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Share your experience or testimony. Your story can encourage others and glorify God.
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
                <CardTitle className="text-xl text-foreground">Share With Us</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Whether it{`'`}s a testimony of God{`'`}s faithfulness or feedback to help us improve, we{`'`}d love to hear from you.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                    />
                    <p className="text-xs text-muted-foreground">You may share anonymously if you prefer.</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Type *</Label>
                    <RadioGroup value={type} onValueChange={setType} className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="testimony" id="testimony" />
                        <Label htmlFor="testimony" className="cursor-pointer">Testimony</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="feedback" id="feedback" />
                        <Label htmlFor="feedback" className="cursor-pointer">Feedback</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {type === "testimony" ? "Your Testimony" : "Your Feedback"} *
                    </Label>
                    <Textarea 
                      id="message" 
                      placeholder={type === "testimony" 
                        ? "Share how God has been working in your life..." 
                        : "Share your thoughts, suggestions, or feedback..."
                      }
                      rows={6}
                      required
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)] resize-none"
                    />
                  </div>

                  {type === "testimony" && (
                    <div className="p-4 bg-[var(--church-gold)]/10 rounded-lg border border-[var(--church-gold)]/30">
                      <Quote className="w-6 h-6 text-[var(--church-gold)] mb-2" />
                      <p className="text-sm text-foreground font-medium mb-1">Share Your Story</p>
                      <p className="text-xs text-muted-foreground">
                        Your testimony can encourage others who may be going through similar situations. 
                        With your permission, we may share your story to inspire our church family.
                      </p>
                    </div>
                  )}

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
                        Submit {type === "testimony" ? "Testimony" : "Feedback"}
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
