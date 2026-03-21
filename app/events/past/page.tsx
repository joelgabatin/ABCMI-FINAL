import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Image as ImageIcon } from "lucide-react"

const pastActivities = [
  {
    title: "Christmas Outreach 2025",
    date: "December 20, 2025",
    category: "Outreach",
    location: "Remote communities, Abra & Benguet",
    attendees: 520,
    description: "Distributed gifts, food packs, and shared the Gospel to over 520 children and families in remote mountain communities. Our teams from Casacgudan, Villa Conchita, and Dalic branches participated.",
    highlights: ["520 beneficiaries reached", "12 teams deployed", "30 salvations recorded", "Gift packages distributed"],
  },
  {
    title: "Church Anniversary Celebration — 40 Years",
    date: "November 8, 2025",
    category: "Anniversary",
    location: "ABCMI Main Church, East Quirino Hill, Baguio City",
    attendees: 350,
    description: "ABCMI celebrated its 40th founding anniversary with a grand thanksgiving service, special presentations by all ministries, and a fellowship dinner. Founding members were honored and testimonies of God's faithfulness were shared.",
    highlights: ["350 attendees", "40-year history presentation", "Ministry showcases", "Founders honored"],
  },
  {
    title: "Family Day 2025",
    date: "November 15, 2025",
    category: "Fellowship",
    location: "Wright Park, Baguio City",
    attendees: 280,
    description: "A joyful day of games, fellowship, and worship for all church families. Teams from all Baguio-based branches competed in friendly games, followed by a worship service and picnic lunch together.",
    highlights: ["280 participants", "All branches represented", "Family Olympics games", "Worship and prayer time"],
  },
  {
    title: "Vacation Bible School 2025",
    date: "June 15–19, 2025",
    category: "Children",
    location: "ABCMI Main Church",
    attendees: 210,
    description: "Over 210 children attended our five-day Vacation Bible School. Many gave their lives to Christ during the invitation time. Theme: 'Superheroes of Faith.' Activities included Bible lessons, crafts, games, and a grand finale showcase.",
    highlights: ["210 children attended", "45 first-time decisions", "5-day program", "Grand finale presentation"],
  },
  {
    title: "ABCMI Youth Conference 2025",
    date: "August 2–3, 2025",
    category: "Youth",
    location: "Camp John Hay, Baguio City",
    attendees: 95,
    description: "A two-day youth conference bringing together young people from all ABCMI branches. Theme: 'Set Apart.' Guest speakers included Ptr. Emannuel Marbella and Ptr. Frederick Dangilan. Sessions on identity, purity, and calling.",
    highlights: ["95 youth attendees", "8 branches represented", "12 rededications", "Leadership training tracks"],
  },
  {
    title: "Missions Outreach — Dianawan, Aurora",
    date: "September 27, 2025",
    category: "Missions",
    location: "Dianawan, Maria Aurora, Aurora",
    attendees: 80,
    description: "A missions trip to the Dianawan branch led by Ptr. Marvin and Ptr. Mirriam Anno. The team conducted medical missions, children's ministry, evangelism, and leadership training for local church workers.",
    highlights: ["80 community members served", "Free medical consultations", "20 salvations", "Leadership training for 15 local workers"],
  },
  {
    title: "Prayer & Fasting Week",
    date: "January 5–10, 2025",
    category: "Special Service",
    location: "ABCMI Main Church & all branches",
    attendees: 400,
    description: "A church-wide week of prayer and fasting to start the year. Morning and evening prayer services were held at the main church, with all satellite branches conducting simultaneous prayer meetings.",
    highlights: ["400+ participants church-wide", "6 days of prayer", "All branches participated", "Prophetic declarations"],
  },
  {
    title: "Men's Retreat 2025",
    date: "February 22, 2025",
    category: "Men",
    location: "La Trinidad, Benguet",
    attendees: 55,
    description: "A one-day men's retreat in the mountains of Benguet. Theme: 'The Warrior's Identity.' Sessions on godly manhood, family leadership, and accountability. Led by Ptr. Julio Coyoy and the Men's Ministry team.",
    highlights: ["55 men attended", "Bonfire sharing session", "Accountability groups formed", "Prayer and worship"],
  },
]

const categoryColors: Record<string, string> = {
  Outreach: "bg-purple-500/10 text-purple-700",
  Anniversary: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Fellowship: "bg-emerald-500/10 text-emerald-700",
  Children: "bg-orange-500/10 text-orange-700",
  Youth: "bg-emerald-500/10 text-emerald-700",
  Missions: "bg-blue-500/10 text-blue-700",
  "Special Service": "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Men: "bg-indigo-500/10 text-indigo-700",
}

export default function PastActivitiesPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-slate-700 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Featured Past Activities
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">God's Faithfulness in Action</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto text-pretty">
              A record of what God has done through ABCMI — in our churches, communities, and mission fields.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {pastActivities.map((activity, i) => (
              <Card key={i} className="w-full bg-background border-none shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image placeholder — full height */}
                    <div className="lg:w-72 h-52 lg:h-auto bg-[var(--church-soft-gray)] flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                      <p className="text-xs text-muted-foreground/50 mt-2">Photo Gallery</p>
                      <Badge className={`absolute top-3 left-3 ${categoryColors[activity.category] || "bg-muted text-muted-foreground"}`}>
                        {activity.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 lg:p-8">
                      <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[var(--church-primary)]" />{activity.date}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[var(--church-primary)]" />{activity.location}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[var(--church-primary)]" />{activity.attendees.toLocaleString()} attended</span>
                      </div>

                      <h2 className="text-2xl font-bold text-foreground mb-3 text-balance">{activity.title}</h2>
                      <p className="text-muted-foreground leading-relaxed mb-5 text-pretty">{activity.description}</p>

                      {/* Highlights */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Highlights</p>
                        <div className="flex flex-wrap gap-2">
                          {activity.highlights.map((h, j) => (
                            <span key={j} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--church-primary)]/8 text-[var(--church-primary)] rounded-full text-sm font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--church-primary)] flex-shrink-0" />
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
