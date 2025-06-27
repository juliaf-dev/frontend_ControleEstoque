# Frontend - Sistema de Estoque

Frontend do sistema de controle de estoque "So bugiganga" desenvolvido em React.

## Funcionalidades

- **Autenticação**: Login, cadastro e recuperação de senha
- **Dashboard**: Visão geral com produtos em estoque
- **Gestão de Produtos**: Listagem, filtros por categoria
- **Fornecedores**: Gestão de fornecedores
- **Histórico de Vendas**: Visualização de vendas realizadas
- **Caixa**: Sistema de vendas com baixa automática no estoque

## Configuração

### 1. Instalação de Dependências

```bash
npm install
```

### 2. Configuração da API

O frontend está configurado para funcionar tanto em desenvolvimento local quanto em produção (Render).

#### Para Desenvolvimento Local:
- O backend deve estar rodando em `http://localhost:3000`
- Não é necessária configuração adicional

#### Para Produção (Render):
1. Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_API_URL=https://seu-app.onrender.com
```

2. Ou edite o arquivo `src/config/environment.js` e atualize a URL de produção.

### 3. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.jsx      # Header do dashboard
│   ├── MainButtons.jsx # Botões principais
│   └── ProdutosSection.jsx # Seção de produtos
├── contexts/           # Contextos React
│   └── AuthContext.jsx # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── Login.jsx       # Página de login
│   ├── Cadastro.jsx    # Página de cadastro
│   ├── Dashboard.jsx   # Dashboard principal
│   └── ...
├── services/           # Serviços de API
│   ├── api.js         # Configuração base do axios
│   ├── authService.js # Serviços de autenticação
│   ├── productService.js # Serviços de produtos
│   └── ...
└── config/            # Configurações
    └── environment.js # Configuração de ambiente
```

## Serviços Implementados

### Autenticação (`authService.js`)
- Login
- Cadastro
- Recuperação de senha
- Logout

### Produtos (`productService.js`)
- Listar produtos
- Buscar produto por ID
- Criar produto
- Atualizar produto
- Deletar produto
- Atualizar estoque
- Produtos com estoque baixo

### Categorias (`categoryService.js`)
- Listar categorias
- Buscar categoria por ID
- Criar categoria
- Atualizar categoria
- Deletar categoria

### Fornecedores (`fornecedorService.js`)
- Listar fornecedores
- Buscar fornecedor por ID
- Criar fornecedor
- Atualizar fornecedor
- Deletar fornecedor

### Pedidos (`pedidoService.js`)
- Listar pedidos
- Buscar pedido por ID
- Criar pedido
- Atualizar pedido
- Deletar pedido

## Uso

1. **Login**: Acesse a página inicial e faça login com suas credenciais
2. **Dashboard**: Após o login, você será redirecionado para o dashboard
3. **Navegação**: Use os botões principais para acessar as diferentes funcionalidades
4. **Produtos**: Visualize produtos em estoque e filtre por categorias
5. **Logout**: Use o botão "Sair" no header para fazer logout

## Tecnologias Utilizadas

- React 19
- React Router DOM
- Axios
- CSS puro (sem Tailwind)
- Context API para gerenciamento de estado

## Desenvolvimento

Para adicionar novas funcionalidades:

1. Crie novos serviços em `src/services/`
2. Adicione novas páginas em `src/pages/`
3. Crie componentes reutilizáveis em `src/components/`
4. Atualize as rotas em `src/App.jsx`
5. Adicione estilos CSS conforme necessário
