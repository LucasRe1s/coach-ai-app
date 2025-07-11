# 🎵 Coach AI - Assistente Musical Inteligente

[🔗 Acesse a aplicação aqui](https://coach-ai-app-indol.vercel.app/)

Um assistente musical baseado em IA que ajuda músicos e estudantes de música com dúvidas sobre teoria musical, história da musica e muito mais.

## 🚀 Tecnologias

### Frontend
- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **Vue Router** - Roteamento oficial do Vue
- **Pinia** - Gerenciamento de estado
- **CSS3** - Estilização customizada

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/LucasRe1s/coach-ai-app
cd coach-ai-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3000/
```

### 4. Configure o backend
Certifique-se de que o backend está rodando na porta 3000. Se necessário, ajuste a URL no arquivo `.env`.

### 5. Execute o projeto
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🎯 Funcionalidades

### 🔐 Autenticação
- **Cadastro de usuário** - Criação de conta com nome, email e senha
- **Login** - Autenticação segura com JWT
- **Logout** - Encerramento de sessão
- **Proteção de rotas** - Acesso restrito a usuários autenticados

### 👤 Perfil do Usuário
- **Edição de dados** - Atualização de nome, email e senha
- **Modal responsivo** - Interface intuitiva para edição
- **Validação de dados** - Verificação de campos obrigatórios

### 🤖 Assistente Musical
- **Perguntas sobre música** - Tire dúvidas sobre teoria musical
- **Respostas em tempo real** - Interface com loading states
- **Histórico de conversas** - Visualização das respostas anteriores

### 📱 Interface Responsiva
- **Design mobile-first** - Otimizado para dispositivos móveis
- **Tema consistente** - Paleta de cores /bege/dourado (#c4a882)
- **Componentes reutilizáveis** - Header, Footer, Spinner, etc.

## 🏗️ Estrutura do Projeto

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

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL do seu backend em produção
3. Deploy automático a cada push

## 🔒 Segurança

- **Autenticação JWT** - Tokens seguros para sessões
- **Validação de dados** - Verificação de entrada do usuário
- **Proteção de rotas** - Acesso restrito a usuários autenticados
- **HTTPS** - Comunicação criptografada em produção

## 🎨 Design System

### Cores
- **Primária**: `#c4a882` (Bege/Dourado)
- **Secundária**: `#ffdd00` (Amarelo)
- **Erro**: `#dc3545` (Vermelho)
- **Sucesso**: `#28a745` (Verde)

### Tipografia
- **Fonte**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Tamanhos**: Responsivos (0.8rem - 2.8rem)

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:
- **Desktop**: > 768px
- **Tablet**: 600px - 768px
- **Mobile**: < 600px
- **Mobile pequeno**: < 480px

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:
- Abra uma [issue](https://github.com/seu-usuario/coach-ai-app/issues)
- Entre em contato: lucaasreiis17@gmail.com

---

**Desenvolvido com ❤️ para a comunidade musical**
