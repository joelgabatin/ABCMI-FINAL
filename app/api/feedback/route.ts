import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { author, email, branch, type, subject, message, rating, anonymous, wants_response } = body

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      author: anonymous ? 'Anonymous' : (author || 'Anonymous'),
      email: email || null,
      branch: branch || '',
      type: type || 'General Feedback',
      subject: subject || '',
      message,
      rating: rating || 3,
      status: 'new',
      anonymous: anonymous || false,
      wants_response: wants_response || false,
      admin_reply: null,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
