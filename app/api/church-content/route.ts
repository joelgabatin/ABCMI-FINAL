import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { churchContent as staticContent } from '@/lib/church-content'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = adminClient()

  const [settingsRes, coreValuesRes, beliefsRes, historyRes] = await Promise.all([
    supabase.from('"church_VMD"').select('*').eq('id', 1).single(),
    supabase.from('church_core_values').select('*').order('sort_order'),
    supabase.from('church_beliefs').select('*').order('sort_order'),
    supabase.from('church_history').select('*').order('sort_order'),
  ])

  const settings   = settingsRes.data
  const coreValues = coreValuesRes.data
  const beliefs    = beliefsRes.data
  const history    = historyRes.data

  return NextResponse.json({
    mission: {
      ...staticContent.mission,
      body: settings?.mission_body || staticContent.mission.body,
    },
    vision: {
      ...staticContent.vision,
      body: settings?.vision_body || staticContent.vision.body,
      drivingForce: settings?.driving_force || staticContent.vision.drivingForce,
    },
    coreValues: coreValues?.length
      ? coreValues.map(cv => ({ title: cv.title, description: cv.description }))
      : staticContent.coreValues,
    statementOfFaith: {
      ...staticContent.statementOfFaith,
      beliefs: beliefs?.length
        ? beliefs.map(b => b.belief)
        : staticContent.statementOfFaith.beliefs,
    },
    history: {
      ...staticContent.history,
      timeline: history?.length
        ? history.map(h => ({ year: h.year, event: h.event }))
        : staticContent.history.timeline,
    },
  })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const supabase = adminClient()

  // 1. Upsert mission / vision / driving force
  const { error: settingsErr } = await supabase
    .from('"church_VMD"')
    .upsert({
      id: 1,
      mission_body:  body.mission?.body   ?? '',
      vision_body:   body.vision?.body    ?? '',
      driving_force: body.vision?.drivingForce ?? '',
      updated_at:    new Date().toISOString(),
    })
  if (settingsErr) return NextResponse.json({ error: settingsErr.message }, { status: 500 })

  // 2. Replace core values (delete all → insert fresh with sort_order)
  await supabase.from('church_core_values').delete().gte('id', 0)
  if (body.coreValues?.length) {
    const { error } = await supabase.from('church_core_values').insert(
      body.coreValues.map((cv: { title: string; description: string }, i: number) => ({
        title:       cv.title,
        description: cv.description,
        sort_order:  i,
      }))
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 3. Replace beliefs
  await supabase.from('church_beliefs').delete().gte('id', 0)
  if (body.statementOfFaith?.beliefs?.length) {
    const { error } = await supabase.from('church_beliefs').insert(
      body.statementOfFaith.beliefs.map((belief: string, i: number) => ({
        belief,
        sort_order: i,
      }))
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. Replace history timeline
  await supabase.from('church_history').delete().gte('id', 0)
  if (body.history?.timeline?.length) {
    const { error } = await supabase.from('church_history').insert(
      body.history.timeline.map((entry: { year: string; event: string }, i: number) => ({
        year:       entry.year,
        event:      entry.event,
        sort_order: i,
      }))
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
