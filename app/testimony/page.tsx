"use client"

import { useState, useEffect } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Send, CheckCircle, Quote, User, Heart, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const CATEGORIES = ["Healing", "Provision", "Salvation", "Protection", "Answered Prayer", "Deliverance", "Other"]
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

interface Testimony {
  id: number
  author: string
  branch: string
  category: string
  title: string
  content: string
  date: string
  anonymous: boolean
  is_member: boolean
  likes: number
  created_at: string
}

export default function TestimonyPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isMember, setIsMember] = useState(true)
  const [anonymous, setAnonymous] = useState(false)
  const [branch, setBranch] = useState("")
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    fetchTestimonies()

    // Check rate limit on load and every second
    const checkRateLimit = () => {
      const lastSubmission = localStorage.getItem("last_testimony_at")
      if (lastSubmission) {
        const diff = Date.now() - parseInt(lastSubmission)
        const waitTime = 5 * 60 * 1000 // 5 minutes
        if (diff < waitTime) {
          setRateLimited(true)
          setSecondsLeft(Math.ceil((waitTime - diff) / 1000))
        } else {
          setRateLimited(false)
          setSecondsLeft(0)
        }
      }
    }

    checkRateLimit()
    const timer = setInterval(checkRateLimit, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchTestimonies = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/testimony")
      if (res.ok) {
        const data = await res.json()
        setTestimonies(data)
      }
    } catch (error) {
      console.error("Error fetching testimonies:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rateLimited) {
      toast.error(`Rate limit active. Please wait ${Math.ceil(secondsLeft / 60)} more minutes.`)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/testimony", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: name,
          email,
          branch,
          category,
          title,
          content,
          anonymous,
          is_member: isMember
        }),
      })

      if (res.ok) {
        localStorage.setItem("last_testimony_at", Date.now().toString())
        setIsSubmitted(true)
        toast.success("Testimony submitted for review!")
      } else {
        toast.error("Failed to submit testimony. Please try again.")
      }
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setName(""); setEmail(""); setIsMember(true); setAnonymous(false)
    setBranch(""); setCategory(""); setTitle(""); setContent("")
    setIsSubmitted(false)
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[var(--church-light-blue)]">
        {/* Hero Section */}
        <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-heading text-white">Stories of God's Faithfulness</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              We overcome by the blood of the Lamb and the word of our testimony. Share what God has done in your life!
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          
          {/* Testimonies Carousel */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground font-heading">Testimonies</h2>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map(n => (
                  <Card key={n} className="animate-pulse h-64" />
                ))}
              </div>
            ) : testimonies.length === 0 ? (
              <Card className="p-16 text-center text-muted-foreground border-dashed border-2">
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-10" />
                <p className="text-lg">No testimonies shared yet. Be the first to encourage our community!</p>
              </Card>
            ) : (
              <div className="px-4 md:px-12">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {testimonies.map((t) => (
                      <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/2 pl-4">
                        <Card className="h-full border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow bg-background">
                          <CardContent className="p-8 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                              <Badge className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] hover:bg-[var(--church-primary)]/10 border-none px-2 py-0 text-[10px] uppercase tracking-wider">
                                {t.category}
                              </Badge>
                              {!t.is_member && (
                                <Badge variant="outline" className="text-[10px] px-2 py-0">Guest</Badge>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-foreground mb-4 font-heading line-clamp-1">"{t.title}"</h3>
                            
                            <div className="relative flex-grow">
                              <Quote className="absolute -left-2 -top-2 w-10 h-10 text-[var(--church-primary)]/5" />
                              <p className="text-muted-foreground leading-relaxed relative z-10 italic line-clamp-6">
                                {t.content}
                              </p>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--church-gold)]/10 flex items-center justify-center">
                                  <User className="w-5 h-5 text-[var(--church-gold)]" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-foreground truncate max-w-[120px]">
                                    {t.anonymous ? "Anonymous" : t.author}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                    {t.branch}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-[var(--church-gold)]">
                                <Heart className="w-4 h-4 fill-current" />
                                <span className="text-sm font-bold">{t.likes}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4 md:-left-12" />
                  <CarouselNext className="-right-4 md:-right-12" />
                </Carousel>
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-none shadow-xl bg-background overflow-hidden">
              <div className="h-2 bg-[var(--church-primary)] w-full" />
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-3xl font-heading flex items-center justify-center gap-2">
                  <MessageSquare className="w-6 h-6 text-[var(--church-primary)]" />
                  Share Your Story
                </CardTitle>
                <CardDescription className="text-lg">
                  How has God moved in your life? Your testimony is a weapon of victory and a source of hope.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-10">
                {isSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Praise God!</h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                      Thank you for sharing your story. It has been sent for review and will be visible on the website once approved.
                    </p>
                    <Button onClick={resetForm} variant="outline" size="lg" className="px-10">
                      Share Another Testimony
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="t-name" className="text-sm font-bold uppercase tracking-wide">Your Name</Label>
                        <Input 
                          id="t-name" 
                          placeholder="Full Name" 
                          value={name} 
                          onChange={e => setName(e.target.value)} 
                          required={!anonymous}
                          disabled={anonymous}
                          className="bg-muted/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="t-email" className="text-sm font-bold uppercase tracking-wide">Email (Will not be published)</Label>
                        <Input 
                          id="t-email" 
                          type="email" 
                          placeholder="your@email.com" 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                          required 
                          className="bg-muted/30"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-muted/20 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox id="t-member" checked={isMember} onCheckedChange={v => setIsMember(!!v)} className="w-5 h-5" />
                        <Label htmlFor="t-member" className="cursor-pointer text-sm font-semibold">I am a member of ABCMI</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox id="t-anon" checked={anonymous} onCheckedChange={v => setAnonymous(!!v)} className="w-5 h-5" />
                        <Label htmlFor="t-anon" className="cursor-pointer text-sm font-semibold text-muted-foreground">Submit anonymously</Label>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold uppercase tracking-wide">Branch / Location</Label>
                        <Select value={branch} onValueChange={setBranch} required>
                          <SelectTrigger className="bg-muted/30">
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRANCHES.map(b => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-bold uppercase tracking-wide">Category</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger className="bg-muted/30">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="t-title" className="text-sm font-bold uppercase tracking-wide">Title of Your Testimony</Label>
                      <Input 
                        id="t-title" 
                        placeholder="Give your story a meaningful title" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        required 
                        className="bg-muted/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="t-content" className="text-sm font-bold uppercase tracking-wide">Your Story</Label>
                      <Textarea 
                        id="t-content" 
                        placeholder="Write your testimony here. Be as detailed as you like..." 
                        rows={8} 
                        value={content} 
                        onChange={e => setContent(e.target.value)} 
                        required 
                        className="resize-none bg-muted/30"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white text-lg h-14"
                      disabled={submitting || rateLimited}
                    >
                      {rateLimited ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-3 opacity-50" />
                          Wait {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')} to Submit Again
                        </>
                      ) : submitting ? (
                        "Submitting Your Story..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Submit My Testimony
                        </>
                      )}
                    </Button>
                    {rateLimited && (
                      <p className="text-center text-rose-600 text-sm font-bold mt-3 animate-pulse">
                        Security Notice: You can only share a testimony once every 5 minutes to prevent spam.
                      </p>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
