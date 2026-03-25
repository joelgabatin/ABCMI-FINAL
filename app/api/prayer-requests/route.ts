import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, contact, address, request, is_anonymous, face_to_face } = body

  if (!request?.trim()) {
    return NextResponse.json({ error: 'Prayer request is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('prayer_requests')
    .insert({
      name: is_anonymous ? 'Anonymous' : (name?.trim() || 'Anonymous'),
      contact: contact?.trim() || null,
      address: address?.trim() || null,
      request: request.trim(),
      is_anonymous: is_anonymous || false,
      face_to_face: face_to_face || false,
      status: 'pending',
      admin_notes: null,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
