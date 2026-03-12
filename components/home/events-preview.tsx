import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react"

const upcomingEvents = [
  {
    title: "Sunday Worship Service",
    date: "Every Sunday",
    time: "9:00 AM - 12:00 PM",
    location: "Main Sanctuary, Quirino Hill",
    featured: true,
  },
  {
    title: "Wednesday Prayer Meeting",
    date: "Every Wednesday",
    time: "7:00 PM - 8:30 PM",
    location: "Prayer Room",
    featured: false,
  },
  {
    title: "Youth Fellowship Night",
    date: "Every Friday",
    time: "6:00 PM - 9:00 PM",
    location: "Fellowship Hall",
    featured: false,
  },
  {
    title: "Men's Bible Study",
    date: "Every Saturday",
    time: "6:00 AM - 7:30 AM",
    location: "Conference Room",
    featured: false,
  },
]

export function EventsPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--church-soft-gray)]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Featured Event */}
            <div>
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">Join Us</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-6">
                Upcoming Events
              </h2>
              
              <Card className="bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-none shadow-xl overflow-hidden">
                <CardContent className="p-8">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                    Featured Event
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                    Sunday Worship Service
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Join us every Sunday for a time of worship, prayer, and the Word of God. 
                    Experience the presence of God with our church family.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[var(--church-gold)]" />
                      <span>Every Sunday</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[var(--church-gold)]" />
                      <span>9:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[var(--church-gold)]" />
                      <span>Main Sanctuary, Quirino Hill</span>
                    </div>
                  </div>
                  <Link href="/services">
                    <Button className="bg-[var(--church-gold)] hover:bg-[#d4a934] text-[var(--church-dark-text)] font-semibold">
                      View All Schedules
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Event List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground mb-4">Weekly Schedule</h3>
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-background border border-border hover:border-[var(--church-primary)] transition-colors">
                  <CardContent className="p-5 flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[var(--church-light-blue)] flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-[var(--church-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-1 truncate">{event.title}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Link href="/events" className="block pt-2">
                <Button variant="ghost" className="text-[var(--church-primary)] hover:bg-[var(--church-light-blue)] w-full">
                  View Full Calendar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
