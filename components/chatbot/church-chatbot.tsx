"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, User, Bot, Minimize2, Maximize2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

let msgCounter = 0
function uid() { return `msg-${++msgCounter}-${Date.now()}` }

// Render RASA text with support for bullet lists and numbered lists
function renderText(text: string, isUser: boolean) {
  const lines = text.split('\n')

  const elements: React.ReactNode[] = []
  let bulletBuffer: string[] = []
  let numberedBuffer: string[] = []

  const flushBullets = (key: string) => {
    if (bulletBuffer.length === 0) return
    elements.push(
      <ul key={key} className="mt-1 mb-1 space-y-1 pl-1">
        {bulletBuffer.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={cn(
              "mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0",
              isUser ? "bg-white/80" : "bg-[var(--church-primary)]"
            )} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  const flushNumbered = (key: string) => {
    if (numberedBuffer.length === 0) return
    elements.push(
      <ol key={key} className="mt-1 mb-1 space-y-1 pl-1">
        {numberedBuffer.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={cn(
              "mt-0 font-semibold text-xs flex-shrink-0 min-w-[16px]",
              isUser ? "text-white/80" : "text-[var(--church-primary)]"
            )}>{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    )
    numberedBuffer = []
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushBullets(`b-${i}`)
      flushNumbered(`n-${i}`)
      return
    }

    // Bullet: lines starting with -, *, or •
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/)
    if (bulletMatch) {
      flushNumbered(`n-${i}`)
      bulletBuffer.push(bulletMatch[1])
      return
    }

    // Numbered: lines starting with 1. 2. etc.
    const numberedMatch = trimmed.match(/^\d+[.)]\s+(.+)/)
    if (numberedMatch) {
      flushBullets(`b-${i}`)
      numberedBuffer.push(numberedMatch[1])
      return
    }

    // Plain text
    flushBullets(`b-${i}`)
    flushNumbered(`n-${i}`)
    elements.push(<p key={`p-${i}`} className={elements.length > 0 ? "mt-1" : ""}>{trimmed}</p>)
  })

  flushBullets('b-end')
  flushNumbered('n-end')

  return <>{elements}</>
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  text: "Hello! I'm Grace, your virtual church assistant. How can I help you today? Feel free to ask me about our services, ministries, events, or any other questions you might have.",
}

const quickQuestions = [
  "What time is Sunday service?",
  "How can I join a ministry?",
  "How do I request prayer?",
  "Tell me about missions training",
]

export default function ChurchChatbot() {
  const [isOpen,      setIsOpen]      = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [input,       setInput]       = useState('')
  const [messages,    setMessages]    = useState<Message[]>([WELCOME])
  const [isLoading,   setIsLoading]   = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 6000)
    return () => clearTimeout(t)
  }, [])

  const sendToRasa = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    // Add user message immediately
    setMessages(prev => [...prev, { id: uid(), role: 'user', text }])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/rasa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'user', message: text }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Server error')
      }

      // RASA returns an array of { text, ... } responses
      const botMessages: Message[] = Array.isArray(data)
        ? data
            .filter((d: { text?: string }) => d.text)
            .map((d: { text: string }) => ({ id: uid(), role: 'assistant' as const, text: d.text }))
        : []

      if (botMessages.length === 0) {
        botMessages.push({
          id: uid(),
          role: 'assistant',
          text: "I'm sorry, I didn't quite understand that. Could you rephrase your question?",
        })
      }

      setMessages(prev => [...prev, ...botMessages])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          text: 'Sorry, I could not connect to the server. Please try again later.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendToRasa(input)
  }

  // ── Closed state — floating button ──────────────────────────────────────────
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showTooltip && (
          <div className="relative flex items-center gap-2 bg-white border border-border rounded-2xl px-4 py-2.5 shadow-lg max-w-[220px]">
            <Sparkles className="w-4 h-4 text-[var(--church-gold)] flex-shrink-0" />
            <p className="text-sm text-foreground font-medium leading-snug">{"I'm here to help!"}</p>
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
              aria-label="Dismiss tooltip"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r border-b border-border rotate-45" />
          </div>
        )}
        <button
          onClick={() => { setIsOpen(true); setShowTooltip(false) }}
          className="w-14 h-14 rounded-full bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 ring-4 ring-[var(--church-primary)]/20"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    )
  }

  // ── Open state — chat window ─────────────────────────────────────────────────
  return (
    <Card className={cn(
      "fixed z-50 shadow-2xl border border-border/50 transition-all duration-300 rounded-2xl overflow-hidden",
      isMinimized
        ? "bottom-6 right-6 w-80"
        : "bottom-6 right-6 w-[480px] max-w-[calc(100vw-2rem)]"
    )}>
      {/* Header */}
      <CardHeader className="p-0">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">Grace</p>
              <p className="text-white/75 text-xs">Church Assistant &bull; Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col bg-background">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-5 space-y-4 bg-[var(--church-light-blue)]/30">
            {messages.map((msg) => {
              const isUser = msg.role === 'user'
              return (
                <div key={msg.id} className={cn("flex gap-3 items-end", isUser ? "justify-end" : "justify-start")}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-[var(--church-primary)] flex items-center justify-center flex-shrink-0 shadow">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isUser
                      ? "bg-[var(--church-primary)] text-white rounded-br-sm"
                      : "bg-white text-foreground rounded-bl-sm border border-border/50"
                  )}>
                    {renderText(msg.text, isUser)}
                  </div>
                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 items-end">
                <div className="w-8 h-8 rounded-full bg-[var(--church-primary)] flex items-center justify-center flex-shrink-0 shadow">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-border/50 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    {[0, 150, 300].map(delay => (
                      <div
                        key={delay}
                        className="w-2 h-2 bg-[var(--church-primary)]/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions — shown only on fresh open */}
          {messages.length <= 1 && (
            <div className="px-5 py-3 border-t border-border bg-background">
              <p className="text-xs font-medium text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendToRasa(q)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 rounded-full bg-[var(--church-primary)]/10 text-[var(--church-primary)] hover:bg-[var(--church-primary)]/20 transition-colors border border-[var(--church-primary)]/20 font-medium disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Grace anything..."
                className="flex-1 rounded-xl border-border/60 focus-visible:ring-[var(--church-primary)]"
                disabled={isLoading}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white rounded-xl h-10 w-10 flex-shrink-0"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Powered by Grace AI &bull; Responses are for general guidance only.
            </p>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
