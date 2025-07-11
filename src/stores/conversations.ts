import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../utils/api'
import { useAuthStore } from './auth'

export interface Conversation {
  id: string
  title?: string
  first_message: string
  last_message?: string
  message_count: number
  created_at: string
  updated_at: string
  duration?: number
  user_id: string
}

export interface Message {
  id: string
  conversation_id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

export const useConversationsStore = defineStore('conversations', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversation = ref<Conversation | null>(null)
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  // Computed properties
  const hasConversations = computed(() => conversations.value.length > 0)
  const sortedConversations = computed(() => 
    [...conversations.value].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  )

  // Actions
  const fetchConversations = async () => {
    if (!authStore.token) {
      error.value = 'Usuário não autenticado'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.get('/conversations/user', authStore.token)

      // Remover logs de debug para produção
      if (!response.ok) {
        error.value = response.data.message || 'Erro ao carregar conversas'
        return false
      }

      // Verifica se os dados estão em response.data.conversations ou response.data
      const conversationsData = response.data.conversations || response.data || []
      
      // Mapeia os dados do backend para o formato esperado pelo frontend
      const mappedConversations = conversationsData.map((conv: any) => ({
        id: conv.id || conv._id,
        title: conv.title || conv.first_message.substring(0, 50) + '...',
        first_message: conv.first_message,
        last_message: conv.last_message || conv.first_message,
        message_count: conv.message_count,
        duration: conv.duration || 0,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        user_id: conv.user_id
      }))

      conversations.value = mappedConversations

      return true
    } catch (e) {
      error.value = 'Erro de rede. Tente novamente.'
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchConversationMessages = async (conversationId: string) => {
    if (!authStore.token) return false

    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/conversations/${conversationId}/messages`, authStore.token)

      // Remover logs de debug para produção
      if (!response.ok) {
        error.value = response.data.message || 'Erro ao carregar mensagens'
        return false
      }

      // Mapeia as mensagens do backend
      const messagesData = response.data.messages || response.data || []
      messages.value = messagesData.map((msg: any) => ({
        id: msg._id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.timestamp || msg.created_at,
        conversation_id: conversationId
      }))

      // Buscar dados da conversa se não estiver carregada
      const conversation = conversations.value.find(c => c.id === conversationId)
      if (conversation) {
        currentConversation.value = conversation
      }
      
      return true
    } catch (e) {
      error.value = 'Erro de rede. Tente novamente.'
      return false
    } finally {
      loading.value = false
    }
  }

  const createConversation = async (firstMessage: string) => {
    if (!authStore.token) return null

    loading.value = true
    error.value = null

    try {
      const response = await api.post('/conversations', {
        first_message: firstMessage
      }, authStore.token)

      if (!response.ok) {
        error.value = response.data.message || 'Erro ao criar conversa'
        return null
      }

      const newConversation = response.data.conversation
      conversations.value.unshift(newConversation)
      return newConversation
    } catch (e) {
      console.error('Erro ao criar conversa:', e)
      error.value = 'Erro de rede. Tente novamente.'
      return null
    } finally {
      loading.value = false
    }
  }

  const addMessage = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    if (!authStore.token) return null

    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, {
        content,
        role
      }, authStore.token)

      if (!response.ok) {
        error.value = response.data.message || 'Erro ao enviar mensagem'
        return null
      }

      const newMessage = response.data.message
      messages.value.push(newMessage)

      // Atualizar conversa na lista
      const conversationIndex = conversations.value.findIndex(c => c.id === conversationId)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex] = {
          ...conversations.value[conversationIndex],
          last_message: content,
          message_count: messages.value.length,
          updated_at: new Date().toISOString()
        }
      }

      return newMessage
    } catch (e) {
      console.error('Erro ao adicionar mensagem:', e)
      error.value = 'Erro de rede. Tente novamente.'
      return null
    }
  }

  const updateConversationTitle = async (conversationId: string, title: string) => {
    if (!authStore.token) return false

    try {
      const response = await api.put(`/conversations/${conversationId}`, {
        title
      }, authStore.token)

      if (!response.ok) {
        error.value = response.data.message || 'Erro ao atualizar título'
        return false
      }

      // Atualizar na lista de conversas
      const conversationIndex = conversations.value.findIndex(c => c.id === conversationId)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].title = title
      }

      // Atualizar conversa atual se for a mesma
      if (currentConversation.value?.id === conversationId) {
        currentConversation.value.title = title
      }

      return true
    } catch (e) {
      console.error('Erro ao atualizar título:', e)
      error.value = 'Erro de rede. Tente novamente.'
      return false
    }
  }

  const deleteConversation = async (conversationId: string) => {
    if (!authStore.token) return false

    try {
      const response = await api.delete(`/conversations/${conversationId}`, authStore.token)

      if (!response.ok) {
        error.value = response.data.message || 'Erro ao deletar conversa'
        return false
      }

      // Remover da lista
      conversations.value = conversations.value.filter(c => c.id !== conversationId)

      // Limpar conversa atual se for a mesma
      if (currentConversation.value?.id === conversationId) {
        currentConversation.value = null
        messages.value = []
      }

      return true
    } catch (e) {
      console.error('Erro ao deletar conversa:', e)
      error.value = 'Erro de rede. Tente novamente.'
      return false
    }
  }

  const clearCurrentConversation = () => {
    currentConversation.value = null
    messages.value = []
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    
    // Computed
    hasConversations,
    sortedConversations,
    
    // Actions
    fetchConversations,
    createConversation,
    fetchConversationMessages,
    addMessage,
    updateConversationTitle,
    deleteConversation,
    clearCurrentConversation,
    clearError
  }
}) 
