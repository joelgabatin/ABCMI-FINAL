import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// POST — insert new core value
export async function POST(req: Request) {
  const { title, sort_order } = await req.json()
  const supabase = adminClient()

  const { data, error } = await supabase
    .from('church_core_values')
    .insert({ title, sort_order })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT — update existing core value
export async function PUT(req: Request) {
  const { id, title } = await req.json()
  const supabase = adminClient()

  const { error } = await supabase
    .from('church_core_values')
    .update({ title })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE — remove core value
export async function DELETE(req: Request) {
  const { id } = await req.json()
  const supabase = adminClient()

  const { error } = await supabase
    .from('church_core_values')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
