import { createPinia } from 'pinia'

// Configuração central do Pinia
export const pinia = createPinia()

// Exportar stores para uso global
export { useAuthStore } from './auth' 