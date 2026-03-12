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
import { MessageCircle, Send, CheckCircle, Calendar, Clock, User, Phone, Video, Users } from "lucide-react"

export default function CounselingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [counselingType, setCounselingType] = useState("face-to-face")

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
                <h2 className="text-2xl font-bold text-foreground mb-4">Request Received</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. Our Counseling Ministry will contact you soon to confirm your schedule. 
                  We are here to support you through God{`'`}s love and wisdom.
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
              <MessageCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Counseling</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Need someone to talk to? Our pastoral team is here to listen, guide, and pray with you.
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
                <CardTitle className="text-xl text-foreground">Schedule a Counseling Session</CardTitle>
                <p className="text-muted-foreground text-sm">
                  All counseling sessions are confidential. We{`'`}re here to help you through life{`'`}s challenges with godly wisdom.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Your full name" 
                        required
                        className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number *</Label>
                      <Input 
                        id="contact" 
                        type="tel" 
                        placeholder="+63 912 345 6789" 
                        required
                        className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      placeholder="Your address" 
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook Account (Optional)</Label>
                    <Input 
                      id="facebook" 
                      placeholder="facebook.com/yourprofile" 
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        required
                        className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time *</Label>
                      <Select>
                        <SelectTrigger className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)]">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9am">9:00 AM</SelectItem>
                          <SelectItem value="10am">10:00 AM</SelectItem>
                          <SelectItem value="11am">11:00 AM</SelectItem>
                          <SelectItem value="2pm">2:00 PM</SelectItem>
                          <SelectItem value="3pm">3:00 PM</SelectItem>
                          <SelectItem value="4pm">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Counseling Type *</Label>
                    <RadioGroup value={counselingType} onValueChange={setCounselingType} className="grid sm:grid-cols-3 gap-3">
                      <Label 
                        htmlFor="face-to-face" 
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${counselingType === 'face-to-face' ? 'border-[var(--church-primary)] bg-[var(--church-light-blue)]' : 'border-border'}`}
                      >
                        <RadioGroupItem value="face-to-face" id="face-to-face" />
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[var(--church-primary)]" />
                          <span className="text-sm font-medium">Face-to-Face</span>
                        </div>
                      </Label>
                      <Label 
                        htmlFor="call" 
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${counselingType === 'call' ? 'border-[var(--church-primary)] bg-[var(--church-light-blue)]' : 'border-border'}`}
                      >
                        <RadioGroupItem value="call" id="call" />
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[var(--church-primary)]" />
                          <span className="text-sm font-medium">Call</span>
                        </div>
                      </Label>
                      <Label 
                        htmlFor="video" 
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${counselingType === 'video' ? 'border-[var(--church-primary)] bg-[var(--church-light-blue)]' : 'border-border'}`}
                      >
                        <RadioGroupItem value="video" id="video" />
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-[var(--church-primary)]" />
                          <span className="text-sm font-medium">Video Call</span>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Are you a church member? *</Label>
                    <RadioGroup defaultValue="yes" className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="member-yes" />
                        <Label htmlFor="member-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="member-no" />
                        <Label htmlFor="member-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concern">Topic or Concern to be Discussed *</Label>
                    <Textarea 
                      id="concern" 
                      placeholder="Please briefly describe the topic or concern you would like to discuss..." 
                      rows={4}
                      required
                      className="border-border focus:border-[var(--church-primary)] focus:ring-[var(--church-primary)] resize-none"
                    />
                  </div>

                  <div className="p-4 bg-[var(--church-light-blue)] rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Face-to-face counseling is recommended for church members, but online counseling is also available. 
                      For non-members or referrals, please ensure your contact number or Facebook account is provided for follow-up.
                    </p>
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
                        Request Counseling Session
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <Card className="bg-background border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-[var(--church-primary)] mx-auto mb-2" />
                  <h4 className="font-semibold text-sm text-foreground">Flexible Scheduling</h4>
                  <p className="text-xs text-muted-foreground">Choose a time that works for you</p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-[var(--church-primary)] mx-auto mb-2" />
                  <h4 className="font-semibold text-sm text-foreground">Pastoral Care</h4>
                  <p className="text-xs text-muted-foreground">Trained and compassionate counselors</p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-[var(--church-primary)] mx-auto mb-2" />
                  <h4 className="font-semibold text-sm text-foreground">Confidential</h4>
                  <p className="text-xs text-muted-foreground">Your privacy is our priority</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
