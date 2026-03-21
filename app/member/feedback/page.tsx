"use client"

import { useState } from 'react'
import { MessageSquarePlus, Send, Star, Clock, CheckCircle, ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

const feedbackTypes = [
  'General Feedback',
  'Sermon Feedback',
  'Ministry Suggestion',
  'Facility Concern',
  'Event Feedback',
  'Pastoral Care',
  'Other',
]

const satisfactionOptions = [
  { value: '5', label: 'Excellent' },
  { value: '4', label: 'Good' },
  { value: '3', label: 'Neutral' },
  { value: '2', label: 'Poor' },
  { value: '1', label: 'Very Poor' },
]

const myFeedbackHistory = [
  {
    id: 1,
    type: 'Sermon Feedback',
    subject: 'Sunday service — March 9',
    message: 'The message on faith and perseverance really spoke to me. Pastor\'s use of the story of Joseph was powerful.',
    rating: 5,
    date: 'March 9, 2025',
    status: 'Acknowledged',
    response: 'Thank you so much for the kind feedback! We praise God the message was a blessing. — Pastor Ysrael',
  },
  {
    id: 2,
    type: 'Ministry Suggestion',
    subject: 'Youth program expansion',
    message: 'I would love to see a mid-week program for teenagers in addition to the Sunday youth group.',
    rating: 4,
    date: 'February 15, 2025',
    status: 'Under Review',
    response: null,
  },
  {
    id: 3,
    type: 'Facility Concern',
    subject: 'Audio system improvement',
    message: 'There are some sections in the back where the audio is not very clear. A sound check before service might help.',
    rating: 3,
    date: 'January 22, 2025',
    status: 'Resolved',
    response: 'We have installed two additional speakers in the back section. Thank you for bringing this to our attention! — Admin Team',
  },
]

const statusColors: Record<string, string> = {
  Acknowledged: 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-gray-100 text-gray-600',
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {satisfactionOptions.find(o => o.value === String(value))?.label}
        </span>
      )}
    </div>
  )
}

export default function MemberFeedbackPage() {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Form state
  const [subject, setSubject] = useState('')
  const [feedbackType, setFeedbackType] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [contactBack, setContactBack] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowForm(false)
      setSubject('')
      setFeedbackType('')
      setMessage('')
      setRating(0)
      setIsAnonymous(false)
      setContactBack(false)
    }, 3500)
  }

  const canSubmit = subject.trim() && feedbackType && message.trim() && rating > 0

  return (
    <DashboardLayout variant="member">
      <main className="min-h-screen bg-[var(--church-light-blue)] p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
            <p className="text-muted-foreground mt-1">
              Help us grow by sharing your thoughts, suggestions, and concerns
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white self-start sm:self-auto"
          >
            {showForm ? (
              <><X className="w-4 h-4 mr-2" /> Cancel</>
            ) : (
              <><MessageSquarePlus className="w-4 h-4 mr-2" /> Give Feedback</>
            )}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8 border-[var(--church-primary)]/30">
            <CardHeader>
              <CardTitle className="text-[var(--church-primary)]">Submit Feedback</CardTitle>
              <CardDescription>
                Your feedback helps us improve our ministries and better serve the congregation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Thank You!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Your feedback has been received. The leadership team values your input and will review it shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fb-subject">Subject</Label>
                      <Input
                        id="fb-subject"
                        placeholder="Brief subject of your feedback"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="fb-type">Feedback Type</Label>
                      <Select value={feedbackType} onValueChange={setFeedbackType} required>
                        <SelectTrigger id="fb-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackTypes.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="fb-message">Message</Label>
                    <Textarea
                      id="fb-message"
                      placeholder="Share your feedback in detail..."
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">{message.length} characters</p>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label>Overall Satisfaction</Label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">Submit Anonymously</p>
                        <p className="text-xs text-muted-foreground">Your name will not be attached to this feedback</p>
                      </div>
                      <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">Request a Response</p>
                        <p className="text-xs text-muted-foreground">A pastor or leader will follow up with you</p>
                      </div>
                      <Switch checked={contactBack} onCheckedChange={setContactBack} disabled={isAnonymous} />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white"
                      disabled={!canSubmit}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Feedback History */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              My Feedback History
              <span className="ml-2 text-sm font-normal text-muted-foreground">({myFeedbackHistory.length})</span>
            </h2>

            <div className="space-y-4">
              {myFeedbackHistory.map(item => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge variant="secondary" className="text-xs bg-[var(--church-primary)]/10 text-[var(--church-primary)]">
                            {item.type}
                          </Badge>
                          <Badge className={`text-xs ${statusColors[item.status]}`}>
                            {item.status === 'Resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {item.status === 'Under Review' && <Clock className="w-3 h-3 mr-1" />}
                            {item.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground">{item.subject}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-sm text-muted-foreground mt-3 leading-relaxed ${expandedId !== item.id ? 'line-clamp-2' : ''}`}>
                      {item.message}
                    </p>

                    {item.response && (
                      <>
                        {expandedId === item.id && (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <p className="text-xs font-semibold text-emerald-700 mb-1">Pastoral Response</p>
                            <p className="text-sm text-emerald-800 leading-relaxed">{item.response}</p>
                          </div>
                        )}
                      </>
                    )}

                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="mt-2 text-xs text-[var(--church-primary)] font-medium flex items-center gap-1 hover:underline"
                    >
                      {expandedId === item.id ? (
                        <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                      ) : (
                        <><ChevronDown className="w-3.5 h-3.5" />
                          {item.response ? 'View full feedback & response' : 'Read more'}
                        </>
                      )}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">My Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Total Submitted', value: '3', color: 'text-[var(--church-primary)]' },
                  { label: 'Acknowledged', value: '1', color: 'text-blue-600' },
                  { label: 'Under Review', value: '1', color: 'text-amber-600' },
                  { label: 'Resolved', value: '1', color: 'text-emerald-600' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <span className={`font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Rating Given</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-foreground">4.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Feedback Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {[
                    'Be respectful and constructive in your feedback.',
                    'Be specific — detailed feedback helps us improve.',
                    'Suggestions and ideas are always welcome.',
                    'Urgent concerns may be brought directly to the pastoral team.',
                    'All feedback is confidential and reviewed by leadership.',
                  ].map((g, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--church-primary)]/10 text-[var(--church-primary)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-[var(--church-primary)] text-white border-0">
              <CardContent className="p-5">
                <MessageSquarePlus className="w-8 h-8 mb-3 opacity-80" />
                <p className="font-semibold mb-1">Your Voice Matters</p>
                <p className="text-sm opacity-90 leading-relaxed mb-4">
                  Every piece of feedback helps us build a stronger, more welcoming church community.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  variant="secondary"
                  size="sm"
                  className="w-full bg-white text-[var(--church-primary)] hover:bg-white/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Give Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
