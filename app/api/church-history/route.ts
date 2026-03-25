import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const { year, event, sort_order } = await req.json()
  const { data, error } = await supabase
    .from('church_history')
    .insert({ year, event, sort_order })
    .select('id')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}

export async function PUT(req: NextRequest) {
  const { id, year, event } = await req.json()
  const { error } = await supabase
    .from('church_history')
    .update({ year, event })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const { error } = await supabase
    .from('church_history')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
