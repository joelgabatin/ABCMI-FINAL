import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ChevronRight, GraduationCap, Globe, Award, Mic } from "lucide-react"

const highlights = [
  { label: "Trained", value: "200+", icon: GraduationCap },
  { label: "Churches Planted", value: "13", icon: Globe },
  { label: "Years Running", value: "15+", icon: Award },
  { label: "Facilitators", value: "8", icon: Mic },
]

export function MissionsTrainingSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] relative overflow-hidden">
      {/* subtle texture */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <div className="text-white">
            <Badge className="bg-[var(--church-gold)] text-[var(--church-primary-deep)] border-none mb-4 font-semibold px-3 py-1">
              Now Open for Registration
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-balance">
              Church Planting &amp; Missions Training
            </h2>
            <p className="text-white/85 text-lg mb-6 leading-relaxed text-pretty">
              An intensive one-week training to equip faithful servants to establish local and house churches — rooted in ABCMI's God-given vision to build His wall of salvation to the nations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 text-white/80 text-sm mb-8">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" /> July 14–21, 2025
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" /> Baguio City + Online
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0" /> 17 slots remaining
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/missions-training">
                <Button size="lg" className="bg-[var(--church-gold)] hover:bg-yellow-500 text-[var(--church-primary-deep)] font-bold px-8 gap-2">
                  Register Now <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/missions-training#overview">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white text-center hover:bg-white/15 transition-colors"
              >
                <h.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <p className="text-3xl font-bold mb-1">{h.value}</p>
                <p className="text-white/70 text-sm">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
