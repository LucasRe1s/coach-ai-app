<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { api } from '../utils/api'
import Header from './Header.vue'
import Footer from './Footer.vue'
import Spinner from './Spinner.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

async function submitForm() {
  // Validação mais rigorosa
  const nameTrimmed = name.value.trim()
  const emailTrimmed = email.value.trim()
  const passwordTrimmed = password.value.trim()
  const confirmPasswordTrimmed = confirmPassword.value.trim()

  if (!nameTrimmed || !emailTrimmed || !passwordTrimmed || !confirmPasswordTrimmed) {
    authStore.error = 'Por favor, preencha todos os campos.'
    return
  }
  if (passwordTrimmed !== confirmPasswordTrimmed) {
    authStore.error = 'As senhas não conferem.'
    return
  }



  loading.value = true
  try {
    const response = await api.post('/users', {
      name: nameTrimmed,
      email: emailTrimmed,
      password: passwordTrimmed,
    })

    if (!response.ok) {
      authStore.error = response.data.message || 'Erro ao cadastrar'
      loading.value = false
      return
    }

    // Limpa os campos e redireciona para login sem popup
    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    authStore.clearError() // Limpa qualquer erro anterior
    router.push('/login')
  } catch (err) {
    authStore.error = 'Erro na conexão com o servidor.'
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="container">
    <Header />

    <main class="main-content">
      <h2>Cadastro de Usuário</h2>

      <div class="form-card">
        <label for="name">Nome</label>
        <input id="name" type="text" v-model="name" placeholder="Digite seu nome" :disabled="loading" />

        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" placeholder="Digite seu email" :disabled="loading" />

        <label for="password">Senha</label>
        <input id="password" type="password" v-model="password" placeholder="Digite sua senha" :disabled="loading" />

        <label for="confirmPassword">Confirme a Senha</label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="Confirme sua senha"
          :disabled="loading" />

        <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>

        <button @click="submitForm" :disabled="loading" class="register-btn">
          <Spinner v-if="loading" small />
          <span v-if="loading">Cadastrando...</span>
          <span v-else>Cadastrar</span>
        </button>
      </div>

      <p class="login-text">
        Já tem uma conta? <a @click="goToLogin" class="login-link">Entrar</a>
      </p>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
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

.main-content {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  flex: 1;
  /* Ocupa o espaço restante */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Centraliza verticalmente */
  text-align: center;
  padding: 1rem;
  /* Reduzido padding */
  min-height: 0;
  /* Permite que o flex funcione corretamente */
}

.main-content h2 {
  font-size: 2rem;
  /* Reduzido tamanho */
  color: #c4a882;
  margin-bottom: 1rem;
  /* Reduzido margin */
  text-transform: uppercase;
  text-align: center;
  /* Garante centralização */
  width: 100%;
  /* Ocupa toda a largura */
}

.form-card {
  background: #fff;
  border: 2px solid #c4a882;
  border-radius: 12px;
  padding: 1.5rem;
  /* Reduzido padding */
  width: 100%;
  max-width: 450px;
  /* Reduzido max-width */
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  /* Reduzido gap */
  box-sizing: border-box;
}

.form-card label {
  text-align: left;
  font-weight: 600;
  color: #222;
  font-size: 0.9rem;
  /* Reduzido tamanho */
}

.form-card input {
  padding: 0.7rem 1rem;
  /* Reduzido padding */
  border: 1.5px solid #c4a882;
  border-radius: 6px;
  font-size: 0.9rem;
  /* Reduzido tamanho */
}

.register-btn {
  background-color: #c4a882;
  color: #fff;
  /* Texto branco para melhor contraste */
  border: none;
  padding: 0.8rem 1.5rem;
  /* Reduzido padding */
  border-radius: 6px;
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

.register-btn:hover:not(:disabled) {
  background-color: #a08b5f;
  /* Cor bege mais escura no hover */
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(196, 168, 130, 0.4);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.register-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.error-message {
  color: #b00000;
  font-weight: 600;
  text-align: center;
  font-size: 0.9rem;
  /* Reduzido tamanho */
  background-color: rgba(176, 0, 0, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #b00000;
}

.login-text {
  margin-top: 1rem;
  /* Reduzido margin */
  font-size: 0.9rem;
  /* Reduzido tamanho */
  color: #c4b6b6;
}

.login-text a {
  color: #c4a882;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  background-color: rgba(196, 168, 130, 0.1);
  display: inline-block;
  cursor: pointer;
}

.login-text a:hover {
  color: #c4a882;
  background-color: rgba(196, 168, 130, 0.2);
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(196, 168, 130, 0.2);
}

.login-link {
  cursor: pointer;
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

  .form-card label {
    font-size: 0.85rem;
  }

  .form-card input {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  .register-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
    min-height: 40px;
  }

  .login-text {
    font-size: 0.85rem;
    margin-top: 0.8rem;
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

  .form-card label {
    font-size: 0.8rem;
  }

  .form-card input {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }

  .register-btn {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    min-height: 36px;
  }

  .login-text {
    font-size: 0.8rem;
    margin-top: 0.6rem;
  }
}
</style>
