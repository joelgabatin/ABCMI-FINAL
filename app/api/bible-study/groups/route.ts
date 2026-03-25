import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('bible_study_groups')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, branch, leader, topic, schedule, time, location, members, max_members, status, description, start_date } = body

  const { data, error } = await supabase
    .from('bible_study_groups')
    .insert({
      name,
      branch,
      leader,
      topic,
      schedule,
      time,
      location,
      members: members ?? 0,
      max_members: max_members ?? 20,
      status: status ?? 'active',
      description: description ?? '',
      start_date: start_date || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
