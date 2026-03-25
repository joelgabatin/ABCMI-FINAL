import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const week = searchParams.get('week') // YYYY-MM-DD (Monday of the week)

  let query = supabase.from('weekly_reading_plans').select('*').order('week_start', { ascending: false })

  if (week) {
    query = query.eq('week_start', week)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { error, data } = await supabase
    .from('weekly_reading_plans')
    .upsert([body], { onConflict: 'week_start,day_of_week' })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
