import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

// GET /api/events/[id]/attendees — list all attendees for an event
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params
  const id = parseInt(rawId)

  const { data, error } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', id)
    .order('registered_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/events/[id]/attendees — register for an event (public)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const body = await req.json()

  // 1. First, check if the event exists and has open_registration = true
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('open_registration, title')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
  }

  if (!event.open_registration) {
    return NextResponse.json({ error: `Registration for "${event.title}" is currently closed.` }, { status: 403 })
  }

  // 2. Proceed with registration
  const { error, data } = await supabase
    .from('event_attendees')
    .insert([{ ...body, event_id: id }])
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ id: data.id })
}

// DELETE /api/events/[id]/attendees?attendeeId=X — remove an attendee (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params
  const eventId = parseInt(rawId)
  const { searchParams } = new URL(req.url)
  const attendeeId = searchParams.get('attendeeId')

  if (!attendeeId) return NextResponse.json({ error: 'attendeeId required' }, { status: 400 })

  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .eq('id', parseInt(attendeeId))
    .eq('event_id', eventId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
