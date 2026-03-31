export const DEFAULT_CHATBOT_API_URL = '/api/rasa'

export function getChatbotApiUrl() {
  return (
    process.env.NEXT_PUBLIC_CHATBOT_API_URL?.trim() || DEFAULT_CHATBOT_API_URL
  )
}
