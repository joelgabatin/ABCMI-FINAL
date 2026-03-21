import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: Request) {
  const { belief, sort_order } = await req.json()
  const supabase = adminClient()

  const { data, error } = await supabase
    .from('church_beliefs')
    .insert({ belief, sort_order })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const { id, belief } = await req.json()
  const supabase = adminClient()

  const { error } = await supabase
    .from('church_beliefs')
    .update({ belief })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const supabase = adminClient()

  const { error } = await supabase
    .from('church_beliefs')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
