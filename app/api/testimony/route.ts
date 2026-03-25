import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('testimonies')
    .select('*')
    .eq('status', 'featured')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { author, email, branch, category, title, content, anonymous, is_member } = body

  const { data, error } = await supabase
    .from('testimonies')
    .insert({
      author: anonymous ? 'Anonymous' : (author || 'Anonymous'),
      email,
      branch,
      category: category || 'Other',
      title,
      content,
      anonymous: anonymous || false,
      is_member: is_member !== undefined ? is_member : true,
      status: 'pending',
      likes: 0,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
