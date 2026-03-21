'use client'

import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface PastoralMember {
  id: string
  name: string
  title: string
  image: string
  locations?: string[]
}

interface ChurchLocation {
  name: string
  pastors: string[]
}

const pastoralTeam: PastoralMember[] = [
  {
    id: "1",
    name: "Ptr. Ysrael",
    title: "Senior Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
    locations: ["ABCMI Main Church, East Quirino Hill, Baguio City"]
  },
  {
    id: "2",
    name: "Ptr. Ernesto",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "3",
    name: "Ptr. Julio",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
    locations: ["Camp 8, Baguio City"]
  },
  {
    id: "4",
    name: "Ptr. Fhey",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "5",
    name: "Ptr. Doming",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
    locations: ["KIAS, Baguio City"]
  },
  {
    id: "6",
    name: "Ptr. Gerry",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "7",
    name: "Ptr. Gerry",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "8",
    name: "Ptr. Frederick",
    title: "District Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
    locations: ["Dalic, Bontoc, Mt. Province"]
  },
  {
    id: "9",
    name: "Ptr. Divina",
    title: "Pastora",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "10",
    name: "Ptr. Dacanay",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
    locations: ["Lower Decoliat, Alfonso Castaneda, Nueva Vizcaya"]
  },
  {
    id: "11",
    name: "Ptr. Marvin",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "12",
    name: "Ptr. Mirriam",
    title: "Pastora",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "13",
    name: "Ptr. Rosel",
    title: "Pastora",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
    locations: ["San Juan, Abra"]
  },
  {
    id: "14",
    name: "Ptr. Billy",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
    locations: ["Ansagan, Tuba, Benguet"]
  },
  {
    id: "15",
    name: "Ptr. Josie",
    title: "Pastora",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "16",
    name: "Ptr. Rolando",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "17",
    name: "Ptr. Maria Fe",
    title: "Pastora",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "18",
    name: "Ptr. Isidra",
    title: "Pastora",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
  },
  {
    id: "19",
    name: "Ptr. Emannuel",
    title: "Associate Pastor",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ABMC%20%288%29-Pb17hmyQPnbt2uns7ha1pdbtec5Jg1.jpg",
    locations: ["Vientiane, Laos"]
  }
]

const churchLocations: ChurchLocation[] = [
  {
    name: "ABCMI Main Church, East Quirino Hill, Baguio City",
    pastors: ["Ptr. Ysrael Coyoy", "Ptr. Fhey Coyoy"]
  },
  {
    name: "Camp 8, Baguio City",
    pastors: ["Ptr. Julio Coyoy"]
  },
  {
    name: "San Carlos, Baguio City",
    pastors: ["Ptr. Ernesto Paleyan"]
  },
  {
    name: "KIAS, Baguio City",
    pastors: ["Ptr. Domingo Coyoy"]
  },
  {
    name: "Patiacan, Quirino, Ilocos Sur",
    pastors: ["Ptr. Dionisio Balangyao"]
  },
  {
    name: "Villa Conchita, Manabo, Abra",
    pastors: ["Ptr. Elmo Salingbay", "Ptr. Isidra Pait", "Ptr. Josie Perilla-Cayto"]
  },
  {
    name: "Casacgudan, Manabo, Abra",
    pastors: ["Ptr. Maria Fe Teneza", "Ptr. Rolando Teneza", "Ptr. Gerry Teneza"]
  },
  {
    name: "San Juan, Abra",
    pastors: ["Ptr. Rosel Montero"]
  },
  {
    name: "Dianawan, Maria Aurora, Aurora",
    pastors: ["Ptr. Marvin Anno", "Ptr. Mirriam Anno"]
  },
  {
    name: "Lower Decoliat, Alfonso Castaneda, Nueva Vizcaya",
    pastors: ["Ptr. Dacanay Isidre", "Ptr. Perlita Hangdaan", "Ptr. Marites Ngateb"]
  },
  {
    name: "Dalic, Bontoc, Mt. Province",
    pastors: ["Ptr. Frederick Dangilan", "Ptr. Divina Dangilan"]
  },
  {
    name: "Ansagan, Tuba, Benguet",
    pastors: ["Ptr. Billy Antero"]
  },
  {
    name: "Vientiane, Laos",
    pastors: ["Ptr. Emannuel Marbella"]
  }
]

export default function PastoralTeamPage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Pastoral Team</h1>
            <p className="text-xl text-white/90">
              Meet the dedicated pastors and pastoras who shepherd our church family with love and faith.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-12 text-center">
              Leadership Team
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {pastoralTeam.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="relative aspect-square mb-4 rounded-lg overflow-hidden border-2 border-[var(--church-primary)] shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm lg:text-base text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Church Locations & Assignments */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-12 text-center">
              Church Locations & Pastoral Assignments
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {churchLocations.map((location, index) => (
                <Card key={index} className="bg-background border-none shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-[var(--church-primary)] mb-4">
                      ▸ {location.name}
                    </h3>
                    <div className="space-y-2">
                      {location.pastors.map((pastor, i) => (
                        <p key={i} className="text-foreground text-sm flex items-start">
                          <span className="text-[var(--church-primary)] mr-2">•</span>
                          <span className="italic">{pastor}</span>
                        </p>
                      ))}
                    </div>
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
