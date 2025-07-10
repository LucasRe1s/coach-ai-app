<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { api } from '../utils/api'
import Header from './Header.vue'
import Footer from './Footer.vue'
import Spinner from './Spinner.vue'

const question = ref('')
const answer = ref('')
const error = ref('')
const loading = ref(false)
const authStore = useAuthStore()

async function askQuestion() {
  error.value = ''
  answer.value = ''

  if (!question.value.trim()) {
    error.value = 'Por favor, digite uma pergunta.'
    return
  }

  loading.value = true
  try {
    const response = await api.post('/welcome', { question: question.value }, authStore.token || undefined)

    if (!response.ok) {
      error.value = response.data.message || 'Erro ao obter resposta.'
      return
    }

    // Simula delay para UX
    await new Promise(r => setTimeout(r, 1500))

    answer.value = response.data.answer || 'Resposta vazia do servidor.'
    question.value = ''
  } catch (e) {
    error.value = 'Erro ao obter resposta. Tente novamente.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="container">
    <Header />

    <main class="main-content">
      <div class="user-info">
        <h2>Assistente Musical</h2>
      </div>

      <div class="form-card">
        <textarea v-model="question" rows="4"
          placeholder="Digite sua pergunta sobre música, ex: 'Como montar uma escala menor harmônica?'"
          :disabled="loading"></textarea>

        <button @click="askQuestion" :disabled="loading" class="ask-btn">
          <Spinner v-if="loading" small />
          <span v-if="loading">Processando...</span>
          <span v-else>Perguntar</span>
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>

        <!-- Loading overlay para área de resposta -->
        <div v-if="loading && !answer" class="loading-overlay">
          <div class="spinner-container">
            <Spinner />
          </div>
          <p>Processando sua pergunta...</p>
        </div>

        <div v-if="answer" class="answer-box">{{ answer }}</div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
:root {
  --main-color: #c4a882;
  --accent-color: ;
  --error-color: #dc3545;
  --text-color: #333;
  --light-text: #666;
  --success-color: #28a745;
}

/* Reset completo para evitar scroll */
* {
  box-sizing: border-box;
}

body {
  background-color: #f5f7fa;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  /* Força remoção de scroll global */
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Altura fixa da viewport */
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
  color: #111;
  overflow: hidden;
  /* Remove scroll desnecessário */
  position: fixed;
  /* Fixa a posição */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

.header {
  text-align: center;
  padding: 2rem 0 0.5rem;
}

.logo {
  font-size: 2.8rem;
  color: #c4a882;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}

.main-content {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  flex: 1;
  /* Ocupa o espaço restante */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  /* Reduzido padding */
  min-height: 0;
  /* Permite que o flex funcione corretamente */
  overflow-y: auto;
  /* Permite scroll interno quando necessário */
}

.main-content h2 {
  font-size: 2rem;
  /* Reduzido tamanho */
  color: #ffffff;
  margin-bottom: 1rem;
  /* Reduzido margin */
  text-transform: uppercase;
}

.form-card {
  background: #fff;
  border: 2px solid #c4a882;
  border-radius: 12px;
  padding: 1.5rem;
  /* Reduzido padding */
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  /* Reduzido gap */
  box-sizing: border-box;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Sombra sutil */
  max-height: 70vh;
  /* Altura máxima para evitar que cresça demais */
  overflow-y: auto;
  /* Permite scroll interno quando necessário */
}

.form-card textarea {
  padding: 0.8rem;
  /* Reduzido padding */
  font-size: 0.9rem;
  /* Reduzido tamanho */
  border: 1.5px solid #c4a882;
  border-radius: 8px;
  resize: none;
  outline-offset: 2px;
  transition: all 0.3s ease;
  font-family: inherit;
  min-height: 120px;
  /* Altura mínima fixa */
}

.form-card textarea:focus {
  border-color: #ffdd00;
  outline: none;
  box-shadow: 0 0 0 2px rgba(196, 168, 130, 0.2);
}

.ask-btn {
  background-color: #c4a882;
  color: #fff;
  /* Texto branco para melhor contraste */
  border: none;
  padding: 0.8rem 1.5rem;
  /* Reduzido padding */
  border-radius: 8px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 0.8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  /* Reduzido tamanho */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  /* Altura mínima para acessibilidade */
  box-shadow: 0 2px 4px rgba(196, 168, 130, 0.3);
  /* Sombra com cor do botão */
}

.ask-btn:hover:not(:disabled) {
  background-color: #a08b5f;
  /* Cor bege mais escura no hover */
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(196, 168, 130, 0.4);
}

.ask-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.ask-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.error-message {
  color: #dc3545;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  /* Reduzido tamanho */
  background-color: rgba(220, 53, 69, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #dc3545;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 1rem;
  text-align: center;
}

.user-info h2 {
  margin: 0;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.user-details span {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
  /* Reduzido tamanho */
}

.logout-btn {
  background-color: #c4a882;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #aa9476;
}

.loading-overlay {
  width: 100%;
  min-height: 120px;
  background-color: #f8f9fa;
  border: 1px solid #c4a882;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #333;
  font-size: 0.9rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-container :deep(.spinner) {
  color: #c4a882;
}

.loading-overlay p {
  margin: 0;
  font-weight: 500;
  color: #c4a882;
}

.answer-box {
  width: 100%;
  background-color: #f8f9fa;
  border: 1px solid #c4a882;
  padding: 1rem;
  border-radius: 8px;
  color: #333;
  white-space: pre-wrap;
  font-size: 0.9rem;
  /* Reduzido tamanho */
  line-height: 1.5;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 120px;
  /* Altura mínima para a caixa de resposta */
  max-height: 300px;
  /* Altura máxima antes de permitir scroll interno */
  overflow-y: auto;
  /* Permite scroll interno se necessário */
}

/* Responsividade */
@media (max-width: 600px) {
  .container {
    padding: 0 1rem;
  }

  .main-content {
    padding: 0.5rem;
  }

  .main-content h2 {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  .form-card {
    padding: 1.2rem;
    max-width: 100%;
  }

  .form-card textarea {
    padding: 0.6rem;
    font-size: 0.85rem;
    min-height: 100px;
  }

  .ask-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
    min-height: 40px;
  }

  .user-details span {
    font-size: 0.85rem;
  }

  .loading-overlay {
    min-height: 100px;
    font-size: 0.85rem;
  }

  .answer-box {
    font-size: 0.85rem;
    padding: 0.8rem;
  }

  .footer {
    padding: 0.8rem 0;
    font-size: 0.75rem;
  }
}

/* Para telas muito pequenas */
@media (max-height: 600px) {
  .main-content {
    padding: 0.3rem;
  }

  .main-content h2 {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
  }

  .form-card {
    padding: 1rem;
    gap: 0.6rem;
  }

  .form-card textarea {
    padding: 0.5rem;
    font-size: 0.8rem;
    min-height: 80px;
  }

  .ask-btn {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    min-height: 36px;
  }

  .user-details span {
    font-size: 0.8rem;
  }

  .loading-overlay {
    min-height: 80px;
    font-size: 0.8rem;
  }

  .answer-box {
    font-size: 0.8rem;
    padding: 0.6rem;
  }

  .footer {
    padding: 0.5rem 0;
    font-size: 0.7rem;
  }
}
</style>
