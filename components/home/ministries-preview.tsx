import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Music, Users, Heart, BookOpen, Globe, Stethoscope } from "lucide-react"

const ministries = [
  {
    name: "Music Ministry",
    description: "Leading worship through music and song, bringing glory to God in every service.",
    icon: Music,
    color: "bg-[var(--church-primary)]",
  },
  {
    name: "Youth Ministry",
    description: "Empowering young people to live out their faith and become leaders for Christ.",
    icon: Users,
    color: "bg-[var(--church-gold)]",
  },
  {
    name: "Women's Ministry",
    description: "Building strong, faith-filled women through fellowship, study, and service.",
    icon: Heart,
    color: "bg-pink-500",
  },
  {
    name: "Discipleship Group",
    description: "Growing deeper in faith through intentional Bible study and mentorship.",
    icon: BookOpen,
    color: "bg-[var(--church-primary-deep)]",
  },
  {
    name: "Missions & Evangelism",
    description: "Spreading the Gospel locally and globally through church planting and outreach.",
    icon: Globe,
    color: "bg-emerald-500",
  },
  {
    name: "Health Ministry",
    description: "Caring for the physical well-being of our community as an extension of Christ's love.",
    icon: Stethoscope,
    color: "bg-red-500",
  },
]

export function MinistriesPreview() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">Get Involved</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
              Our Ministries
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover your place in our church family. We have ministries for everyone, from children to adults, music to missions.
            </p>
          </div>

          {/* Ministry Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {ministries.map((ministry) => (
              <Card key={ministry.name} className="group bg-background border border-border hover:border-[var(--church-primary)] hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${ministry.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <ministry.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-[var(--church-primary)] transition-colors">
                    {ministry.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {ministry.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/ministries">
              <Button variant="outline" className="border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white">
                View All Ministries
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
