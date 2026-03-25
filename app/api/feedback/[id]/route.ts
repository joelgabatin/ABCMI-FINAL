import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const body = await req.json()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.status !== undefined) updates.status = body.status
  if (body.admin_reply !== undefined) {
    updates.admin_reply = body.admin_reply
    // Auto-set to acknowledged when a reply is submitted
    if (!body.status) updates.status = 'acknowledged'
  }

  const { error } = await supabase
    .from('feedback')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params
  const id = parseInt(rawId)

  const { error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
