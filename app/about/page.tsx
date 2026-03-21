import { createClient } from '@supabase/supabase-js'
import { churchContent as staticContent } from "@/lib/church-content"
import type { ChurchContent } from "@/lib/church-content"
import AboutContent from "./about-content"

export const dynamic = 'force-dynamic'

async function getChurchContent(): Promise<ChurchContent> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const [settingsRes, coreValuesRes, beliefsRes, historyRes] = await Promise.all([
      supabase.from('church_VMD').select('*').eq('id', 1).single(),
      supabase.from('church_core_values').select('*').order('sort_order'),
      supabase.from('church_beliefs').select('*').order('sort_order'),
      supabase.from('church_history').select('*').order('sort_order'),
    ])

    const settings   = settingsRes.data
    const coreValues = coreValuesRes.data
    const beliefs    = beliefsRes.data
    const history    = historyRes.data

    return {
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
        ? coreValues.map((cv: { title: string }) => ({ title: cv.title }))
        : staticContent.coreValues,
      statementOfFaith: {
        ...staticContent.statementOfFaith,
        beliefs: beliefs?.length
          ? beliefs.map((b: { belief: string }) => b.belief)
          : staticContent.statementOfFaith.beliefs,
      },
      history: {
        ...staticContent.history,
        timeline: history?.length
          ? history.map((h: { year: string; event: string }) => ({ year: h.year, event: h.event }))
          : staticContent.history.timeline,
      },
    }
  } catch {
    return staticContent
  }
}

export default async function AboutPage() {
  const initial = await getChurchContent()
  return <AboutContent initial={initial} />
}
