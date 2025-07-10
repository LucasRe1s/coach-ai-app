# Coach AI - Frontend

Aplicação frontend desenvolvida com Vue 3, Pinia e Vue Router para um assistente musical com inteligência artificial.

## 🚀 Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **Pinia** - Gerenciamento de estado
- **Vue Router 4** - Roteamento com guards de autenticação
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes Vue
│   ├── Header.vue      # Header com logout
│   ├── Footer.vue      # Footer
│   ├── Home.vue        # Página principal (protegida)
│   ├── Login.vue       # Página de login
│   ├── Register.vue    # Página de registro
│   ├── WelcomePage.vue # Página de boas-vindas
│   └── LP.vue          # Landing page
├── stores/             # Stores Pinia
│   ├── auth.ts         # Store de autenticação
│   └── index.ts        # Configuração centralizada
├── router/             # Configuração de rotas
│   └── index.ts        # Router com guards
├── composables/        # Composables Vue
│   └── useAuth.ts      # Composable de autenticação
├── utils/              # Utilitários
│   └── api.ts          # Cliente HTTP centralizado
├── config/             # Configurações
│   └── index.ts        # Configurações globais
├── types/              # Tipos TypeScript
│   └── auth.d.ts       # Tipos de autenticação
└── main.ts             # Entry point
```

## 🔐 Funcionalidades de Autenticação

### Login
- Validação de campos
- Integração com API backend
- Armazenamento seguro de token
- Redirecionamento automático

### Registro
- Validação de formulário
- Confirmação de senha
- Integração com API

### Logout
- Limpeza completa do estado
- Remoção do token do localStorage
- Redirecionamento para welcome

### Proteção de Rotas
- Guards de navegação
- Verificação automática de autenticação
- Redirecionamento inteligente

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

### API Backend
O projeto espera um backend rodando na porta 3000 com os seguintes endpoints:

- `POST /auth` - Login
- `POST /users` - Registro
- `GET /verify-token` - Verificação de token
- `POST /welcome` - Chat com IA (protegido)

## 📱 Rotas

- `/` - Redireciona para `/welcome`
- `/welcome` - Página de boas-vindas (pública)
- `/login` - Página de login (pública)
- `/register` - Página de registro (pública)
- `/home` - Página principal (protegida)
- `/LP` - Landing page (pública)

## 🎨 Estilo

O projeto utiliza Tailwind CSS para estilização, com um design moderno e responsivo.

### Cores Principais
- **Primária**: `#c4a882` (dourado)
- **Secundária**: `#ffdd00` (amarelo)
- **Fundo**: `#f5f7fa` (cinza claro)

## 🔒 Segurança

- Tokens JWT armazenados no localStorage
- Verificação automática de validade do token
- Proteção de rotas sensíveis
- Limpeza automática de dados na sessão

## 📝 Desenvolvimento

### Adicionando Novas Rotas
1. Adicione a rota em `src/router/index.ts`
2. Configure o meta `requiresAuth` conforme necessário
3. Crie o componente correspondente

### Adicionando Novas Stores
1. Crie o arquivo da store em `src/stores/`
2. Exporte a store em `src/stores/index.ts`
3. Use a store nos componentes

### Padrões de Código
- Use Composition API
- Utilize TypeScript para tipagem
- Siga as convenções de nomenclatura
- Mantenha componentes pequenos e focados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
