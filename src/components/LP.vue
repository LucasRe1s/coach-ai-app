<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRegister() {
  router.push('/register')
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="landing-page">
    <header class="header">
      <h1 class="logo">Coach AI</h1>
      <nav>
        <button class="btn-login" @click="goToLogin">Login</button>
        <button class="btn-register" @click="goToRegister">Cadastrar</button>
      </nav>
    </header>

    <main class="main-content">
      <h2>Bem-vindo ao Coach AI</h2>
      <p>
        Descubra uma nova forma de aprender música com inteligência artificial.
        Faça perguntas, tire dúvidas e evolua no seu ritmo.
      </p>
      <div class="cta-buttons">
        <button @click="goToLogin">Comece Agora</button>
        <button @click="goToRegister" class="secondary">Criar Conta</button>
      </div>
    </main>

    <footer class="footer">
      <p>© 2025 Coach AI - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<style scoped>
/* Reset completo para evitar scroll */
* {
  box-sizing: border-box;
}

/* Fundo global */
body {
  background-color: #f5f7fa;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden; /* Força remoção de scroll global */
}

.landing-page {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Altura fixa da viewport */
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
  color: #111;
  overflow: hidden; /* Remove scroll desnecessário */
  position: fixed; /* Fixa a posição */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0; /* Reduzido padding */
  flex-shrink: 0; /* Evita que o header encolha */
  min-height: 80px; /* Altura mínima fixa */
}

.logo {
  font-size: 2.2rem; /* Reduzido tamanho */
  color: #ffdd00;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}

.header nav button {
  background: none;
  border: 2px solid #ffdd00;
  color: #ffdd00;
  padding: 0.4rem 1rem; /* Reduzido padding */
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  margin-left: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem; /* Reduzido tamanho */
}

.header nav button:hover {
  background-color: #ffdd00;
  color: #111;
}

/* Main Content */
.main-content {
  flex: 1; /* Ocupa o espaço restante */
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 1rem; /* Reduzido padding */
  min-height: 0; /* Permite que o flex funcione corretamente */
}

.main-content h2 {
  font-size: 2.5rem; /* Reduzido tamanho */
  color: #ffdd00;
  margin-bottom: 0.5rem; /* Reduzido margin */
  text-transform: uppercase;
  font-weight: 800;
}

.main-content p {
  font-size: 1.2rem; /* Reduzido tamanho */
  color: #333;
  margin-bottom: 2rem; /* Reduzido margin */
  max-width: 600px; /* Reduzido max-width */
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

/* CTA Buttons */
.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem; /* Reduzido gap */
  flex-wrap: wrap;
}

.cta-buttons button {
  background-color: #ffdd00;
  color: #111;
  border: none;
  padding: 0.8rem 2rem; /* Reduzido padding */
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem; /* Reduzido tamanho */
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 140px; /* Reduzido min-width */
}

.cta-buttons button.secondary {
  background-color: transparent;
  border: 2px solid #ffdd00;
  color: #ffdd00;
}

.cta-buttons button:hover {
  background-color: #e6c200;
  color: #111;
}

.cta-buttons button.secondary:hover {
  background-color: #ffdd00;
  color: #111;
}

/* Footer */
.footer {
  padding: 1rem 0; /* Reduzido padding */
  text-align: center;
  color: #999;
  font-size: 0.8rem; /* Reduzido tamanho */
  user-select: none;
  flex-shrink: 0; /* Evita que o footer encolha */
  min-height: 60px; /* Altura mínima fixa */
}

/* Responsividade */
@media (max-width: 600px) {
  .landing-page {
    padding: 0 1rem;
  }

  .header {
    padding: 1rem 0;
    min-height: 60px;
  }

  .header nav button {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }

  .logo {
    font-size: 1.8rem;
  }

  .main-content h2 {
    font-size: 2rem;
  }

  .main-content p {
    font-size: 1rem;
    padding: 0 0.5rem;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 0.8rem;
  }

  .cta-buttons button {
    width: 100%;
    min-width: unset;
    padding: 0.7rem 1.5rem;
  }

  .footer {
    padding: 0.8rem 0;
    min-height: 50px;
  }
}

/* Para telas muito pequenas */
@media (max-height: 600px) {
  .header {
    padding: 0.8rem 0;
    min-height: 50px;
  }

  .main-content {
    padding: 0.5rem;
  }

  .main-content h2 {
    font-size: 2rem;
    margin-bottom: 0.3rem;
  }

  .main-content p {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .footer {
    padding: 0.5rem 0;
    min-height: 40px;
  }
}
</style>
