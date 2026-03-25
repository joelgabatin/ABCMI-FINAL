import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const group_id = searchParams.get('group_id')

  let query = supabase
    .from('bible_study_members')
    .select('*')
    .order('created_at', { ascending: false })

  if (group_id) {
    query = query.eq('group_id', group_id)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { group_id, name, email, phone } = body

  if (!group_id || !name) {
    return NextResponse.json({ error: 'group_id and name are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bible_study_members')
    .insert({ group_id, name, email, phone })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Increment group member count
  await supabase.rpc('increment_group_members', { group_id_param: group_id })

  return NextResponse.json(data)
}
