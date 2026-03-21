"use client"

import { useState } from 'react'
import { Star, Send, Heart, BookOpen, ThumbsUp, ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useAuth } from '@/lib/auth-context'

const categories = ['Healing', 'Provision', 'Salvation', 'Answered Prayer', 'Deliverance', 'Restoration', 'Other']

const sampleTestimonies = [
  {
    id: 1,
    author: 'Sarah M.',
    initials: 'SM',
    category: 'Healing',
    title: 'God healed my mother from cancer',
    content: 'After months of prayer and trusting God, the doctors confirmed my mother is completely cancer-free. We give all glory to God for this miraculous healing. Thank you to the church family who prayed alongside us through this journey.',
    date: 'March 15, 2025',
    likes: 24,
    liked: false,
    expanded: false,
  },
  {
    id: 2,
    author: 'Anonymous',
    initials: 'AN',
    category: 'Provision',
    title: 'God provided a job at the right time',
    content: 'I was unemployed for 4 months and was about to lose our home. I prayed earnestly and committed the situation to God. The very next week I received not one but two job offers. God is faithful and His timing is always perfect.',
    date: 'March 10, 2025',
    likes: 18,
    liked: false,
    expanded: false,
  },
  {
    id: 3,
    author: 'Jun R.',
    initials: 'JR',
    category: 'Salvation',
    title: 'My husband accepted Christ after 10 years of prayer',
    content: 'For ten years I prayed for my husband. Last Sunday he walked down the aisle and gave his life to Jesus. Never give up on praying for your loved ones. God is still in the business of saving souls.',
    date: 'March 5, 2025',
    likes: 41,
    liked: false,
    expanded: false,
  },
  {
    id: 4,
    author: 'Mark T.',
    initials: 'MT',
    category: 'Deliverance',
    title: 'Set free from addiction',
    content: 'I struggled with addiction for over 8 years. Through the counseling ministry and the prayers of this church, God completely set me free. I am now 1 year sober and serving in the worship ministry.',
    date: 'February 28, 2025',
    likes: 35,
    liked: false,
    expanded: false,
  },
  {
    id: 5,
    author: 'Grace L.',
    initials: 'GL',
    category: 'Answered Prayer',
    title: 'Baby born healthy after a difficult pregnancy',
    content: 'Throughout my high-risk pregnancy the church prayed over my baby and me. Despite the complications, our little girl was born completely healthy. She is a living testament to the power of prayer.',
    date: 'February 20, 2025',
    likes: 52,
    liked: false,
    expanded: false,
  },
]

const categoryColors: Record<string, string> = {
  Healing: 'bg-emerald-100 text-emerald-700',
  Provision: 'bg-amber-100 text-amber-700',
  Salvation: 'bg-blue-100 text-blue-700',
  'Answered Prayer': 'bg-rose-100 text-rose-700',
  Deliverance: 'bg-purple-100 text-purple-700',
  Restoration: 'bg-cyan-100 text-cyan-700',
  Other: 'bg-gray-100 text-gray-700',
}

export default function MemberTestimonyPage() {
  const { user } = useAuth()
  const [testimonies, setTestimonies] = useState(sampleTestimonies)
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const myTestimonies = [
    {
      id: 101,
      title: 'God provided peace during a storm',
      category: 'Answered Prayer',
      date: 'January 12, 2025',
      status: 'Approved',
      likes: 9,
    },
  ]

  const filtered = filter === 'All' ? testimonies : testimonies.filter(t => t.category === filter)

  const handleLike = (id: number) => {
    setTestimonies(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 }
          : t
      )
    )
  }

  const handleExpand = (id: number) => {
    setTestimonies(prev =>
      prev.map(t => (t.id === id ? { ...t, expanded: !t.expanded } : t))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTitle('')
    setContent('')
    setCategory('')
    setIsAnonymous(false)
    setTimeout(() => {
      setSubmitted(false)
      setShowForm(false)
    }, 3000)
  }

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Testimonies</h1>
            <p className="text-muted-foreground mt-1">
              Share how God has moved in your life and be encouraged by others
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white self-start sm:self-auto"
          >
            {showForm ? (
              <><X className="w-4 h-4 mr-2" /> Cancel</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" /> Share Testimony</>
            )}
          </Button>
        </div>

        {/* Submit Form */}
        {showForm && (
          <Card className="mb-8 border-[var(--church-primary)]/30">
            <CardHeader>
              <CardTitle className="text-[var(--church-primary)]">Share Your Testimony</CardTitle>
              <CardDescription>
                Your testimony will be reviewed by the pastoral team before being published.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Testimony Submitted!</h3>
                  <p className="text-muted-foreground text-sm">
                    Thank you for sharing. The pastoral team will review and approve your testimony shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="test-title">Title</Label>
                      <Input
                        id="test-title"
                        placeholder="Give your testimony a short title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="test-category">Category</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger id="test-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="test-content">Your Testimony</Label>
                    <Textarea
                      id="test-content"
                      placeholder="Write about how God moved in your life..."
                      rows={6}
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      required
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">{content.length} characters</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Post Anonymously</p>
                      <p className="text-xs text-muted-foreground">Your name will not be shown to the congregation</p>
                    </div>
                    <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                      disabled={!title || !content || !category}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Testimony
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Community Wall */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {['All', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === cat
                      ? 'bg-[var(--church-primary)] text-white'
                      : 'bg-white border border-border text-muted-foreground hover:border-[var(--church-primary)] hover:text-[var(--church-primary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              Community Testimonies
              <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length})</span>
            </h2>

            {filtered.map(testimony => (
              <Card key={testimony.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-sm font-semibold">
                        {testimony.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-foreground text-sm">{testimony.author}</p>
                          <p className="text-xs text-muted-foreground">{testimony.date}</p>
                        </div>
                        <Badge className={`text-xs ${categoryColors[testimony.category] ?? categoryColors['Other']}`}>
                          {testimony.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mt-2 mb-1">{testimony.title}</h3>
                      <p className={`text-sm text-muted-foreground leading-relaxed ${!testimony.expanded ? 'line-clamp-2' : ''}`}>
                        {testimony.content}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <button
                          onClick={() => handleExpand(testimony.id)}
                          className="text-xs text-[var(--church-primary)] font-medium flex items-center gap-1 hover:underline"
                        >
                          {testimony.expanded ? (
                            <><ChevronUp className="w-3.5 h-3.5" /> Read less</>
                          ) : (
                            <><ChevronDown className="w-3.5 h-3.5" /> Read more</>
                          )}
                        </button>
                        <button
                          onClick={() => handleLike(testimony.id)}
                          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                            testimony.liked
                              ? 'text-rose-500'
                              : 'text-muted-foreground hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${testimony.liked ? 'fill-rose-500' : ''}`} />
                          {testimony.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Total Testimonies', value: '128', icon: BookOpen, color: 'text-[var(--church-primary)]' },
                  { label: 'This Month', value: '14', icon: Star, color: 'text-amber-500' },
                  { label: 'Prayers Given', value: '3.2k', icon: Heart, color: 'text-rose-500' },
                  { label: 'Encouragements', value: '847', icon: ThumbsUp, color: 'text-emerald-500' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-bold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* My Testimonies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">My Testimonies</CardTitle>
              </CardHeader>
              <CardContent>
                {myTestimonies.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    You have not shared any testimonies yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myTestimonies.map(t => (
                      <div key={t.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground leading-tight">{t.title}</p>
                          <Badge
                            variant="secondary"
                            className={t.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 text-xs shrink-0' : 'text-xs shrink-0'}
                          >
                            {t.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">{t.date}</p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {t.likes}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Separator className="my-3" />
                <Button
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="w-full border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Share New Testimony
                </Button>
              </CardContent>
            </Card>

            {/* Inspiration Card */}
            <Card className="bg-[var(--church-primary)] text-white border-0">
              <CardContent className="p-5">
                <BookOpen className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-sm font-medium opacity-90 mb-1">Scripture</p>
                <p className="text-sm italic leading-relaxed opacity-95">
                  {'"And they overcame him by the blood of the Lamb and by the word of their testimony..."'}
                </p>
                <p className="text-xs mt-2 opacity-80">- Revelation 12:11</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
