import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../utils/api'
import { config } from '../config'

export interface User {
  id: string
  email: string
  name?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem(config.auth.tokenKey))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth', { email, password })

      if (!response.ok) {
        error.value = response.data.message || 'Falha ao fazer login.'
        console.error('Erro no login:', response.data)
        return false
      }

      // Salvar token e dados do usuário
      token.value = response.data.token
      user.value = response.data.user || { email } // Fallback se o backend não retornar user
      localStorage.setItem(config.auth.tokenKey, response.data.token)

      return true

    } catch (e) {
      console.error('Erro de rede no login:', e)
      error.value = 'Erro de rede. Tente novamente.'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    // Limpar estado
    user.value = null
    token.value = null
    error.value = null
    
    // Remover token do localStorage
    localStorage.removeItem(config.auth.tokenKey)
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const response = await api.get('/verify-token', token.value)

      if (response.ok) {
        user.value = response.data.user
        return true
      } else {
        // Token inválido, fazer logout
        logout()
        return false
      }
    } catch (e) {
      console.error('Erro ao verificar autenticação:', e)
      logout()
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    isLoggedIn,
    
    // Actions
    login,
    logout,
    checkAuth,
    clearError
  }
}) 