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
  created_at: string
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
      console.error('Token não encontrado')
      error.value = 'Usuário não autenticado'
      return false
    }

    loading.value = true
    error.value = null

    try {
      // Mock temporário para testar a funcionalidade
      // TODO: Remover quando o backend estiver implementado
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simula delay da API
      
      // Dados mock para teste
      const mockConversations = [
        {
          id: '1',
          title: 'Como melhorar minha técnica de guitarra',
          first_message: 'Olá, gostaria de dicas para melhorar minha técnica de guitarra',
          last_message: 'Obrigado pelas dicas! Vou praticar os exercícios.',
          message_count: 8,
          duration: 1200,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T11:00:00Z',
          user_id: 'user123'
        },
        {
          id: '2',
          title: 'Escalas musicais para piano',
          first_message: 'Quais são as escalas mais importantes para piano?',
          last_message: 'Perfeito! Agora entendo melhor as escalas.',
          message_count: 12,
          duration: 1800,
          created_at: '2024-01-14T14:20:00Z',
          updated_at: '2024-01-14T15:30:00Z',
          user_id: 'user123'
        },
        {
          id: '3',
          title: 'Composição de músicas',
          first_message: 'Como começar a compor minhas próprias músicas?',
          last_message: 'Vou tentar essas técnicas de composição.',
          message_count: 15,
          duration: 2400,
          created_at: '2024-01-13T09:15:00Z',
          updated_at: '2024-01-13T10:45:00Z',
          user_id: 'user123'
        }
      ]

      conversations.value = mockConversations
      return true

      // Código original comentado para quando o backend estiver pronto
      /*
      const response = await api.get('/conversations', authStore.token)

      console.log('Resposta da API:', response)

      if (!response.ok) {
        error.value = response.data.message || 'Erro ao carregar conversas'
        console.error('Erro na resposta:', response.data)
        return false
      }

      conversations.value = response.data.conversations || []
      console.log('Conversas carregadas:', conversations.value.length)
      return true
      */
    } catch (e) {
      console.error('Erro ao buscar conversas:', e)
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

  const fetchConversationMessages = async (conversationId: string) => {
    if (!authStore.token) return false

    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/conversations/${conversationId}/messages`, authStore.token)

      if (!response.ok) {
        error.value = response.data.message || 'Erro ao carregar mensagens'
        return false
      }

      messages.value = response.data.messages || []
      
      // Buscar dados da conversa se não estiver carregada
      const conversation = conversations.value.find(c => c.id === conversationId)
      if (conversation) {
        currentConversation.value = conversation
      }
      
      return true
    } catch (e) {
      console.error('Erro ao buscar mensagens:', e)
      error.value = 'Erro de rede. Tente novamente.'
      return false
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