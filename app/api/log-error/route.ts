import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category = 'client', message, details } = body

    if (!message) {
      return NextResponse.json({ ok: false, error: 'message is required' }, { status: 400 })
    }

    logger.error(category, message, details)

    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('api', 'Failed to process log-error request', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
