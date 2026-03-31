export type ChatRole = 'user' | 'bot'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
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
