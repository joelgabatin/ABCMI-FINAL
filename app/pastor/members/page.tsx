"use client"

import { useState } from "react"
import {
  Users, Search, UserCheck, UserX, Eye, Mail, Phone,
  Calendar, Check, X, Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Member {
  id: number
  name: string
  email: string
  phone: string
  address: string
  joinedDate: string
  status: "active" | "pending" | "inactive"
  birthday: string
  ministry: string
  notes: string
}

const initialMembers: Member[] = [
  { id: 1, name: "Anna Bautista", email: "anna@example.com", phone: "+63 912 555 5555", address: "Camp 8, Baguio City", joinedDate: "2024-01-20", status: "active", birthday: "1992-04-15", ministry: "Worship Team", notes: "Very active in weekend services." },
  { id: 2, name: "Pedro Villanueva", email: "pedro@example.com", phone: "+63 912 666 6666", address: "Camp 8, Baguio City", joinedDate: "2024-02-28", status: "pending", birthday: "1988-09-03", ministry: "Usher", notes: "Registered online. Awaiting acceptance." },
  { id: 3, name: "Lena Torres", email: "lena@example.com", phone: "+63 912 777 1111", address: "Camp 7, Baguio City", joinedDate: "2024-01-05", status: "active", birthday: "1995-12-22", ministry: "Children's Ministry", notes: "Leads Sunday school." },
  { id: 4, name: "Ramon Cruz", email: "ramon@example.com", phone: "+63 912 888 2222", address: "Camp 8, Baguio City", joinedDate: "2024-03-10", status: "pending", birthday: "1990-07-18", ministry: "None yet", notes: "New convert. Referred by Anna B." },
  { id: 5, name: "Joy Salazar", email: "joy@example.com", phone: "+63 912 999 3333", address: "Camp 8, Baguio City", joinedDate: "2023-11-15", status: "active", birthday: "1987-02-10", ministry: "Intercessory Prayer", notes: "Prayer group coordinator." },
  { id: 6, name: "Benito Aquino", email: "benito@example.com", phone: "+63 912 000 4444", address: "Baguio City", joinedDate: "2024-03-20", status: "pending", birthday: "1993-06-30", ministry: "None yet", notes: "Attended two services before registering." },
  { id: 7, name: "Cristina Flores", email: "cristina@example.com", phone: "+63 912 111 5555", address: "Camp 8, Baguio City", joinedDate: "2023-08-01", status: "active", birthday: "1985-11-25", ministry: "Media Team", notes: "Manages livestream." },
  { id: 8, name: "Dante Ramos", email: "dante@example.com", phone: "+63 912 222 6666", address: "Baguio City", joinedDate: "2022-05-12", status: "inactive", birthday: "1980-03-14", ministry: "Men's Fellowship", notes: "Transferred to another branch." },
]

export default function PastorMembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [search, setSearch] = useState("")
  const [viewMember, setViewMember] = useState<Member | null>(null)
  const [confirmId, setConfirmId] = useState<{ id: number; action: "accept" | "reject" } | null>(null)

  const acceptMember = (id: number) => setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "active" } : m))
  const rejectMember = (id: number) => setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "inactive" } : m))

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  const filtered = (status: Member["status"] | "all") =>
    members
      .filter(m => status === "all" || m.status === status)
      .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))

  const pendingCount = members.filter(m => m.status === "pending").length

  const statusBadge = (status: Member["status"]) => {
    if (status === "active") return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
    if (status === "pending") return <Badge className="bg-[var(--church-gold)]/15 text-[var(--church-gold)] border-[var(--church-gold)]/30">Pending</Badge>
    return <Badge variant="secondary">Inactive</Badge>
  }

  const MemberCard = ({ member }: { member: Member }) => (
    <Card className={`hover:shadow-md transition-shadow ${member.status === "pending" ? "border-[var(--church-gold)]/40" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-medium text-foreground">{member.name}</p>
              {statusBadge(member.status)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{member.email}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{member.phone}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />Joined: {member.joinedDate}</p>
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setViewMember(member)}>
              <Eye className="w-4 h-4" />
            </Button>
            {member.status === "pending" && (
              <>
                <Button size="icon" className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setConfirmId({ id: member.id, action: "accept" })}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-8 h-8 border-destructive text-destructive hover:bg-destructive/10" onClick={() => setConfirmId({ id: member.id, action: "reject" })}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout variant="pastor">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Branch Members</h1>
          <p className="text-muted-foreground mt-1">View, accept, and manage members of Camp 8 Branch.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Members", value: members.filter(m => m.status === "active").length, color: "text-[var(--church-primary)]", bg: "bg-[var(--church-primary)]/10", icon: Users },
            { label: "Pending Requests", value: pendingCount, color: "text-[var(--church-gold)]", bg: "bg-[var(--church-gold)]/15", icon: UserCheck },
            { label: "Inactive", value: members.filter(m => m.status === "inactive").length, color: "text-muted-foreground", bg: "bg-muted", icon: UserX },
            { label: "Total Registered", value: members.length, color: "text-emerald-600", bg: "bg-emerald-500/10", icon: Filter },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="gap-2">
              <UserCheck className="w-4 h-4" /> Pending Requests
              {pendingCount > 0 && <Badge className="ml-1 bg-rose-500 text-white text-xs px-1.5 py-0">{pendingCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2"><Users className="w-4 h-4" /> Active Members</TabsTrigger>
            <TabsTrigger value="all" className="gap-2">All</TabsTrigger>
          </TabsList>

          {(["pending", "active", "all"] as const).map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="grid md:grid-cols-2 gap-4">
                {filtered(tab).map(member => <MemberCard key={member.id} member={member} />)}
                {filtered(tab).length === 0 && (
                  <div className="col-span-full">
                    <Card><CardContent className="p-12 text-center text-muted-foreground">No members found.</CardContent></Card>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* View Member Dialog */}
        <Dialog open={!!viewMember} onOpenChange={() => setViewMember(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Member Profile</DialogTitle>
              <DialogDescription>Detailed information for this branch member.</DialogDescription>
            </DialogHeader>
            {viewMember && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-lg font-bold">
                      {getInitials(viewMember.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{viewMember.name}</h3>
                    {statusBadge(viewMember.status)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Email", value: viewMember.email },
                    { label: "Phone", value: viewMember.phone },
                    { label: "Address", value: viewMember.address },
                    { label: "Birthday", value: viewMember.birthday },
                    { label: "Joined", value: viewMember.joinedDate },
                    { label: "Ministry", value: viewMember.ministry },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-muted-foreground text-xs">{f.label}</p>
                      <p className="text-foreground font-medium">{f.value}</p>
                    </div>
                  ))}
                </div>
                {viewMember.notes && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-foreground">{viewMember.notes}</p>
                  </div>
                )}
                {viewMember.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                      onClick={() => { acceptMember(viewMember.id); setViewMember(null) }}>
                      <Check className="w-4 h-4" /> Accept Member
                    </Button>
                    <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10 gap-2"
                      onClick={() => { rejectMember(viewMember.id); setViewMember(null) }}>
                      <X className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Dialog */}
        <AlertDialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmId?.action === "accept" ? "Accept Member?" : "Reject Member?"}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmId?.action === "accept"
                  ? "This will mark the member as active in your branch."
                  : "This will mark the registration as rejected. The member will be set to inactive."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={confirmId?.action === "accept" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-destructive hover:bg-destructive/90 text-white"}
                onClick={() => {
                  if (!confirmId) return
                  confirmId.action === "accept" ? acceptMember(confirmId.id) : rejectMember(confirmId.id)
                  setConfirmId(null)
                }}>
                {confirmId?.action === "accept" ? "Yes, Accept" : "Yes, Reject"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  )
}
