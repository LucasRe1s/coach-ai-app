<template>
  <header class="header">
    <div class="header-content" :class="{ 'home-layout': isHomePage, 'history-layout': isHistoryPage }">
      <button @click="goBack" class="back-btn" v-if="showBackButton && !isHomePage && !isHistoryPage">
        ← Voltar
      </button>

      <!-- Layout específico para Home -->
      <template v-if="isHomePage && authStore.isAuthenticated">
        <div class="home-title">
          <h1 class="logo">Coach AI</h1>
        </div>
        <div class="home-email">
          <span class="user-email">{{ authStore.user?.email }}</span>
        </div>
        <div class="home-actions">
          <button @click="handleLogout" class="logout-btn">Sair</button>
        </div>
      </template>

      <!-- Layout específico para History -->
      <template v-else-if="isHistoryPage && authStore.isAuthenticated">
        <div class="history-back">
          <button @click="goBack" class="back-btn">← Voltar</button>
        </div>
        <div class="history-title">
          <h1 class="logo">Histórico</h1>
        </div>
        <div class="history-actions">
          <button @click="handleLogout" class="logout-btn">Sair</button>
        </div>
      </template>

      <!-- Layout padrão para outras páginas -->
      <template v-else>
        <div class="logo-container">
          <h1 class="logo">Coach AI</h1>
        </div>
        <div v-if="authStore.isAuthenticated" class="user-menu">
          <span class="user-email">{{ authStore.user?.email }}</span>
          <button @click="handleLogout" class="logout-btn">Sair</button>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Determina se deve mostrar o botão de voltar
const showBackButton = computed(() => {
  // Não mostrar na página de boas-vindas
  return route.name !== 'Welcome'
})

// Determina se está na página Home
const isHomePage = computed(() => {
  return route.name === 'Home'
})

// Determina se está na página History
const isHistoryPage = computed(() => {
  return route.name === 'History'
})

function handleLogout() {
  authStore.logout()
  router.push('/welcome')
}

function goBack() {
  // Lógica de navegação para voltar
  if (route.name === 'Login') {
    router.push('/welcome')
  } else if (route.name === 'Register') {
    router.push('/welcome')
  } else if (route.name === 'Home') {
    router.push('/welcome')
  } else if (route.name === 'History') {
    router.push('/home')
  } else {
    // Fallback: voltar para welcome
    router.push('/welcome')
  }
}

</script>

<style scoped>
.header {
  text-align: center;
  padding: 2rem 0 0.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  min-height: 80px;
  /* Altura mínima para garantir espaço */
}

.back-btn {
  background: none;
  border: 2px solid #c4a882;
  color: #c4a882;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  position: relative;
  z-index: 10;
  /* Garante que fique acima do logo */
  flex-shrink: 0;
  /* Evita que o botão encolha */
}

.back-btn:hover {
  background-color: #c4a882;
  color: #111;
}

.logo-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  /* Permite clicar nos elementos atrás */
}

.logo {
  font-size: 2.8rem;
  color: #c4a882;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  pointer-events: auto;
  /* Permite interação com o logo */
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 10;
  /* Garante que fique acima do logo */
  flex-shrink: 0;
  /* Evita que o menu encolha */
}

/* Layout específico para Home */
.home-layout {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}

/* Layout específico para History */
.history-layout {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}

.history-back {
  justify-self: start;
  display: flex;
  align-items: center;
}

.history-title {
  justify-self: center;
}

.history-title .logo {
  font-size: 2.2rem;
  margin: 0;
  color: #c4a882;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* Centralizar botão de sair na página de histórico */
.history-actions {
  justify-self: end;
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.home-title {
  justify-self: start;
}

.home-title .logo {
  font-size: 2.2rem;
  margin: 0;
  color: #c4a882;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.home-email {
  justify-self: center;
  text-align: center;
}

.home-email .user-email {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.home-actions {
  justify-self: end;
  display: flex;
  gap: 0.8rem;
  align-items: center;
}



.user-email {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
}

.logout-btn {
  background-color: #c4a882;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(196, 168, 130, 0.3);
}

.logout-btn:hover {
  background-color: #a08b5f;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(196, 168, 130, 0.4);
}

/* Tablets e telas médias */
@media (max-width: 768px) {
  .header {
    padding: 1.5rem 0 0.5rem;
  }

  .header-content {
    padding: 0 1.5rem;
    min-height: 70px;
  }

  .logo {
    font-size: 2.4rem;
    letter-spacing: 1.5px;
  }

  .back-btn {
    font-size: 0.85rem;
    padding: 0.45rem 0.9rem;
  }

  .user-email {
    font-size: 0.85rem;
  }

  .logout-btn {
    padding: 0.55rem 1.1rem;
    font-size: 0.8rem;
  }
}

/* Tablets pequenos */
@media (max-width: 600px) {
  .header {
    padding: 1.2rem 0 0.5rem;
  }

  .header-content {
    padding: 0 1rem;
    min-height: 65px;
  }

  .logo {
    font-size: 2.2rem;
    letter-spacing: 1px;
  }

  .back-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .user-email {
    font-size: 0.8rem;
  }

  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}

/* Smartphones */
@media (max-width: 480px) {
  .header {
    padding: 1rem 0 0.5rem;
  }

  .header-content {
    padding: 0 0.8rem;
    min-height: 60px;
    gap: 1rem;
    /* Mais espaço entre elementos */
  }

  .logo {
    font-size: 1.8rem;
    letter-spacing: 0.8px;
  }

  .back-btn {
    font-size: 0.7rem;
    padding: 0.3rem 0.8rem;
    min-width: 60px;
    /* Largura mínima para evitar sobreposição */
    margin-right: 0.5rem;
    /* Espaço extra à direita */
  }

  .user-email {
    font-size: 0.7rem;
    max-width: 120px;
    /* Limita largura do email */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logout-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.65rem;
    min-width: 50px;
    /* Largura mínima */
  }

  /* Layout Home específico para mobile */
  .home-layout {
    grid-template-columns: 1fr auto 1fr;
    gap: 0.3rem;
  }

  .home-title .logo {
    font-size: 1.2rem;
    /* letter-spacing: 0.5px; */
  }

  .home-email .user-email {
    font-size: 0.7rem;
    max-width: 100px;
  }

  .home-actions {
    gap: 0.5rem;
  }

  .home-actions .logout-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.6rem;
    min-width: 45px;
  }

  /* Layout History específico para mobile */
  .history-layout {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    text-align: center;
  }

  .history-back {
    justify-self: center;
  }

  .history-title .logo {
    font-size: 1.2rem;
  }

  .history-actions {
    justify-self: center;
    gap: 0.5rem;
  }

  .history-actions .logout-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.6rem;
    min-width: 45px;
  }
}

/* Smartphones muito pequenos */
@media (max-width: 360px) {
  .header {
    padding: 0.8rem 0 0.5rem;
  }

  .header-content {
    padding: 0 0.6rem;
    min-height: 55px;
    gap: 0.8rem;
    /* Mais espaço entre elementos */
  }

  .logo {
    font-size: 1.6rem;
    letter-spacing: 0.5px;
  }

  .back-btn {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    min-width: 50px;
  }

  .user-email {
    font-size: 0.65rem;
    max-width: 100px;
    /* Largura ainda menor */
  }

  .logout-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.6rem;
    min-width: 45px;
  }

  /* Layout Home para telas muito pequenas */
  .home-layout {
    gap: 0.2rem;
  }

  .home-title .logo {
    font-size: 1.2rem;
    letter-spacing: 0.3px;
  }

  .home-email .user-email {
    font-size: 0.65rem;
    max-width: 80px;
  }

  .home-actions {
    gap: 0.4rem;
  }

  .home-actions .logout-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.55rem;
    min-width: 40px;
  }

  /* Layout History para telas muito pequenas */
  .history-layout {
    gap: 0.3rem;
  }

  .history-title .logo {
    font-size: 1.2rem;
    letter-spacing: 0.3px;
  }

  .history-actions {
    gap: 0.4rem;
  }

  .history-actions .logout-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.55rem;
    min-width: 40px;
  }
}

/* Para telas muito altas (landscape em mobile) */
@media (max-height: 500px) and (orientation: landscape) {
  .header {
    padding: 0.8rem 0 0.3rem;
  }

  .header-content {
    min-height: 50px;
  }

  .logo {
    font-size: 1.8rem;
  }

  .back-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }

  .logout-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }
}

/* iPhone e dispositivos com tela muito estreita */
@media (max-width: 375px) {
  .header-content {
    padding: 0 0.5rem;
    gap: 0.6rem;
  }

  .logo {
    font-size: 1.5rem;
    letter-spacing: 0.3px;
  }

  .back-btn {
    font-size: 0.6rem;
    padding: 0.2rem 0.4rem;
    min-width: 45px;
  }

  .user-email {
    font-size: 0.6rem;
    max-width: 80px;
  }

  .logout-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.55rem;
    min-width: 40px;
  }

  /* Layout Home para iPhone */
  .home-layout {
    gap: 0.15rem;
  }

  .home-title .logo {
    font-size: 1.1rem;
    letter-spacing: 0.2px;
  }

  .home-email .user-email {
    font-size: 0.6rem;
    max-width: 70px;
  }
}
</style>
