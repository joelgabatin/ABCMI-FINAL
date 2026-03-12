import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart, BookOpen, Users, Shield } from "lucide-react"

const timelineEvents = [
  { year: "1984", event: "The revival began at Quirino Hill Barangay/Village." },
  { year: "1986", event: "Arise and Build For Christ Ministries was founded by Rev. Marino S. Coyoy and Elizabeth L. Coyoy. It started as a house church." },
  { year: "1990", event: "A new location and a wider worship space were provided." },
  { year: "1991", event: "A daughter church was started by Ptr. Ernesto Paleyan in Patiacan, Quirino, Ilocos Sur." },
  { year: "1992", event: "Another wider space was provided to accommodate more people." },
  { year: "1994", event: "A parcel of land was donated by Col. Hover S. Coyoy, which became a permanent place of worship. Additional pastoral team members were added." },
  { year: "1995", event: "Church planting started at Camp 8, Baguio City." },
  { year: "1997", event: "Arise and Build For Christ Ministries Inc. became the registered name under the SEC." },
  { year: "2000", event: "Church planting began at Nangobongan, San Juan, Abra." },
  { year: "2004", event: "Church planting started at Manabo, Abra through Ptr. Elmo Salingbay." },
  { year: "2007", event: "Ptr. Ysrael L. Coyoy became the resident pastor of ABCMI Quirino Hill." },
  { year: "2009", event: "Church planting started at Maria Aurora, Aurora." },
  { year: "2012", event: "Church planting began at Lower Decoliat, Alfonso Castañeda, Nueva Vizcaya." },
  { year: "2014", event: "A house church started through Bible study with the Bayanos family in San Carlos, Baguio City." },
  { year: "2015", event: "House churches started at Idogan, San Carlos (March) and Kias, Baguio City (September)." },
  { year: "2016", event: "Church planting started at Dalic, Bontoc, Mt. Province." },
  { year: "2017", event: "Church planting started at Ansagan, Tuba, Benguet." },
  { year: "2019", event: "VBS, Crusade, and Church Planting were conducted at Abas, Sallapadan, Abra." },
  { year: "2023", event: "The church adopted church planting works at Tuding, Itogon, Benguet and in Vientiane, Laos (November)." },
  { year: "2024", event: "Church planting started at Palina, Tuba, Benguet (March)." },
]

const coreValues = [
  { icon: BookOpen, title: "Biblical Foundation", description: "We hold the Bible as our ultimate authority for faith and practice." },
  { icon: Heart, title: "Love & Compassion", description: "We demonstrate Christ's love through genuine care and service." },
  { icon: Users, title: "Community", description: "We build authentic relationships and support one another." },
  { icon: Shield, title: "Integrity", description: "We live with honesty and transparency in all we do." },
]

const leaders = [
  { name: "Rev. Marino S. Coyoy", role: "Founder", description: "Founded ABCMI in 1986" },
  { name: "Elizabeth L. Coyoy", role: "Co-Founder", description: "Co-founded ABCMI in 1986" },
  { name: "Ptr. Ysrael L. Coyoy", role: "Resident Pastor", description: "Leading ABCMI Quirino Hill since 2007" },
  { name: "Ptr. Julio S. Coyoy", role: "Pastoral Team", description: "Serving since 1994" },
]

export default function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">About Our Church</h1>
            <p className="text-xl text-white/90">
              Learn about our history, mission, vision, and the values that guide us.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Statement */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-none shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-[var(--church-primary)]" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To spread the Gospel of Jesus Christ, make disciples of all nations, build a community of believers rooted in faith, hope, and love, and plant churches that will transform communities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-none shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-[var(--church-gold)]" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To see transformed lives, strong families, and thriving communities through the power of the Gospel. We envision believers rising up to build for Christ in every nation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-none shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-[var(--church-primary)]" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Statement of Faith</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit. We believe the Bible is the inspired, infallible Word of God and our guide for faith and life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">What We Stand For</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">Our Core Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <Card key={index} className="border border-border hover:border-[var(--church-primary)] transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-[var(--church-light-blue)] flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-[var(--church-primary)]" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Church History Timeline */}
      <section className="py-16 lg:py-24 bg-[var(--church-soft-gray)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[var(--church-gold)] font-semibold text-sm uppercase tracking-wider">Since 1984</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">Our Journey of Faith</h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--church-primary)]/20 -translate-x-1/2" />

              {/* Timeline Events */}
              <div className="space-y-8">
                {timelineEvents.map((item, index) => (
                  <div key={index} className={`relative flex items-start gap-6 lg:gap-12 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Timeline Dot */}
                    <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-[var(--church-primary)] border-4 border-background -translate-x-1/2 z-10" />
                    
                    {/* Content */}
                    <div className={`ml-12 lg:ml-0 lg:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'}`}>
                      <Card className="bg-background border-none shadow-md">
                        <CardContent className="p-5">
                          <span className="inline-block px-3 py-1 bg-[var(--church-primary)] text-white text-sm font-bold rounded-full mb-2">
                            {item.year}
                          </span>
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.event}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Spacer for alternating layout */}
                    <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">Our Leaders</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">Pastoral Team</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leaders.map((leader, index) => (
                <Card key={index} className="border border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--church-light-blue)] flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[var(--church-primary)]">
                      {leader.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{leader.name}</h3>
                    <p className="text-[var(--church-primary)] font-medium text-sm">{leader.role}</p>
                    <p className="text-muted-foreground text-sm mt-2">{leader.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
