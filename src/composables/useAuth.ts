import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'

export function useAuth() {
  const authStore = useAuthStore()

  return {
    // State
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    
    // Computed
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoggedIn: computed(() => authStore.isLoggedIn),
    
    // Actions
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth,
    clearError: authStore.clearError
  }
} 