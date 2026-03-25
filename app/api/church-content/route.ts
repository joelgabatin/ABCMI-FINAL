import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!
)

export async function GET() {
  const [vmdRes, cvRes, beliefsRes, historyRes] = await Promise.all([
    supabase.from('church_vmd').select('*').eq('id', 1).single(),
    supabase.from('church_core_values').select('*').order('sort_order'),
    supabase.from('church_beliefs').select('*').order('sort_order'),
    supabase.from('church_history').select('*').order('sort_order'),
  ])

  return NextResponse.json({
    mission:      vmdRes.data?.mission_body   ?? '',
    vision:       vmdRes.data?.vision_body    ?? '',
    drivingForce: vmdRes.data?.driving_force  ?? '',
    coreValues:   cvRes.data      ?? [],
    beliefs:      beliefsRes.data ?? [],
    history:      historyRes.data ?? [],
  })
}
