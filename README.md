# Frontend - Sistema de Controle de Estoque

Frontend do sistema de controle de estoque "So Bugiganga" desenvolvido em React.

## Funcionalidades

- Autenticação: Login, cadastro e recuperação de senha
- Dashboard: Visão geral com produtos em estoque
- Gestão de Produtos: Listagem, filtros por categoria
- Fornecedores: Gestão de fornecedores
- Histórico de Vendas: Visualização de vendas realizadas
- Caixa: Sistema de vendas com baixa automática no estoque

## Instalação e Execução

1. **Instale as dependências:**
```bash
npm install
```
2. **Configuração da API:**
   - O backend deve estar rodando em `http://localhost:3000` para desenvolvimento local.
   - Para produção, a URL da API está configurada em `src/config/environment.js`.
3. **Execute o projeto:**
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
├── contexts/            # Contextos React
├── pages/               # Páginas da aplicação
├── services/            # Serviços de API
├── config/              # Configurações
├── assets/              # Imagens e recursos
├── styles/              # Variáveis e estilos globais
└── utils/               # Funções utilitárias
```

## Serviços Implementados

- **Autenticação (`authService.js`)**: Login, cadastro, recuperação de senha, logout
- **Produtos (`productService.js`)**: CRUD de produtos, atualização de estoque, produtos com estoque baixo
- **Categorias (`categoryService.js`)**: CRUD de categorias
- **Fornecedores (`fornecedorService.js`)**: CRUD de fornecedores
- **Pedidos (`pedidoService.js`)**: CRUD de pedidos

## Tecnologias Utilizadas

- React 19
- React Router DOM
- Axios
- CSS puro
- Context API

## Desenvolvimento

Para adicionar novas funcionalidades:

1. Crie novos serviços em `src/services/`
2. Adicione novas páginas em `src/pages/`
3. Crie componentes reutilizáveis em `src/components/`
4. Atualize as rotas em `src/App.jsx`
5. Adicione estilos CSS conforme necessário

## Uso

1. **Login:** Acesse a página inicial e faça login com suas credenciais
2. **Dashboard:** Após o login, você será redirecionado para o dashboard
3. **Navegação:** Use os botões principais para acessar as diferentes funcionalidades
4. **Produtos:** Visualize produtos em estoque e filtre por categorias
5. **Logout:** Use o botão "Sair" no header para fazer logout
