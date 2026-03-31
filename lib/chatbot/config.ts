export const DEFAULT_CHATBOT_API_URL =
  'http://localhost:8000/webhooks/rest/webhook'

export function getChatbotApiUrl() {
  return (
    process.env.NEXT_PUBLIC_CHATBOT_API_URL?.trim() || DEFAULT_CHATBOT_API_URL
  )
}
