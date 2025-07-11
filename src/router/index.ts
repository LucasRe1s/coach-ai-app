import { createRouter, createWebHistory } from 'vue-router'
import Register from '../components/Register.vue'
import WelcomePage from '../components/WelcomePage.vue'
import LoginPage from '../components/Login.vue'
import Home from '../components/Home.vue'
import History from '../components/History.vue'

const routes = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/history",
    name: "History",
    component: History,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegação
router.beforeEach(async (to, _from, next) => {
  // Importar a store aqui para evitar problemas de inicialização
  const { useAuthStore } = await import('../stores/auth')
  const authStore = useAuthStore()

  // Se a rota requer autenticação
  if (to.meta.requiresAuth) {
    // Verificar se está autenticado
    if (!authStore.isLoggedIn) {
      // Se não está logado, redirecionar para login
      next('/login')
      return
    }

    // Se tem token mas não tem dados do usuário, verificar autenticação
    if (!authStore.isAuthenticated) {
      const isValid = await authStore.checkAuth()
      if (!isValid) {
        next('/login')
        return
      }
    }
  }

  // Se está logado e tenta acessar login/register, redirecionar para home
  if (authStore.isLoggedIn && (to.name === 'Login' || to.name === 'Register')) {
    next('/home')
    return
  }

  next()
})

export default router
