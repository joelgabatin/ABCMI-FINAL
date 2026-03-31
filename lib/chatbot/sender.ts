export const CHATBOT_SENDER_STORAGE_KEY = 'grace_sender_id'

function createSenderId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `grace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateChatSenderId(
  storageKey = CHATBOT_SENDER_STORAGE_KEY,
) {
  if (typeof window === 'undefined') {
    return null
  }

  const existingId = window.localStorage.getItem(storageKey)?.trim()
  if (existingId) {
    return existingId
  }

  const nextId = createSenderId()
  window.localStorage.setItem(storageKey, nextId)
  return nextId
}
