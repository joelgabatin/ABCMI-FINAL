import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Music, 
  Sparkles, 
  Users, 
  Heart, 
  UserCircle,
  Baby,
  Stethoscope,
  Globe,
  BookOpen,
  MessageCircle,
  ArrowRight
} from "lucide-react"

const ministries = [
  {
    name: "Music Ministry",
    description: "Leading the congregation in worship through music and song. We glorify God with our voices and instruments, creating an atmosphere of praise.",
    icon: Music,
    color: "bg-[var(--church-primary)]",
    leader: "Ministry Head",
    meetingTime: "Saturdays, 4:00 PM",
  },
  {
    name: "Dance Ministry",
    description: "Expressing worship through movement and dance. We use the art of dance to praise God and minister to the congregation.",
    icon: Sparkles,
    color: "bg-pink-500",
    leader: "Ministry Head",
    meetingTime: "Saturdays, 3:00 PM",
  },
  {
    name: "Singles and Adults Ministry",
    description: "Connecting single adults and mature members through fellowship, Bible study, and community service.",
    icon: Users,
    color: "bg-[var(--church-gold)]",
    leader: "Ministry Head",
    meetingTime: "Sundays after service",
  },
  {
    name: "Youth Ministry",
    description: "Empowering young people to live out their faith and become leaders for Christ. We build young disciples through relevant teaching and fellowship.",
    icon: UserCircle,
    color: "bg-emerald-500",
    leader: "Ministry Head",
    meetingTime: "Fridays, 6:00 PM",
  },
  {
    name: "Men's Ministry",
    description: "Building godly men through accountability, Bible study, and fellowship. We encourage men to lead their families and serve the church.",
    icon: Users,
    color: "bg-[var(--church-primary-deep)]",
    leader: "Ministry Head",
    meetingTime: "Saturdays, 6:00 AM",
  },
  {
    name: "Women's Ministry",
    description: "Nurturing women in their faith journey through Bible study, prayer, and mutual support. We build strong, godly women.",
    icon: Heart,
    color: "bg-rose-500",
    leader: "Ministry Head",
    meetingTime: "Saturdays, 9:00 AM",
  },
  {
    name: "Children's Ministry",
    description: "Teaching children the Word of God in fun and engaging ways. We lay the foundation of faith in young hearts.",
    icon: Baby,
    color: "bg-orange-500",
    leader: "Ministry Head",
    meetingTime: "Sundays during service",
  },
  {
    name: "Health Ministry",
    description: "Caring for the physical well-being of our community as an extension of Christ's love. We provide health education and assistance.",
    icon: Stethoscope,
    color: "bg-red-500",
    leader: "Ministry Head",
    meetingTime: "Monthly health programs",
  },
  {
    name: "Missions and Evangelism Ministry",
    description: "Spreading the Gospel locally and globally through church planting, outreach programs, and mission trips.",
    icon: Globe,
    color: "bg-[var(--church-primary)]",
    leader: "Ministry Head",
    meetingTime: "Monthly planning meetings",
  },
  {
    name: "Discipleship Group",
    description: "Growing deeper in faith through intentional Bible study and one-on-one mentorship. We make disciples who make disciples.",
    icon: BookOpen,
    color: "bg-indigo-500",
    leader: "Ministry Head",
    meetingTime: "Weekly small groups",
  },
  {
    name: "Counseling Ministry",
    description: "Providing spiritual and emotional support through confidential counseling sessions. We walk alongside those in need.",
    icon: MessageCircle,
    color: "bg-teal-500",
    leader: "Ministry Head",
    meetingTime: "By appointment",
  },
]

export default function MinistriesPage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Ministries</h1>
            <p className="text-xl text-white/90">
              Discover your place in our church family. We have ministries for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministries.map((ministry, index) => (
                <Card key={index} className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-xl ${ministry.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <ministry.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-foreground group-hover:text-[var(--church-primary)] transition-colors">
                      {ministry.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {ministry.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Leader:</span>
                        <span className="font-medium text-foreground">{ministry.leader}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Meeting:</span>
                        <span className="font-medium text-foreground">{ministry.meetingTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Serve?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We believe everyone has a unique gift to contribute to the body of Christ. 
              Join a ministry today and discover how you can make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white w-full sm:w-auto">
                  Become a Member
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/counseling">
                <Button size="lg" variant="outline" className="border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white w-full sm:w-auto">
                  Talk to a Pastor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
