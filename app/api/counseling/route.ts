import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('counseling_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { full_name, contact_number, address, facebook_account, preferred_date, preferred_time, counseling_type, is_member, concern } = body

  const { data, error } = await supabase
    .from('counseling_requests')
    .insert({
      full_name,
      contact_number,
      address,
      facebook_account,
      preferred_date,
      preferred_time,
      counseling_type,
      is_member,
      concern,
      status: 'pending'
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
