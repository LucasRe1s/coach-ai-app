import { createPinia } from 'pinia'

export const pinia = createPinia()

export { useAuthStore } from './auth'
export { useConversationsStore } from './conversations' 