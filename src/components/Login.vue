<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Header from './Header.vue'
import Footer from './Footer.vue'
import Spinner from './Spinner.vue'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  // Validação mais rigorosa
  const emailTrimmed = email.value.trim()
  const passwordTrimmed = password.value.trim()

  if (!emailTrimmed) {
    authStore.error = 'Digite seu email.'
    return
  }

  if (!passwordTrimmed) {
    authStore.error = 'Digite sua senha.'
    return
  }



  const success = await authStore.login(emailTrimmed, passwordTrimmed)

  if (success) {
    router.push('/home')
  }
}
</script>

<template>
  <div class="container">
    <Header />

    <main class="main-content">
      <h2>CONECTE-SE</h2>

      <div class="login-card">
        <h3>Faça login na sua conta</h3>
        <input type="email" placeholder="E-mail" v-model="email" :disabled="authStore.loading" />
        <input type="password" placeholder="Senha" v-model="password" :disabled="authStore.loading" />
        <button @click="handleLogin" :disabled="authStore.loading" class="login-btn">
          <Spinner v-if="authStore.loading" small />
          <span v-if="authStore.loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
        <p class="error" v-if="authStore.error">{{ authStore.error }}</p>
      </div>

      <p class="register-text">
        Não tem uma conta? <a href="/register">Cadastre-se</a>
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

.login-card {
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Sombra sutil */
}

.login-card h3 {
  font-size: 1.3rem;
  /* Reduzido tamanho */
  margin: 0 0 0.8rem;
  /* Reduzido margin */
  color: #333;
  font-weight: 600;
}

.login-card input {
  padding: 0.7rem 1rem;
  /* Reduzido padding */
  border: 1.5px solid #c4a882;
  border-radius: 6px;
  font-size: 0.9rem;
  /* Reduzido tamanho */
  transition: border-color 0.3s ease;
}

.login-card input:focus {
  outline: none;
  border-color: #ffdd00;
  box-shadow: 0 0 0 2px rgba(196, 168, 130, 0.2);
}

.login-btn {
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

.login-btn:hover:not(:disabled) {
  background-color: #a08b5f;
  /* Cor bege mais escura no hover */
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(196, 168, 130, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.error {
  color: #dc3545;
  font-weight: 600;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  /* Reduzido tamanho */
  background-color: rgba(220, 53, 69, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #dc3545;
}

.register-text {
  margin-top: 1rem;
  /* Reduzido margin */
  font-size: 0.9rem;
  /* Reduzido tamanho */
  color: #666;
}

.register-text a {
  color: #c4a882;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  background-color: rgba(196, 168, 130, 0.1);
  display: inline-block;
}

.register-text a:hover {
  color: #c4a882;
  background-color: rgba(196, 168, 130, 0.2);
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(196, 168, 130, 0.2);
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

  .login-card {
    padding: 1.2rem;
    max-width: 100%;
  }

  .login-card h3 {
    font-size: 1.2rem;
  }

  .login-card input {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  .login-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
    min-height: 40px;
  }

  .register-text {
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

  .login-card {
    padding: 1rem;
    gap: 0.6rem;
  }

  .login-card h3 {
    font-size: 1.1rem;
  }

  .login-card input {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }

  .login-btn {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    min-height: 36px;
  }

  .register-text {
    font-size: 0.8rem;
    margin-top: 0.6rem;
  }
}
</style>
