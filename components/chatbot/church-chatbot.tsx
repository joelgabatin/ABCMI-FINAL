"use client"

import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Maximize2,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getChatbotApiUrl } from '@/lib/chatbot/config'
import { getOrCreateChatSenderId } from '@/lib/chatbot/sender'
import type {
  ChatMessage,
  ChatbotRequestPayload,
  ChatbotResponseMessage,
} from '@/lib/chatbot/types'

interface ChurchChatbotProps {
  variant?: 'floating' | 'embedded'
  className?: string
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-message',
  role: 'bot',
  text: "Hello! I'm Grace. Ask me about our church, ministries, events, or prayer support.",
}

const QUICK_QUESTIONS = [
  'What time is Sunday service?',
  'How can I join a ministry?',
  'How do I request prayer?',
  'Tell me about missions training',
]

function createMessageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function renderMessageText(text: string, isUser: boolean) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let bulletBuffer: string[] = []
  let numberedBuffer: string[] = []

  const flushBullets = (key: string) => {
    if (bulletBuffer.length === 0) {
      return
    }

    elements.push(
      <ul key={key} className="mt-1 space-y-1 pl-1">
        {bulletBuffer.map((item, index) => (
          <li key={`${key}-${index}`} className="flex items-start gap-2">
            <span
              className={cn(
                'mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full',
                isUser ? 'bg-white/80' : 'bg-[var(--church-primary)]',
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>,
    )

    bulletBuffer = []
  }

  const flushNumbered = (key: string) => {
    if (numberedBuffer.length === 0) {
      return
    }

    elements.push(
      <ol key={key} className="mt-1 space-y-1 pl-1">
        {numberedBuffer.map((item, index) => (
          <li key={`${key}-${index}`} className="flex items-start gap-2">
            <span
              className={cn(
                'min-w-4 flex-shrink-0 text-xs font-semibold',
                isUser ? 'text-white/80' : 'text-[var(--church-primary)]',
              )}
            >
              {index + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>,
    )

    numberedBuffer = []
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      flushBullets(`bullet-break-${index}`)
      flushNumbered(`number-break-${index}`)
      return
    }

    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)/)
    if (bulletMatch) {
      flushNumbered(`number-reset-${index}`)
      bulletBuffer.push(bulletMatch[1])
      return
    }

    const numberedMatch = trimmedLine.match(/^\d+[.)]\s+(.+)/)
    if (numberedMatch) {
      flushBullets(`bullet-reset-${index}`)
      numberedBuffer.push(numberedMatch[1])
      return
    }

    flushBullets(`bullet-flush-${index}`)
    flushNumbered(`number-flush-${index}`)
    elements.push(
      <p key={`paragraph-${index}`} className={elements.length > 0 ? 'mt-1' : ''}>
        {trimmedLine}
      </p>,
    )
  })

  flushBullets('bullet-end')
  flushNumbered('number-end')

  return <>{elements}</>
}

async function postChatMessage(payload: ChatbotRequestPayload) {
  const response = await fetch(getChatbotApiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Chatbot request failed with status ${response.status}`)
  }

  const data = (await response.json()) as ChatbotResponseMessage[]
  return Array.isArray(data) ? data : []
}

export default function ChurchChatbot({
  variant = 'floating',
  className,
}: ChurchChatbotProps) {
  const isEmbedded = variant === 'embedded'
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [senderId, setSenderId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSenderId(getOrCreateChatSenderId())
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowTooltip(false), 6000)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const canSend = Boolean(senderId) && !isLoading && input.trim().length > 0

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim()
    if (!message || isLoading || !senderId) {
      return
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      text: message,
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      const responseMessages = await postChatMessage({
        sender: senderId,
        message,
      })

      const botMessages = responseMessages
        .filter((item) => typeof item.text === 'string' && item.text.trim().length > 0)
        .map(
          (item): ChatMessage => ({
            id: createMessageId(),
            role: 'bot',
            text: item.text!.trim(),
          }),
        )

      if (botMessages.length === 0) {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: createMessageId(),
            role: 'bot',
            text: "I received your message, but I don't have a text reply yet.",
          },
        ])
        return
      }

      setMessages((currentMessages) => [...currentMessages, ...botMessages])
    } catch {
      setError('Unable to reach Grace right now. Please try again in a moment.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await sendMessage(input)
  }

  if (!isEmbedded && !isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showTooltip && (
          <div className="relative flex max-w-[220px] items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 shadow-lg">
            <Sparkles className="h-4 w-4 flex-shrink-0 text-[var(--church-gold)]" />
            <p className="text-sm font-medium leading-snug text-foreground">Need help? Chat with Grace.</p>
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted transition-colors hover:bg-destructive hover:text-white"
              aria-label="Dismiss tooltip"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute -bottom-2 right-6 h-3 w-3 rotate-45 border-b border-r border-border bg-white" />
          </div>
        )}
        <button
          onClick={() => {
            setIsOpen(true)
            setShowTooltip(false)
          }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--church-primary)] text-white shadow-xl ring-4 ring-[var(--church-primary)]/20 transition-all hover:scale-110 hover:bg-[var(--church-primary-deep)]"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    )
  }

  return (
    <Card
      className={cn(
        isEmbedded
          ? 'w-full overflow-hidden rounded-2xl border border-border/50 py-0 shadow-xl'
          : 'fixed bottom-6 right-6 z-50 overflow-hidden rounded-2xl border border-border/50 py-0 shadow-2xl transition-all duration-300',
        !isEmbedded &&
          (isMinimized
            ? 'w-80 max-w-[calc(100vw-2rem)]'
            : 'w-[440px] max-w-[calc(100vw-2rem)]'),
        className,
      )}
    >
      <CardHeader className="p-0">
        <div className="flex items-center justify-between bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/40 bg-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-white">Grace</p>
              <p className="text-xs text-white/75">Church assistant</p>
            </div>
          </div>
          {!isEmbedded && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/20"
                onClick={() => setIsMinimized((value) => !value)}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {(isEmbedded || !isMinimized) && (
        <CardContent className="flex flex-col gap-0 p-0">
          <div className="h-96 space-y-4 overflow-y-auto bg-[var(--church-light-blue)]/30 p-5">
            {messages.map((message) => {
              const isUser = message.role === 'user'

              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-end gap-3',
                    isUser ? 'justify-end' : 'justify-start',
                  )}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--church-primary)] shadow">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                      isUser
                        ? 'rounded-br-sm bg-[var(--church-primary)] text-white'
                        : 'rounded-bl-sm border border-border/50 bg-white text-foreground',
                    )}
                  >
                    {renderMessageText(message.text, isUser)}
                  </div>
                  {isUser && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )
            })}

            {isLoading && (
              <div className="flex items-end gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--church-primary)] shadow">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-sm border border-border/50 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="h-2 w-2 animate-bounce rounded-full bg-[var(--church-primary)]/40"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="border-t border-border bg-background px-5 py-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => void sendMessage(question)}
                    disabled={isLoading || !senderId}
                    className="rounded-full border border-[var(--church-primary)]/20 bg-[var(--church-primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--church-primary)] transition-colors hover:bg-[var(--church-primary)]/20 disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-border bg-background p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={senderId ? 'Ask Grace anything...' : 'Preparing chat...'}
                className="flex-1 rounded-xl border-border/60 focus-visible:ring-[var(--church-primary)]"
                disabled={isLoading || !senderId}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 flex-shrink-0 rounded-xl bg-[var(--church-primary)] text-white hover:bg-[var(--church-primary-deep)]"
                disabled={!canSend}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Messages are sent only to the chatbot API with your stable browser sender ID.
            </p>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
