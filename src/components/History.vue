<template>
  <div class="history-container">
    <Header />
    <div class="history-content">
      <div class="history-header">
        <h1>Histórico de Conversas</h1>
        <p>Visualize suas conversas anteriores com o Coach AI</p>
      </div>

      <div v-if="conversationsStore.loading" class="loading-container">
        <Spinner />
        <p>Carregando conversas...</p>
      </div>

      <div v-else-if="conversationsStore.error" class="error-container">
        <p class="error-message">{{ conversationsStore.error }}</p>
        <button @click="loadConversations" class="retry-button">
          Tentar Novamente
        </button>
      </div>

      <div v-else-if="conversationsStore.conversations.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <h3>Nenhuma conversa encontrada</h3>
        <p>Você ainda não tem conversas salvas. Comece uma nova conversa!</p>
        <button @click="goToHome" class="start-chat-button">
          Iniciar Conversa
        </button>
      </div>

      <div v-else class="conversations-list">
        <div v-for="conversation in conversationsStore.sortedConversations" :key="conversation.id"
          class="conversation-card" @click="viewConversation(conversation)">
          <div class="conversation-header">
            <h3 class="conversation-title">
              {{ conversation.title || 'Conversa sem título' }}
            </h3>
            <span class="conversation-date">
              {{ formatDate(conversation.created_at) }}
            </span>
          </div>

          <div class="conversation-preview">
            <p>{{ truncateMessage(conversation.last_message || conversation.first_message) }}</p>
          </div>

          <div class="conversation-meta">
            <span class="message-count">
              {{ conversation.message_count || 0 }} mensagens
            </span>
            <span class="conversation-duration">
              {{ formatDuration(conversation.duration) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Mensagens -->
    <div v-if="showMessagesModal" class="modal-overlay" @click="closeMessagesModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedConversation?.title || 'Conversa' }}</h3>
          <button @click="closeMessagesModal" class="close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div v-if="messagesLoading" class="loading-container">
            <Spinner />
            <p>Carregando mensagens...</p>
          </div>

          <div v-else-if="conversationsStore.messages.length === 0" class="empty-messages">
            <p>Nenhuma mensagem encontrada.</p>
          </div>

          <div v-else class="messages-list">
            <div v-for="message in filteredMessages" :key="message.id" :class="['message', `message-${message.role}`]">
              <div class="message-header">
                <span class="message-role">
                  {{ message.role === 'user' ? 'Você' : 'Coach AI' }}
                </span>
                <span class="message-time">
                  {{ formatDate(message.timestamp) }}
                </span>
              </div>
              <div class="message-content">
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationsStore } from '../stores/conversations'
import Header from './Header.vue'
import Spinner from './Spinner.vue'
import type { Message } from '../stores/conversations'

const router = useRouter()
const conversationsStore = useConversationsStore()

const loadConversations = async () => {
  await conversationsStore.fetchConversations()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return 'Hoje'
  } else if (diffDays === 2) {
    return 'Ontem'
  } else if (diffDays <= 7) {
    return `${diffDays - 1} dias atrás`
  } else {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}

const formatDuration = (duration?: number) => {
  if (!duration) return ''

  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}



const truncateMessage = (message: string) => {
  if (!message) return 'Sem mensagens'
  return message.length > 100 ? message.substring(0, 100) + '...' : message
}

const showMessagesModal = ref(false)
const selectedConversation = ref<any>(null)
const messagesLoading = ref(false)

const viewConversation = async (conversation: any) => {
  selectedConversation.value = conversation
  showMessagesModal.value = true
  messagesLoading.value = true

  try {
    console.log('Abrindo conversa com id:', conversation.id)
    await conversationsStore.fetchConversationMessages(conversation.id)
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error)
  } finally {
    messagesLoading.value = false
  }
}

const closeMessagesModal = () => {
  showMessagesModal.value = false
  selectedConversation.value = null
  conversationsStore.clearCurrentConversation()
}

const goToHome = () => {
  router.push('/home')
}

const filteredMessages = computed<Message[]>(() => {
  const msgs = conversationsStore.messages
  const userMsg = msgs.find(m => m.role === 'user')
  const assistantMsg = msgs.find(m => m.role === 'assistant')
  // Retorna apenas mensagens definidas, nunca undefined
  return [userMsg, assistantMsg].filter((m): m is Message => !!m)
})

onMounted(() => {
  loadConversations()
})
</script>

<style scoped>
.history-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #3d3e46 0%, #4b385e 100%);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.history-content {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px;
  flex: 1;
}

.history-header {
  background: linear-gradient(135deg, #c4a882 0%, #d4b892 100%);
  padding: 40px 30px;
  text-align: center;
  color: white;
}

.history-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.loading-container {
  padding: 60px 30px;
  text-align: center;
}

.loading-container p {
  margin-top: 20px;
  color: #666;
  font-size: 1.1rem;
}

.error-container {
  padding: 60px 30px;
  text-align: center;
}

.error-message {
  color: #e74c3c;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.retry-button {
  background: #c4a882;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #b39872;
  transform: translateY(-2px);
}

.empty-state {
  padding: 80px 30px;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 1.5rem;
}

.empty-state p {
  color: #666;
  margin: 0 0 30px 0;
  font-size: 1.1rem;
}

.start-chat-button {
  background: #c4a882;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-chat-button:hover {
  background: #b39872;
  transform: translateY(-2px);
}

.conversations-list {
  padding: 30px;
}

.conversation-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.conversation-card:hover {
  background: #f0f2f5;
  border-color: #c4a882;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(196, 168, 130, 0.2);
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.conversation-title {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
}

.conversation-date {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
  margin-left: 15px;
}

.conversation-preview {
  margin-bottom: 15px;
}

.conversation-preview p {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-size: 1rem;
}

.conversation-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
}

.message-count,
.conversation-duration {
  background: #e9ecef;
  padding: 5px 12px;
  border-radius: 15px;
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 768px) {
  .history-container {
    padding: 10px;
  }

  .history-content {
    margin-top: 10px;
    border-radius: 15px;
  }

  .history-header {
    padding: 30px 20px;
  }

  .history-header h1 {
    font-size: 2rem;
  }

  .history-header p {
    font-size: 1rem;
  }

  .conversations-list {
    padding: 20px;
  }

  .conversation-card {
    padding: 20px;
  }

  .conversation-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .conversation-date {
    margin-left: 0;
    margin-top: 8px;
  }

  .conversation-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .history-header h1 {
    font-size: 1.8rem;
  }

  .conversation-title {
    font-size: 1.2rem;
  }

  .conversation-preview p {
    font-size: 0.95rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #c4a882 0%, #d4b892 100%);
  color: white;
  padding: 20px 30px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  padding: 15px;
  border-radius: 15px;
  max-width: 80%;
}

.message-user {
  background: #e3f2fd;
  align-self: flex-end;
  margin-left: auto;
}

.message-assistant {
  background: #f5f5f5;
  align-self: flex-start;
  margin-right: auto;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.message-role {
  font-weight: 600;
  color: #333;
}

.message-time {
  color: #666;
  font-size: 0.8rem;
}

.message-content {
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
}

.empty-messages {
  text-align: center;
  color: #666;
  padding: 40px 0;
}

/* Responsividade do Modal */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    max-height: 90vh;
  }

  .modal-header {
    padding: 15px 20px;
  }

  .modal-header h3 {
    font-size: 1.3rem;
  }

  .modal-body {
    padding: 20px;
  }

  .message {
    max-width: 90%;
  }
}
</style>