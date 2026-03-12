"use client"

import { useState } from "react"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, ArrowRight, Bell, CheckCircle, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"

const upcomingEvents = [
  {
    title: "Youth Camp 2026",
    date: "April 15-17, 2026",
    time: "8:00 AM onwards",
    location: "Camp John Hay, Baguio City",
    description: "A three-day camp for the youth to grow in faith and fellowship. Open to all young people ages 13-25.",
    featured: true,
  },
  {
    title: "Women's Conference",
    date: "March 28, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "ABCMI Main Church",
    description: "An empowering conference for women of all ages. Theme: 'Arise, Shine!'",
    featured: false,
  },
  {
    title: "Easter Sunday Service",
    date: "April 20, 2026",
    time: "6:00 AM & 9:00 AM",
    location: "ABCMI Main Church",
    description: "Celebrate the resurrection of our Lord with sunrise and regular services.",
    featured: false,
  },
  {
    title: "Missions Sunday",
    date: "May 3, 2026",
    time: "9:00 AM",
    location: "ABCMI Main Church",
    description: "A special service dedicated to our mission work. Hear updates from our missionaries.",
    featured: false,
  },
]

const pastEvents = [
  {
    title: "Christmas Outreach 2025",
    date: "December 20, 2025",
    description: "Distributed gifts and shared the Gospel to 500+ children in remote communities.",
    image: null,
  },
  {
    title: "Family Day 2025",
    date: "November 15, 2025",
    description: "A fun-filled day of games, fellowship, and worship for all church families.",
    image: null,
  },
  {
    title: "VBS 2025",
    date: "June 15-19, 2025",
    description: "Over 200 children attended our Vacation Bible School. Many gave their lives to Christ!",
    image: null,
  },
]

const newsUpdates = [
  {
    title: "New Church Building Project Update",
    date: "March 10, 2026",
    content: "We are excited to announce that the construction of our new fellowship hall is progressing well. Thank you for your continued prayers and support!",
  },
  {
    title: "Missions Team Returns from Laos",
    date: "March 5, 2026",
    content: "Our missions team has returned from their trip to Vientiane, Laos. They report that the church plant is growing with 30+ regular attendees.",
  },
  {
    title: "New Discipleship Program Launch",
    date: "February 28, 2026",
    content: "We are launching a new 12-week discipleship program for new believers. Sign up through our Bible Study page!",
  },
]

export default function EventsPage() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubscribed(true)
  }

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Events & News</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Stay updated with our church activities, events, and announcements.
            </p>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-12 lg:py-16 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-background">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-[var(--church-primary)] data-[state=active]:text-white">
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-[var(--church-primary)] data-[state=active]:text-white">
                  Past Activities
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-[var(--church-primary)] data-[state=active]:text-white">
                  News & Blog
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Events */}
              <TabsContent value="upcoming">
                <div className="space-y-6">
                  {/* Featured Event */}
                  {upcomingEvents.filter(e => e.featured).map((event, index) => (
                    <Card key={index} className="bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-none shadow-xl overflow-hidden">
                      <CardContent className="p-8">
                        <span className="inline-block px-3 py-1 bg-[var(--church-gold)] text-[var(--church-dark-text)] rounded-full text-sm font-semibold mb-4">
                          Featured Event
                        </span>
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">{event.title}</h3>
                        <p className="text-white/90 mb-6">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--church-gold)]" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[var(--church-gold)]" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[var(--church-gold)]" />
                            {event.location}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Other Events */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {upcomingEvents.filter(e => !e.featured).map((event, index) => (
                      <Card key={index} className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg text-foreground mb-2">{event.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-[var(--church-primary)]" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4 text-[var(--church-primary)]" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4 text-[var(--church-primary)]" />
                              {event.location}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Calendar Placeholder */}
                  <Card className="bg-background border border-border mt-8">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">March 2026</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="p-2 font-medium text-muted-foreground">{day}</div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`p-2 rounded ${i + 1 === 28 ? 'bg-[var(--church-primary)] text-white' : i + 1 === 12 ? 'bg-[var(--church-gold)]/20 text-[var(--church-gold)] font-bold' : 'hover:bg-muted'}`}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Past Activities */}
              <TabsContent value="past">
                <div className="grid md:grid-cols-3 gap-6">
                  {pastEvents.map((event, index) => (
                    <Card key={index} className="bg-background border-none shadow-lg overflow-hidden">
                      <div className="h-40 bg-[var(--church-soft-gray)] flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                      <CardContent className="p-5">
                        <p className="text-sm text-[var(--church-primary)] font-medium mb-1">{event.date}</p>
                        <h3 className="font-bold text-foreground mb-2">{event.title}</h3>
                        <p className="text-muted-foreground text-sm">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* News & Blog */}
              <TabsContent value="news">
                <div className="space-y-6">
                  {newsUpdates.map((news, index) => (
                    <Card key={index} className="bg-background border-none shadow-lg">
                      <CardContent className="p-6">
                        <p className="text-sm text-[var(--church-primary)] font-medium mb-2">{news.date}</p>
                        <h3 className="font-bold text-xl text-foreground mb-3">{news.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{news.content}</p>
                        <Button variant="link" className="p-0 h-auto mt-3 text-[var(--church-primary)]">
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Newsletter Subscribe */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card className="bg-[var(--church-soft-gray)] border-none">
              <CardContent className="p-8 text-center">
                {isSubscribed ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">You{`'`}re Subscribed!</h3>
                    <p className="text-muted-foreground">
                      You{`'`}ll receive our newsletter with updates on events and news. Thank you!
                    </p>
                  </>
                ) : (
                  <>
                    <Bell className="w-12 h-12 text-[var(--church-primary)] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">Stay Updated</h3>
                    <p className="text-muted-foreground mb-6">
                      Subscribe to our newsletter and never miss an event or announcement.
                    </p>
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Label htmlFor="email" className="sr-only">Email</Label>
                        <Input 
                          id="email"
                          type="email" 
                          placeholder="Your email address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
