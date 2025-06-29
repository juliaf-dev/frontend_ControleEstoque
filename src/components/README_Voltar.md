# Componente Voltar - Documentação

## Visão Geral

O componente `Voltar` foi completamente reformulado para oferecer uma experiência de navegação mais rica e personalizável. Ele agora suporta múltiplas variantes visuais, navegação específica e funcionalidades adicionais.

## Funcionalidades

### 🎨 Variantes Visuais
- **default**: Botão com gradiente azul/roxo (padrão)
- **minimal**: Botão transparente com borda
- **home**: Botão com gradiente laranja/amarelo

### 🧭 Navegação
- **Volta uma página**: Comportamento padrão
- **Navegação específica**: Para rota definida via prop `to`
- **Botão Home**: Acesso rápido ao Dashboard

### 📱 Responsividade
- Adaptação automática para dispositivos móveis
- Texto oculto em telas pequenas (apenas ícone)
- Tamanhos otimizados para diferentes resoluções

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `to` | string | - | Rota específica para navegar |
| `title` | string | 'Voltar' | Texto do botão |
| `showHome` | boolean | false | Mostra botão home adicional |
| `variant` | string | 'default' | Variante visual do botão |
| `className` | string | '' | Classes CSS adicionais |

## Exemplos de Uso

### Uso Básico
```jsx
<Voltar />
```

### Navegação Específica
```jsx
<Voltar to="/dashboard" title="Voltar ao Dashboard" />
```

### Com Botão Home
```jsx
<Voltar showHome={true} title="Voltar" />
```

### Variante Minimal
```jsx
<Voltar variant="minimal" showHome={true} />
```

### Variante Home
```jsx
<Voltar variant="home" title="Ir para Home" />
```

### Com Classes Customizadas
```jsx
<Voltar className="custom-class" showHome={true} />
```

## Variantes Disponíveis

### Default
- Gradiente azul/roxo
- Sombra suave
- Efeito de elevação no hover

### Minimal
- Transparente com borda
- Ideal para interfaces limpas
- Efeito de preenchimento no hover

### Home
- Gradiente laranja/amarelo
- Estilo mais quente e acolhedor
- Perfeito para navegação principal

## Animações

- **Entrada**: Slide da esquerda
- **Hover**: Elevação + brilho
- **Clique**: Feedback visual
- **Transições**: Suaves e naturais

## Responsividade

### Desktop (>768px)
- Texto + ícone visíveis
- Tamanho completo

### Tablet (≤768px)
- Apenas ícone visível
- Tamanho reduzido

### Mobile (≤480px)
- Tamanho mínimo
- Espaçamento otimizado

## Acessibilidade

- Foco visível com outline
- Tooltips informativos
- Navegação por teclado
- Estados disabled suportados

## Tema Escuro

O componente está preparado para suporte a tema escuro via `prefers-color-scheme: dark`.

## Implementação Atual

O componente está sendo usado nas seguintes páginas:

- **HistoricoVendas**: `showHome={true}`
- **Compra**: `showHome={true}`, título personalizado
- **AddProduto**: Navegação específica para `/compras`
- **Vendas**: `showHome={true}`
- **Fornecedores**: `showHome={true}`
- **Clients**: `showHome={true}`

## Próximas Melhorias

- [ ] Suporte a ícones customizados
- [ ] Animações de loading
- [ ] Integração com breadcrumbs
- [ ] Histórico de navegação
- [ ] Temas customizáveis 