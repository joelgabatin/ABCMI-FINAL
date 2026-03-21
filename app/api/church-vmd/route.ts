import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function PUT(req: Request) {
  const { mission_body, vision_body, driving_force } = await req.json()
  const supabase = adminClient()

  const { error } = await supabase
    .from('church_VMD')
    .upsert({ id: 1, mission_body, vision_body, driving_force, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
