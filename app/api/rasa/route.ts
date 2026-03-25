import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, sender } = await req.json()

    const rasaUrl =
      process.env.RASA_WEBHOOK_URL ?? 'http://localhost:8000/webhooks/rest/webhook'

    const rasaRes = await fetch(rasaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: sender ?? 'user', message }),
    })

    if (!rasaRes.ok) {
      return NextResponse.json(
        { error: `Rasa returned ${rasaRes.status}` },
        { status: 502 }
      )
    }

    const data = await rasaRes.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Could not reach the Rasa server.' },
      { status: 503 }
    )
  }
}
