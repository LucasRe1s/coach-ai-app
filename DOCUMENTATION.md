# 📚 Documentação Técnica - Coach AI

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Frontend - Vue.js](#frontend---vuejs)
4. [Backend - Node.js](#backend---nodejs)
5. [Banco de Dados](#banco-de-dados)
6. [Autenticação e Segurança](#autenticação-e-segurança)
7. [APIs e Endpoints](#apis-e-endpoints)
8. [Fluxos de Usuário](#fluxos-de-usuário)
9. [Componentes e Estrutura](#componentes-e-estrutura)
10. [Configuração e Deploy](#configuração-e-deploy)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **Coach AI** é uma aplicação web full-stack que oferece um assistente musical inteligente. O sistema permite que usuários façam perguntas sobre música e recebam respostas baseadas em IA.

### Objetivos do Sistema
- Fornecer assistência musical personalizada
- Permitir autenticação segura de usuários
- Oferecer interface responsiva e intuitiva
- Manter histórico de conversas
- Escalar horizontalmente

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Arquitetura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Vue.js)      │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tecnologias Utilizadas

#### Frontend
- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Vue Router** - Roteamento SPA
- **Pinia** - Gerenciamento de estado
- **CSS3** - Estilização customizada

#### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação por token
- **Zod** - Validação de dados
- **bcrypt** - Hash de senhas

---

## 🎨 Frontend - Vue.js

### Estrutura de Pastas

```
coach-ai-app/
├── src/
│   ├── components/         # Componentes Vue reutilizáveis
│   │   ├── Header.vue      # Cabeçalho com navegação
│   │   ├── Footer.vue      # Rodapé
│   │   ├── Spinner.vue     # Componente de loading
│   │   ├── Home.vue        # Página principal
│   │   ├── Login.vue       # Página de login
│   │   ├── Register.vue    # Página de cadastro
│   │   └── WelcomePage.vue # Página de boas-vindas
│   ├── stores/             # Gerenciamento de estado (Pinia)
│   │   └── auth.ts         # Store de autenticação
│   │   └── conversations.ts # Gerencia conversas e mensagens com Pinia
│   │   └── index.ts        # Configura e exporta o Pinia
│   ├── composables/        # Hooks 
│   │   └── index.ts        # autenticação que expõe os estados
│   ├── config/             # Configuração
│   │   └── index.ts        # Define a configuração global da aplicação
│   ├── router/             # Configuração de rotas
│   │   └── index.ts        # Definição das rotas
│   ├── utils/              # Utilitários
│   │   └── api.ts          # Cliente HTTP para API
│   ├── config/             # Configurações
│   │   └── index.ts        # Configurações da aplicação
│   ├── App.vue             # Componente raiz
│   └── main.ts             # Ponto de entrada
│   └── style.css           # Estilo global
├── public/                 # Arquivos estáticos
├── dist/                   # Build de produção
├── .env                    # Variáveis de ambiente
├── package.json            # Dependências e scripts
├── vite.config.ts          # Configuração do Vite
└── README.md               # Este arquivo
```

### Componentes Principais

#### Header.vue
**Responsabilidades:**
- Navegação entre páginas
- Exibição do logo
- Botão de logout
- Layout responsivo para mobile

**Funcionalidades:**
- Layout específico para página Home (mobile)
- Botão de voltar condicional
- Exibição do email do usuário
- Integração com store de autenticação

#### Home.vue
**Responsabilidades:**
- Interface principal do assistente
- Formulário de perguntas
- Exibição de respostas
- Modal de edição de perfil
- Botão para acessar histórico

**Funcionalidades:**
- Chat com IA
- Loading states
- Tratamento de erros
- Edição de dados do usuário
- Layout responsivo com scroll interno

#### Login.vue / Register.vue
**Responsabilidades:**
- Autenticação de usuários
- Validação de formulários
- Integração com API
- Redirecionamento após sucesso

### Gerenciamento de Estado (Pinia)

#### Store de Autenticação (`auth.ts`)
```typescript
interface User {
  id: string
  email: string
  name?: string
}

interface AuthStore {
  user: Ref<User | null>
  token: Ref<string | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  isAuthenticated: ComputedRef<boolean>
  isLoggedIn: ComputedRef<boolean>
  
  // Actions
  login(email: string, password: string): Promise<boolean>
  logout(): void
  checkAuth(): Promise<boolean>
  clearError(): void
}
```

### Roteamento e Guards

#### Configuração de Rotas
```typescript
const routes = [
  { path: '/', redirect: '/welcome' },
  { path: '/welcome', name: 'Welcome', component: WelcomePage, meta: { requiresAuth: false } },
  { path: '/register', name: 'Register', component: Register, meta: { requiresAuth: false } },
  { path: '/login', name: 'Login', component: LoginPage, meta: { requiresAuth: false } },
  { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/history', name: 'History', component: History, meta: { requiresAuth: true } },
]
```

#### Guards de Navegação
- Verificação de autenticação
- Redirecionamento automático
- Proteção de rotas sensíveis
- Verificação de validade do token

---

## ⚙️ Backend - Node.js

### Estrutura do Backend
```
backend/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── models/          # Modelos do MongoDB
│   ├── routes/          # Definição das rotas
│   ├── middleware/      # Middlewares customizados
│   ├── utils/           # Utilitários
│   ├── config/          # Configurações
│   └── app.js          # Aplicação principal
├── package.json
└── .env
```

### Modelos de Dados

#### User Model
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
```

### Middlewares

#### Autenticação JWT
- Verificação de token
- Extração de dados do usuário
- Proteção de rotas

#### Validação de Dados
- Validação com Zod
- Sanitização de entrada
- Tratamento de erros

---

## 🗄️ Banco de Dados

### MongoDB
- **Database**: `coach-ai`
- **Collections**: `users`, `conversations` (futuro)
- **Indexes**: Email único para usuários

### Conexão
```javascript
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
```

---

## 🔐 Autenticação e Segurança

### JWT (JSON Web Tokens)
- **Algoritmo**: HS256
- **Expiração**: 24 horas
- **Payload**: `{ user_id, email, name, iat, exp }`

### Hash de Senhas
- **Algoritmo**: bcrypt
- **Salt Rounds**: 12
- **Verificação**: Comparação segura

### Validação de Dados
- **Zod**: Validação de schemas
- **Sanitização**: Limpeza de entrada
- **Rate Limiting**: Proteção contra spam

---

## 🌐 APIs e Endpoints

### Autenticação
```http
POST /auth
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
}
```

### Usuários
```http
POST /users
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "email": "newemail@example.com",
  "password": "current_password",
  "newPassword": "new_password"
}
```

### Assistente IA
```http
POST /ask
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "Como montar uma escala menor harmônica?"
}

Response:
{
  "answer": "Uma escala menor harmônica é construída..."
}
```

### Verificação de Token
```http
GET /verify-token
Authorization: Bearer <token>

Response:
{
  "valid": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

---

## 🔄 Fluxos de Usuário

### 1. Cadastro de Usuário
```
1. Usuário acessa /register
2. Preenche formulário (nome, email, senha, confirmação)
3. Validação client-side
4. Envio para POST /users
5. Validação server-side
6. Hash da senha
7. Criação do usuário no MongoDB
8. Redirecionamento para /login
```

### 2. Login
```
1. Usuário acessa /login
2. Preenche email e senha
3. Validação client-side
4. Envio para POST /auth
5. Verificação de credenciais
6. Comparação de senha hash
7. Geração do JWT
8. Armazenamento do token
9. Redirecionamento para /home
```

### 3. Uso do Assistente
```
1. Usuário acessa /home (protegida)
2. Verificação de autenticação
3. Interface do chat
4. Digitação da pergunta
5. Loading state
6. Envio para POST /ask
7. Processamento pela IA
8. Exibição da resposta
9. Limpeza do formulário
```

### 4. Edição de Perfil
```
1. Clique em "Editar Perfil"
2. Abertura do modal
3. Preenchimento dos campos
4. Validação de dados
5. Extração do ID do token JWT
6. Envio para PUT /users/:id
7. Atualização no MongoDB
8. Atualização do store
9. Fechamento do modal
```

### 5. Histórico
```
1. Clique em "HISTÓRICO"
2. Verificação de autenticação
3. Vizualiza as conversas anteriores
```
---

## 🎨 Componentes e Estrutura

### Design System

#### Cores
```css
:root {
  --main-color: #c4a882;      /* Bege/Dourado */
  --accent-color: #ffdd00;    /* Amarelo */
  --error-color: #dc3545;     /* Vermelho */
  --text-color: #333;         /* Texto escuro */
  --light-text: #666;         /* Texto claro */
  --success-color: #28a745;   /* Verde */
}
```

#### Tipografia
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
font-sizes: 0.8rem - 2.8rem (responsivo)
```

#### Breakpoints
```css
/* Desktop */
@media (min-width: 768px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Mobile */
@media (max-width: 600px) { }

/* Mobile pequeno */
@media (max-width: 480px) { }
```

### Componentes Reutilizáveis

#### Spinner.vue
```vue
<template>
  <div class="spinner" :class="{ small }">
    <div class="spinner-ring"></div>
  </div>
</template>

<script setup>
defineProps({
  small: { type: Boolean, default: false }
})
</script>
```

#### Modal System
- Overlay com backdrop
- Fechamento por clique fora
- Animações CSS
- Responsivo
- Acessível (ARIA)

---

## ⚙️ Configuração e Deploy

### Variáveis de Ambiente

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/
```

#### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coach-ai
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### Scripts de Build
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### Deploy

#### Vercel (Frontend)
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

#### Backend (Vercel/Railway/Render)
1. Configurar variáveis de ambiente
2. Conectar banco MongoDB Atlas
3. Deploy da aplicação Node.js

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de CORS
**Sintoma**: Erro no console do navegador
**Solução**: Configurar proxy no Vite ou CORS no backend

#### 2. Token Inválido
**Sintoma**: Redirecionamento para login
**Solução**: Verificar expiração do JWT e secret

#### 3. Erro de Conexão com MongoDB
**Sintoma**: Erro no servidor
**Solução**: Verificar URI e conectividade

#### 4. Build Falhando
**Sintoma**: Erro no TypeScript
**Solução**: Verificar tipos e imports

### Logs e Debugging

#### Frontend
```javascript
// Habilitar logs de desenvolvimento
console.log('Debug info:', data)
```

#### Backend
```javascript
// Logs estruturados
console.log('API Request:', { method, url, body })
```

### Performance

#### Otimizações Frontend
- Lazy loading de componentes
- Code splitting
- Minificação de assets
- Cache de API

#### Otimizações Backend
- Compressão gzip
- Cache de respostas
- Indexação do MongoDB
- Rate limiting

---

## 📈 Monitoramento e Analytics

### Métricas Importantes
- Tempo de resposta da API
- Taxa de erro
- Usuários ativos
- Conversões (cadastro → uso)

### Ferramentas Recomendadas
- **Sentry** - Monitoramento de erros
- **Google Analytics** - Analytics de usuário
- **MongoDB Atlas** - Monitoramento do banco
- **Vercel Analytics** - Performance do frontend

---

## 🚀 Roadmap e Melhorias

### Curto Prazo
- [ ] Histórico de conversas
- [ ] Upload de arquivos de áudio
- [ ] Notificações push
- [ ] PWA (Progressive Web App)

### Médio Prazo
- [ ] Chat em tempo real (WebSocket)
- [ ] Análise de partituras
- [ ] Exercícios interativos
- [ ] Gamificação

### Longo Prazo
- [ ] IA mais avançada
- [ ] Integração com APIs musicais
- [ ] Aplicativo mobile nativo
- [ ] Comunidade de usuários

---

## 📞 Suporte e Contato

### Documentação Adicional
- [Vue.js Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Comunidade
- GitHub Issues para bugs
- Email para suporte direto

---

**Documentação atualizada em: Julho 2025**
**Versão: 1.0.0** 