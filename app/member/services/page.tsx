"use client"

import { useState } from "react"
import { Clock, MapPin, Church, Users, Calendar, Search, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface ServiceSchedule {
  id: number
  branchId: number
  day: string
  time: string
  type: string
  description: string
}

interface Branch {
  id: number
  name: string
  location: string
  region: string
  pastors: string[]
  memberCount: number
}

const branches: Branch[] = [
  { id: 1, name: "ABCMI Main Church", location: "East Quirino Hill, Baguio City", region: "CAR", pastors: ["Ptr. Ysrael Coyoy", "Ptr. Fhey Coyoy"], memberCount: 245 },
  { id: 2, name: "Camp 8 Branch", location: "Camp 8, Baguio City", region: "CAR", pastors: ["Ptr. Julio Coyoy"], memberCount: 87 },
  { id: 3, name: "San Carlos Branch", location: "San Carlos, Baguio City", region: "CAR", pastors: ["Ptr. Ernesto Paleyan"], memberCount: 64 },
  { id: 4, name: "Kias Branch", location: "Kias, Baguio City", region: "CAR", pastors: ["Ptr. Domingo Coyoy"], memberCount: 53 },
  { id: 5, name: "Patiacan Branch", location: "Patiacan, Quirino, Ilocos Sur", region: "Region I", pastors: ["Ptr. Dionisio Balangyao"], memberCount: 41 },
  { id: 6, name: "Villa Conchita Branch", location: "Villa Conchita, Manabo, Abra", region: "CAR", pastors: ["Ptr. Elmo Salingbay", "Ptr. Isidra Pait", "Ptr. Josie Perilla-Cayto"], memberCount: 78 },
  { id: 7, name: "Casacgudan Branch", location: "Casacgudan, Manabo, Abra", region: "CAR", pastors: ["Ptr. Maria Fe Teneza", "Ptr. Rolando Teneza", "Ptr. Gerry Teneza"], memberCount: 92 },
  { id: 8, name: "San Juan Branch", location: "San Juan, Abra", region: "CAR", pastors: ["Ptr. Rosel Montero"], memberCount: 35 },
  { id: 9, name: "Dianawan Branch", location: "Dianawan, Maria Aurora, Aurora", region: "Region III", pastors: ["Ptr. Marvin Anno", "Ptr. Mirriam Anno"], memberCount: 48 },
  { id: 10, name: "Lower Decoliat Branch", location: "Lower Decoliat, Alfonso Castaneda, Nueva Vizcaya", region: "Region II", pastors: ["Ptr. Dacanay Isidre"], memberCount: 31 },
  { id: 11, name: "Dalic Branch", location: "Dalic, Bontoc, Mt. Province", region: "CAR", pastors: ["Ptr. Frederick Dangilan", "Ptr. Divina Dangilan"], memberCount: 56 },
  { id: 12, name: "Ansagan Branch", location: "Ansagan, Tuba, Benguet", region: "CAR", pastors: ["Ptr. Billy Antero"], memberCount: 44 },
  { id: 13, name: "Vientiane Mission", location: "Vientiane, Laos", region: "International", pastors: ["Ptr. Emannuel Marbella"], memberCount: 22 },
]

const schedules: ServiceSchedule[] = [
  { id: 1, branchId: 1, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Main worship service with praise and sermon" },
  { id: 2, branchId: 1, day: "Wednesday", time: "7:00 PM", type: "Bible Study", description: "Midweek Bible study and prayer meeting" },
  { id: 3, branchId: 1, day: "Friday", time: "6:00 PM", type: "Youth Fellowship", description: "Youth praise and fellowship" },
  { id: 4, branchId: 2, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Morning worship service" },
  { id: 5, branchId: 2, day: "Thursday", time: "6:30 PM", type: "Bible Study", description: "Weekly Bible study" },
  { id: 6, branchId: 3, day: "Sunday", time: "8:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 7, branchId: 4, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Sunday morning service" },
  { id: 8, branchId: 4, day: "Tuesday", time: "7:00 PM", type: "Prayer Meeting", description: "Corporate prayer and intercession" },
  { id: 9, branchId: 5, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Morning service" },
  { id: 10, branchId: 6, day: "Sunday", time: "8:00 AM", type: "Sunday Worship", description: "Early morning worship" },
  { id: 11, branchId: 6, day: "Friday", time: "7:00 PM", type: "Cell Group", description: "Home cell group meetings" },
  { id: 12, branchId: 7, day: "Sunday", time: "9:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 13, branchId: 8, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Sunday service" },
  { id: 14, branchId: 9, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Morning worship" },
  { id: 15, branchId: 10, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "Weekly service" },
  { id: 16, branchId: 11, day: "Sunday", time: "9:00 AM", type: "Sunday Worship", description: "Sunday service" },
  { id: 17, branchId: 12, day: "Sunday", time: "8:30 AM", type: "Sunday Worship", description: "Worship service" },
  { id: 18, branchId: 13, day: "Sunday", time: "10:00 AM", type: "Sunday Worship", description: "International mission service" },
]

// Logged-in member's branch (simulated)
const MY_BRANCH_ID = 1

const typeColor: Record<string, string> = {
  "Sunday Worship": "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  "Bible Study": "bg-emerald-500/10 text-emerald-600",
  "Prayer Meeting": "bg-rose-500/10 text-rose-600",
  "Youth Fellowship": "bg-orange-500/10 text-orange-600",
  "Cell Group": "bg-[var(--church-gold)]/15 text-[var(--church-gold)]",
  "Fasting Prayer": "bg-purple-500/10 text-purple-600",
  "Missions Meeting": "bg-blue-500/10 text-blue-600",
}

const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function MemberServicesPage() {
  const [search, setSearch] = useState("")
  const [regionFilter, setRegionFilter] = useState("All")

  const myBranch = branches.find(b => b.id === MY_BRANCH_ID)!
  const mySchedules = schedules.filter(s => s.branchId === MY_BRANCH_ID).sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))

  const regions = ["All", ...Array.from(new Set(branches.map(b => b.region)))]

  const filteredBranches = branches.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase())
    const matchRegion = regionFilter === "All" || b.region === regionFilter
    return matchSearch && matchRegion
  })

  const BranchScheduleCard = ({ branch }: { branch: Branch }) => {
    const branchSchedules = schedules.filter(s => s.branchId === branch.id).sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
    const isMyBranch = branch.id === MY_BRANCH_ID

    return (
      <Card className={`hover:shadow-md transition-shadow ${isMyBranch ? "ring-2 ring-[var(--church-primary)]" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isMyBranch ? "bg-[var(--church-primary)]" : "bg-[var(--church-primary)]/10"}`}>
              <Church className={`w-5 h-5 ${isMyBranch ? "text-white" : "text-[var(--church-primary)]"}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-sm leading-tight">{branch.name}</CardTitle>
                {isMyBranch && (
                  <Badge className="text-xs bg-[var(--church-primary)] text-white">My Branch</Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{branch.location}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {branch.memberCount} members
            </div>
            <Badge variant="secondary" className="text-xs">{branch.region}</Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pastors</p>
            {branch.pastors.map(p => (
              <p key={p} className="text-xs text-foreground">{p}</p>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Service Schedules</p>
            {branchSchedules.length === 0 ? (
              <p className="text-xs text-muted-foreground">No schedules available</p>
            ) : (
              branchSchedules.map(s => (
                <div key={s.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/40">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">{s.day} {s.time}</span>
                      <Badge variant="secondary" className={`text-xs ${typeColor[s.type] || "bg-muted text-muted-foreground"}`}>
                        {s.type}
                      </Badge>
                    </div>
                    {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Service Schedules</h1>
          <p className="text-muted-foreground mt-1">
            View service schedules for your branch and all ABCMI branches.
          </p>
        </div>

        {/* My Branch Highlight */}
        <Card className="mb-8 border-2 border-[var(--church-primary)] bg-[var(--church-primary)]/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--church-primary)] flex items-center justify-center">
                <Church className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--church-primary)] uppercase tracking-wide">Your Branch</p>
                <CardTitle className="text-lg">{myBranch.name}</CardTitle>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{myBranch.location}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pastors</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {myBranch.pastors.map(p => (
                <Badge key={p} variant="outline" className="text-xs border-[var(--church-primary)]/30 text-[var(--church-primary)]">{p}</Badge>
              ))}
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Upcoming Services</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mySchedules.map(s => (
                <div key={s.id} className="p-3 rounded-xl bg-white border border-[var(--church-primary)]/15 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-[var(--church-primary)]" />
                    <span className="font-semibold text-sm text-foreground">{s.day}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{s.time}</span>
                  </div>
                  <Badge className={`text-xs ${typeColor[s.type] || "bg-muted text-muted-foreground"}`} variant="secondary">
                    {s.type}
                  </Badge>
                  {s.description && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.description}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Branches */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search branches or locations..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">All Branches</h2>
          <span className="text-sm text-muted-foreground">{filteredBranches.length} branches</span>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBranches.map(branch => (
            <BranchScheduleCard key={branch.id} branch={branch} />
          ))}
        </div>
      </main>
    </DashboardLayout>
  )
}
