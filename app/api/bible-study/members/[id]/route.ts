import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { name, email, phone } = body

  const { data, error } = await supabase
    .from('bible_study_members')
    .update({ name, email, phone, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Get group_id first to decrement count
  const { data: member, error: fetchError } = await supabase
    .from('bible_study_members')
    .select('group_id')
    .eq('id', id)
    .single()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

  const { error: deleteError } = await supabase
    .from('bible_study_members')
    .delete()
    .eq('id', id)

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })

  // Decrement group member count
  await supabase.rpc('decrement_group_members', { group_id_param: member.group_id })

  return NextResponse.json({ message: 'Member deleted successfully' })
}
