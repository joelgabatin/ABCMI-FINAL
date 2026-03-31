export type ChatRole = 'user' | 'bot'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  createdAt?: string
}

export interface ChatbotRequestPayload {
  sender: string
  message: string
}

export interface ChatbotResponseMessage {
  recipient_id?: string
  text?: string
  image?: string
  attachment?: unknown
  buttons?: Array<{
    title: string
    payload: string
  }>
  custom?: Record<string, unknown>
}

export interface ChatHistoryResponse {
  sessionId: string | null
  visitorId: string | null
  messages: ChatMessage[]
}
