import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

export async function PUT(req: NextRequest) {
  const { mission_body, vision_body, driving_force } = await req.json()

  const { error } = await supabase
    .from('church_vmd')
    .upsert({ id: 1, mission_body, vision_body, driving_force, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
