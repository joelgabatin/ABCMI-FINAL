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
import { BookOpen, Send, CheckCircle, Users, MapPin, Calendar, MessageSquare } from "lucide-react"

export default function BibleStudyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [interestType, setInterestType] = useState("join")

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
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10" />
            </div>
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
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-[var(--church-primary)]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Join a Group</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with an existing Bible study group in your area.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-7 h-7 text-[var(--church-gold)]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Open a Study</h3>
                  <p className="text-muted-foreground text-sm">
                    Start a new Bible study in your home or community.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Give Feedback</h3>
                  <p className="text-muted-foreground text-sm">
                    Share your experience or suggestions about our Bible studies.
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number *</Label>
                      <Input 
                        id="contact" 
                        type="tel" 
                        placeholder="+63 912 345 6789" 
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location" 
                      placeholder="Your city or barangay" 
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>What would you like to do? *</Label>
                    <RadioGroup value={interestType} onValueChange={setInterestType} className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-[var(--church-primary)] transition-colors">
                        <RadioGroupItem value="join" id="join" />
                        <Label htmlFor="join" className="flex-1 cursor-pointer">
                          <span className="font-medium">Join an existing Bible study</span>
                          <p className="text-sm text-muted-foreground">I want to participate in a current group</p>
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-[var(--church-primary)] transition-colors">
                        <RadioGroupItem value="open" id="open" />
                        <Label htmlFor="open" className="flex-1 cursor-pointer">
                          <span className="font-medium">Open a Bible study in my area</span>
                          <p className="text-sm text-muted-foreground">I want to host a new study group</p>
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-[var(--church-primary)] transition-colors">
                        <RadioGroupItem value="feedback" id="feedback-option" />
                        <Label htmlFor="feedback-option" className="flex-1 cursor-pointer">
                          <span className="font-medium">Share feedback about a Bible study</span>
                          <p className="text-sm text-muted-foreground">I have suggestions or comments</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule">Preferred Schedule</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekday-morning">Weekday Mornings</SelectItem>
                        <SelectItem value="weekday-evening">Weekday Evenings</SelectItem>
                        <SelectItem value="saturday-morning">Saturday Mornings</SelectItem>
                        <SelectItem value="saturday-afternoon">Saturday Afternoons</SelectItem>
                        <SelectItem value="sunday-afternoon">Sunday Afternoons</SelectItem>
                        <SelectItem value="flexible">Flexible / Any Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes or Feedback</Label>
                    <Textarea 
                      id="notes" 
                      placeholder={interestType === "feedback" 
                        ? "Share your feedback or suggestions..."
                        : "Any additional information you'd like to share..."
                      }
                      rows={4}
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
