import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

// GET /api/contact — returns all contact info for chatbot / public use
export async function GET() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('contact_email, contact_phone, address, office_hours, google_maps_embed_url')
    .eq('id', 1)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Also fetch the contact page URL from website_pages
  const { data: page } = await supabase
    .from('website_pages')
    .select('path')
    .eq('path', '/contact')
    .single()

  return NextResponse.json({
    email: data.contact_email,
    phone: data.contact_phone,
    address: data.address,
    office_hours: data.office_hours,
    google_maps_embed_url: data.google_maps_embed_url,
    contact_page_path: page?.path ?? '/contact',
  })
}

// POST /api/contact — submit a contact message (used by chatbot or any client)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, subject, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || 'General Inquiry',
      message: message.trim(),
      status: 'unread',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id })
}
