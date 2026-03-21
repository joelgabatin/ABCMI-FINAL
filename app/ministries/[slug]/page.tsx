import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Music, Star, Users, Heart, BookOpen, Baby,
  Stethoscope, Globe, MessageCircle, Flame,
  ArrowLeft, Clock, Calendar, MapPin, ArrowRight
} from "lucide-react"

const ministries = [
  {
    id: 1,
    slug: "music-ministry",
    name: "Music Ministry",
    description: "Leading the congregation in worship through music and song. We glorify God with our voices and instruments, creating an atmosphere of praise and adoration.",
    longDescription: "The Music Ministry of ABCMI is called to lead the entire congregation into the presence of God through anointed worship. Our team of singers, musicians, and sound technicians work together to create an atmosphere where hearts are opened to receive the Word of God. We believe that music is a powerful tool for evangelism, discipleship, and corporate worship. Every member of our team is committed to excellence in skill and integrity in character, understanding that we are first worshippers before we are performers.",
    icon: Music,
    color: "bg-[var(--church-primary)]",
    colorHex: "var(--church-primary)",
    leader: "Ptr. Fhey Coyoy",
    coLeader: "Bro. Daniel Paloma",
    meetingTime: "Saturdays, 4:00 PM",
    members: 24,
    location: "Main Sanctuary, ABCMI Main Church",
    contact: "musicministry@abcmi.org",
    activities: [
      "Weekly worship rehearsals every Saturday",
      "Monthly worship training and equipping sessions",
      "Special music presentations during church anniversaries",
      "Outreach worship events in communities",
      "Annual worship concert",
    ],
    events: [
      { title: "Worship Workshop", date: "Apr 5, 2026", time: "2:00 PM", location: "Main Sanctuary", type: "Training", description: "An intensive training session for all worship team members on vocal techniques, instrument playing, and spiritual preparation for worship." },
      { title: "Praise Night", date: "Apr 12, 2026", time: "6:00 PM", location: "Main Sanctuary", type: "Service", description: "A special evening of extended worship and praise open to the entire congregation and guests." },
      { title: "Worship Conference 2026", date: "May 20, 2026", time: "9:00 AM", location: "ABCMI Fellowship Hall", type: "Training", description: "A one-day conference featuring guest worship leaders and workshops on contemporary and traditional worship styles." },
    ],
    gallery: [],
  },
  {
    id: 2,
    slug: "dance-ministry",
    name: "Dance Ministry",
    description: "Expressing worship through movement and dance. We use the art of dance to praise God and minister to the congregation.",
    longDescription: "The Dance Ministry of ABCMI uses movement as an extension of worship, proclaiming the Word of God through creative expression. Our dancers are trained not only in technique but also in the spiritual significance of worship through dance. We believe that dance is a biblical form of worship and a powerful tool for ministry and evangelism. Our team performs during special services, conferences, and outreach events, using dance to touch hearts and draw people closer to God.",
    icon: Star,
    color: "bg-pink-500",
    colorHex: "#ec4899",
    leader: "Sister Ana Villanueva",
    coLeader: "Sister Grace Palma",
    meetingTime: "Saturdays, 3:00 PM",
    members: 15,
    location: "Fellowship Hall, ABCMI Main Church",
    contact: "danceministry@abcmi.org",
    activities: [
      "Weekly dance rehearsals every Saturday afternoon",
      "Quarterly recitals and performances",
      "Outreach dance presentations in schools and communities",
      "Annual dance showcase",
      "Dance camps for youth",
    ],
    events: [],
  },
  {
    id: 3,
    slug: "singles-adults-ministry",
    name: "Singles and Adults Ministry (SAM)",
    description: "Connecting single adults and mature members through fellowship, Bible study, and community service activities.",
    longDescription: "The Singles and Adults Ministry (SAM) exists to provide a nurturing community for single adults and mature members of ABCMI. We believe that every season of life is significant in God's plan, and we are committed to helping singles and adults grow in their relationship with God, build meaningful friendships, and find their purpose in serving the church and community. Through weekly fellowships, Bible studies, community outreaches, and recreational activities, SAM is a place where everyone belongs.",
    icon: Users,
    color: "bg-[var(--church-gold)]",
    colorHex: "var(--church-gold)",
    leader: "Ptr. Billy Antero",
    coLeader: "Bro. Mark Santos",
    meetingTime: "Sundays after service",
    members: 38,
    location: "Room 3, ABCMI Main Church",
    contact: "sam@abcmi.org",
    activities: [
      "Weekly fellowship every Sunday after service",
      "Monthly community outreach",
      "Quarterly retreats and camps",
      "Career and life skills seminars",
      "Sports and recreational events",
    ],
    events: [
      { title: "Singles Fellowship Night", date: "Apr 11, 2026", time: "6:00 PM", location: "Fellowship Hall", type: "Fellowship", description: "A fun evening of games, sharing, and fellowship for all singles and young adults. Theme: 'Rooted and Grounded in Love.'" },
      { title: "Purpose Discovery Workshop", date: "May 2, 2026", time: "9:00 AM", location: "Room 3, ABCMI", type: "Training", description: "A half-day workshop helping singles discover their God-given purpose and calling in this season of their lives." },
    ],
  },
  {
    id: 4,
    slug: "youth-ministry",
    name: "Youth Ministry (ABCMI Youth)",
    description: "Empowering young people to live out their faith and become leaders for Christ. We build young disciples through relevant teaching and fellowship.",
    longDescription: "ABCMI Youth is a vibrant community of young people passionate about following Jesus and making a difference in their generation. We believe that young people are not just the future of the church — they are the church today. Through relevant weekly teachings, discipleship groups, camps, and outreach programs, we equip young people to live out their faith in their schools, homes, and communities. Our heart is to see every young person in ABCMI become a fully devoted disciple of Jesus Christ.",
    icon: Flame,
    color: "bg-emerald-500",
    colorHex: "#10b981",
    leader: "Ptr. Emannuel Marbella",
    coLeader: "Sis. Joy Bernardo",
    meetingTime: "Fridays, 6:00 PM",
    members: 45,
    location: "Youth Room, ABCMI Main Church",
    contact: "youth@abcmi.org",
    activities: [
      "Weekly Friday night youth service",
      "Monthly youth outreach in schools and communities",
      "Annual youth camp",
      "Youth discipleship groups (D-groups)",
      "Youth leadership training",
    ],
    events: [
      { title: "Youth Camp 2026", date: "May 10, 2026", time: "8:00 AM", location: "Camp John Hay, Baguio", type: "Retreat", description: "A 3-day overnight camp for all youth members. Theme: 'Rooted: Growing Deep in Christ.' Activities include worship nights, team building, outdoor activities, and discipleship sessions." },
      { title: "Youth Outreach", date: "Apr 18, 2026", time: "9:00 AM", location: "Burnham Park, Baguio", type: "Outreach", description: "An afternoon of street evangelism, games, and sharing the Gospel to youth and children in Burnham Park." },
      { title: "Friday Youth Night", date: "Apr 4, 2026", time: "6:00 PM", location: "Youth Room, ABCMI", type: "Service", description: "Weekly youth service. Guest speaker: Bro. Ian Reyes. Topic: 'Your Identity in Christ.'" },
    ],
  },
  {
    id: 5,
    slug: "mens-ministry",
    name: "Men's Ministry",
    description: "Building godly men through accountability, Bible study, and fellowship. We encourage men to lead their families and serve the church.",
    longDescription: "The Men's Ministry of ABCMI is dedicated to raising up men of God who are strong in faith, integrity, and servant-leadership. We provide a safe and supportive environment for men to grow spiritually, build genuine friendships, and sharpen each other through accountability and prayer. Our programs include early morning prayer and Bible study, men's retreats, leadership training, and family life seminars. We believe that when men are strengthened in their walk with God, families and communities are transformed.",
    icon: Users,
    color: "bg-indigo-500",
    colorHex: "#6366f1",
    leader: "Ptr. Julio Coyoy",
    coLeader: "Bro. Ramon Flores",
    meetingTime: "Saturdays, 6:00 AM",
    members: 29,
    location: "Main Sanctuary, ABCMI Main Church",
    contact: "mensministry@abcmi.org",
    activities: [
      "Weekly Saturday morning prayer and Bible study (6 AM)",
      "Monthly men's breakfast and fellowship",
      "Quarterly men's retreat",
      "Annual men's convention",
      "Family life and marriage enrichment seminars",
    ],
    events: [],
  },
  {
    id: 6,
    slug: "womens-ministry",
    name: "Women's Ministry",
    description: "Nurturing women in their faith journey through Bible study, prayer, and mutual support. We build strong, godly women for Christ.",
    longDescription: "The Women's Ministry of ABCMI is a community of women committed to growing together in faith, love, and purpose. We create a safe and encouraging environment where women can be transparent, support one another, and discover their God-given identity and calling. Through weekly gatherings, conferences, and community outreach programs, we equip women to be lights in their homes, workplaces, and communities. Every woman, regardless of age or background, has a place and purpose in our ministry.",
    icon: Heart,
    color: "bg-rose-500",
    colorHex: "#f43f5e",
    leader: "Ptr. Mirriam Anno",
    coLeader: "Sis. Rachel Bautista",
    meetingTime: "Saturdays, 9:00 AM",
    members: 41,
    location: "Room 2, ABCMI Main Church",
    contact: "womensministry@abcmi.org",
    activities: [
      "Weekly Saturday morning Bible study (9 AM)",
      "Monthly women's prayer breakfast",
      "Quarterly women's conference",
      "Livelihood and skills training programs",
      "Community outreach to women in need",
    ],
    events: [],
  },
  {
    id: 7,
    slug: "childrens-ministry",
    name: "Children's Ministry",
    description: "Teaching children the Word of God in fun and engaging ways. We lay the foundation of faith in young hearts through creative lessons.",
    longDescription: "The Children's Ministry of ABCMI is passionate about teaching children about the love of God in creative, age-appropriate, and engaging ways. We believe that faith planted in a child's heart in their early years will bear fruit for a lifetime. Our dedicated team of teachers and volunteers use stories, songs, games, crafts, and multimedia to make the Bible come alive for children. We partner with parents in raising up children who love God and love others.",
    icon: Baby,
    color: "bg-orange-500",
    colorHex: "#f97316",
    leader: "Ptr. Divina Dangilan",
    coLeader: "Sis. Lovely Cruz",
    meetingTime: "Sundays during service",
    members: 52,
    location: "Children's Room, ABCMI Main Church",
    contact: "childrens@abcmi.org",
    activities: [
      "Sunday school every Sunday during main service",
      "Weekly Vacation Bible School (summer)",
      "Children's Christmas presentation",
      "Monthly fun activities and crafts",
      "Children's Day celebration",
    ],
    events: [],
  },
  {
    id: 8,
    slug: "health-ministry",
    name: "Health Ministry",
    description: "Caring for the physical well-being of our community as an extension of Christ's love. We provide health education and assistance.",
    longDescription: "The Health Ministry of ABCMI extends the healing ministry of Jesus Christ by providing practical health services and education to the church community and surrounding neighborhoods. Composed of medical professionals, health workers, and trained volunteers, our ministry conducts free medical missions, health education seminars, and first aid training. We believe that caring for the physical body is an important expression of God's love and a powerful tool for sharing the Gospel with those who are hurting.",
    icon: Stethoscope,
    color: "bg-teal-500",
    colorHex: "#14b8a6",
    leader: "Ptr. Rosel Montero",
    coLeader: "Dr. Patricia Lim",
    meetingTime: "Monthly health programs",
    location: "ABCMI Outreach Centers",
    members: 18,
    contact: "health@abcmi.org",
    activities: [
      "Monthly free medical missions in partner communities",
      "Quarterly dental and eye care missions",
      "Annual health fair",
      "First aid and basic life support training",
      "Health education seminars for church members",
    ],
    events: [],
  },
  {
    id: 9,
    slug: "missions-evangelism",
    name: "Missions and Evangelism Ministry",
    description: "Spreading the Gospel locally and globally through church planting, outreach programs, and mission trips to unreached peoples.",
    longDescription: "The Missions and Evangelism Ministry of ABCMI carries the heartbeat of our church — to reach the lost for Christ. We are committed to the Great Commission, both locally and globally, by training, sending, and supporting missionaries and evangelists. We partner with local churches and international mission organizations to plant new churches, conduct evangelistic outreaches, and provide relief and development assistance to vulnerable communities. Every member of ABCMI is called to be a missionary in their sphere of influence.",
    icon: Globe,
    color: "bg-[var(--church-primary)]",
    colorHex: "var(--church-primary)",
    leader: "Ptr. Ysrael Coyoy",
    coLeader: "Ptr. Frederick Dangilan",
    meetingTime: "Monthly planning meetings",
    members: 33,
    location: "ABCMI Main Church & Partner Churches",
    contact: "missions@abcmi.org",
    activities: [
      "Monthly evangelism outreaches in unreached communities",
      "Annual missions training seminar",
      "Short-term mission trips",
      "Church planting support",
      "Prayer for missionaries and mission fields",
    ],
    events: [
      { title: "Mission Training Seminar", date: "Apr 25, 2026", time: "9:00 AM", location: "Fellowship Hall", type: "Training", description: "A full-day seminar for aspiring and current missionaries covering cross-cultural communication, church planting principles, and practical evangelism methods." },
      { title: "Baguio City Evangelism Day", date: "May 8, 2026", time: "8:00 AM", location: "Various locations, Baguio City", type: "Outreach", description: "A city-wide evangelism event where all branches will simultaneously conduct street evangelism, tract distribution, and community prayer walks." },
    ],
  },
  {
    id: 10,
    slug: "discipleship-group",
    name: "Discipleship Group",
    description: "Growing deeper in faith through intentional Bible study and one-on-one mentorship. We make disciples who make disciples.",
    longDescription: "The Discipleship Group Ministry of ABCMI is built on the conviction that every believer needs to be intentionally discipled and, in turn, disciple others. We provide a structured yet relational framework for spiritual growth through weekly small groups, one-on-one mentoring, and discipleship courses. Our D-Groups are organized by age, gender, and life stage to ensure relevant and meaningful discipleship. We believe that true transformation happens in the context of authentic community, regular Scripture engagement, and mutual accountability.",
    icon: BookOpen,
    color: "bg-indigo-500",
    colorHex: "#6366f1",
    leader: "Ptr. Marvin Anno",
    coLeader: "Bro. Stephen Reyes",
    meetingTime: "Weekly small groups",
    members: 27,
    location: "Various home venues",
    contact: "discipleship@abcmi.org",
    activities: [
      "Weekly small group meetings in homes",
      "Monthly combined discipleship gathering",
      "Quarterly discipleship training for group leaders",
      "Annual discipleship camp",
      "One-on-one mentoring pairs",
    ],
    events: [],
  },
  {
    id: 11,
    slug: "counseling-ministry",
    name: "Counseling Ministry",
    description: "Providing spiritual and emotional support through confidential counseling sessions. We walk alongside those in need with compassion.",
    longDescription: "The Counseling Ministry of ABCMI offers a safe, confidential, and compassionate environment for individuals and families facing emotional, relational, and spiritual challenges. Our trained counselors and pastors provide biblically-grounded counseling that addresses the whole person — mind, body, and spirit. We believe that healing and restoration are available to all through the grace of God and the support of a caring community. All sessions are strictly confidential, and referrals to professional mental health services are available when needed.",
    icon: MessageCircle,
    color: "bg-teal-500",
    colorHex: "#14b8a6",
    leader: "Ptr. Josie Perilla-Cayto",
    coLeader: "Sis. Maria Fe Teneza",
    meetingTime: "By appointment",
    members: 8,
    location: "Counseling Room, ABCMI Main Church",
    contact: "counseling@abcmi.org",
    activities: [
      "Individual counseling sessions by appointment",
      "Couples and family counseling",
      "Grief support groups",
      "Pre-marital counseling",
      "Mental health awareness seminars",
    ],
    events: [],
  },
]

const eventTypeColors: Record<string, string> = {
  Training: "bg-blue-500/10 text-blue-600",
  Service: "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Retreat: "bg-emerald-500/10 text-emerald-600",
  Outreach: "bg-rose-500/10 text-rose-600",
  Fellowship: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Special: "bg-purple-500/10 text-purple-600",
}

export function generateStaticParams() {
  return ministries.map((m) => ({ slug: m.slug }))
}

export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ministry = ministries.find((m) => m.slug === slug)
  if (!ministry) notFound()

  const Icon = ministry.icon

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20" style={{ background: `linear-gradient(135deg, ${ministry.colorHex === "var(--church-primary)" ? "#2563eb" : ministry.colorHex} 0%, #1e1b4b 100%)` }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Link href="/ministries" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Ministries
            </Link>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl lg:text-5xl font-bold mb-3 text-balance">{ministry.name}</h1>
                <p className="text-white/90 text-lg max-w-2xl text-pretty">{ministry.description}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{ministry.members} members</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{ministry.meetingTime}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{ministry.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Left - About */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">About This Ministry</h2>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{ministry.longDescription}</p>
                </CardContent>
              </Card>

              {/* Activities */}
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Regular Activities</h2>
                  <ul className="space-y-3">
                    {ministry.activities.map((activity, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[var(--church-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        <span className="text-muted-foreground text-sm leading-relaxed">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Events */}
              {ministry.events.length > 0 && (
                <Card className="bg-background border-none shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Events</h2>
                    <div className="space-y-4">
                      {ministry.events.map((event, i) => (
                        <div key={i} className="border border-border rounded-xl p-5 hover:border-[var(--church-primary)] transition-colors">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="font-bold text-foreground text-lg">{event.title}</h3>
                            <Badge className={`flex-shrink-0 ${eventTypeColors[event.type] || "bg-muted text-muted-foreground"}`}>
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-[var(--church-primary)]" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-[var(--church-primary)]" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-[var(--church-primary)]" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right - Sidebar */}
            <div className="space-y-6">
              {/* Leadership */}
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Ministry Leadership</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-[var(--church-primary)]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ministry Leader</p>
                        <p className="font-semibold text-foreground text-sm">{ministry.leader}</p>
                      </div>
                    </div>
                    {ministry.coLeader && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--church-gold)]/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-[var(--church-gold)]" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Co-Leader</p>
                          <p className="font-semibold text-foreground text-sm">{ministry.coLeader}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Meeting Schedule</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[var(--church-primary)] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{ministry.meetingTime}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[var(--church-primary)] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{ministry.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Join CTA */}
              <Card className="bg-[var(--church-primary)] border-none shadow-lg text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Join This Ministry</h3>
                  <p className="text-white/80 text-sm mb-4 text-pretty">
                    Interested in serving with us? We would love to have you on the team!
                  </p>
                  <Link href="/register">
                    <Button className="w-full bg-white text-[var(--church-primary)] hover:bg-white/90 font-semibold">
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* All Ministries */}
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-3">Explore Other Ministries</h3>
                  <Link href="/ministries">
                    <Button variant="outline" className="w-full border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white">
                      View All Ministries
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
