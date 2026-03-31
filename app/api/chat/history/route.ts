import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import type { ChatHistoryResponse, ChatMessage } from '@/lib/chatbot/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.ABCMI_SERVICE_KEY!,
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const visitorId = searchParams.get('visitorId')?.trim() || null
  const requestedSessionId = searchParams.get('sessionId')?.trim() || null

  if (!visitorId && !requestedSessionId) {
    return NextResponse.json(
      { error: 'visitorId or sessionId is required' },
      { status: 400 },
    )
  }

  let resolvedSessionId = requestedSessionId
  let resolvedVisitorId = visitorId

  try {
    if (!resolvedSessionId && resolvedVisitorId) {
      const { data: visitor, error: visitorError } = await supabase
        .from('visitors')
        .select('visitor_id')
        .eq('visitor_id', resolvedVisitorId)
        .maybeSingle()

      if (visitorError) {
        return NextResponse.json({ error: visitorError.message }, { status: 500 })
      }

      if (!visitor) {
        const emptyResponse: ChatHistoryResponse = {
          sessionId: null,
          visitorId: resolvedVisitorId,
          messages: [],
        }

        return NextResponse.json(emptyResponse)
      }

      const { data: latestSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('session_id, visitor_id')
        .eq('visitor_id', resolvedVisitorId)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (sessionError) {
        return NextResponse.json({ error: sessionError.message }, { status: 500 })
      }

      if (!latestSession) {
        const emptyResponse: ChatHistoryResponse = {
          sessionId: null,
          visitorId: resolvedVisitorId,
          messages: [],
        }

        return NextResponse.json(emptyResponse)
      }

      resolvedSessionId = latestSession.session_id
      resolvedVisitorId = latestSession.visitor_id
    }

    if (resolvedSessionId && !resolvedVisitorId) {
      const { data: session, error: sessionLookupError } = await supabase
        .from('chat_sessions')
        .select('session_id, visitor_id')
        .eq('session_id', resolvedSessionId)
        .maybeSingle()

      if (sessionLookupError) {
        return NextResponse.json(
          { error: sessionLookupError.message },
          { status: 500 },
        )
      }

      resolvedVisitorId = session?.visitor_id ?? null
    }

    if (!resolvedSessionId) {
      const emptyResponse: ChatHistoryResponse = {
        sessionId: null,
        visitorId: resolvedVisitorId,
        messages: [],
      }

      return NextResponse.json(emptyResponse)
    }

    const { data: rows, error: messagesError } = await supabase
      .from('chat_messages')
      .select('id, session_id, visitor_id, sender, message_text, created_at')
      .eq('session_id', resolvedSessionId)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })

    if (messagesError) {
      return NextResponse.json({ error: messagesError.message }, { status: 500 })
    }

    const messages: ChatMessage[] = (rows ?? []).map((row) => ({
      id: `chat-history-${row.id}`,
      role: row.sender === 'bot' ? 'bot' : 'user',
      text: row.message_text,
      createdAt: row.created_at,
    }))

    const response: ChatHistoryResponse = {
      sessionId: resolvedSessionId,
      visitorId: resolvedVisitorId,
      messages,
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json(
      { error: 'Unable to fetch chat history.' },
      { status: 500 },
    )
  }
}
