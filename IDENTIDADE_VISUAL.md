# Identidade Visual - So Bugiganga

## Paleta de Cores

### Cores Principais
- **Laranja Vibrante** (`#FF6B35`): Cor primária que representa energia, diversidade e dinamismo
- **Turquesa** (`#4ECDC4`): Cor secundária que transmite modernidade e confiança
- **Amarelo Dourado** (`#FFD93D`): Cor de destaque que representa otimismo e destaque

### Cores Neutras
- **Branco** (`#FFFFFF`): Fundo principal
- **Cinza Claro** (`#F8F9FA`): Fundo secundário
- **Cinza** (`#6C757D`): Texto secundário
- **Cinza Escuro** (`#343A40`): Texto principal
- **Preto** (`#212529`): Texto de destaque

### Cores de Status
- **Sucesso** (`#28A745`): Verde para ações positivas
- **Aviso** (`#FFC107`): Amarelo para alertas
- **Erro** (`#DC3545`): Vermelho para erros
- **Info** (`#17A2B8`): Azul para informações

## Tipografia

### Fontes
- **Primária**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Secundária**: Arial, sans-serif

### Tamanhos
- **XS**: 0.75rem (12px)
- **SM**: 0.875rem (14px)
- **Base**: 1rem (16px)
- **LG**: 1.125rem (18px)
- **XL**: 1.25rem (20px)
- **2XL**: 1.5rem (24px)
- **3XL**: 1.875rem (30px)
- **4XL**: 2.25rem (36px)

## Espaçamentos

### Sistema de Espaçamento
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **2XL**: 3rem (48px)

## Bordas e Sombras

### Border Radius
- **SM**: 4px
- **MD**: 8px
- **LG**: 12px
- **XL**: 16px

### Sombras
- **SM**: 0 1px 3px rgba(0, 0, 0, 0.12)
- **MD**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **LG**: 0 10px 15px rgba(0, 0, 0, 0.1)
- **XL**: 0 20px 25px rgba(0, 0, 0, 0.15)

## Transições

### Durações
- **Fast**: 0.15s
- **Normal**: 0.3s
- **Slow**: 0.5s

## Gradientes

### Gradientes Principais
- **Primary**: linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)
- **Secondary**: linear-gradient(135deg, #4ECDC4 0%, #81C784 100%)
- **Accent**: linear-gradient(135deg, #FFD93D 0%, #FFF176 100%)

## Componentes

### Logo
O logo da "So Bugiganga" usa:
- Fonte em negrito (800)
- Laranja vibrante como cor principal
- Amarelo dourado para o subtítulo "estoque"
- Sombra de texto para profundidade

### Botões
- Bordas arredondadas
- Gradientes de fundo
- Efeitos de hover com transformação
- Transições suaves

### Cards
- Fundo branco
- Sombras suaves
- Bordas arredondadas
- Efeitos de hover com elevação

## Responsividade

### Breakpoints
- **Mobile**: até 480px
- **Tablet**: até 768px
- **Desktop**: acima de 768px

### Adaptações
- Fontes menores em dispositivos móveis
- Layout em coluna única em telas pequenas
- Espaçamentos reduzidos em mobile

## Animações

### Animações Principais
- **fadeIn**: Aparição suave de elementos
- **slideIn**: Deslizamento lateral
- **shimmer**: Efeito de brilho no header

## Como Usar

### Variáveis CSS
Todas as cores, espaçamentos e outros valores estão definidos como variáveis CSS em `src/styles/variables.css`.

### Exemplo de Uso
```css
.minha-classe {
  color: var(--primary-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}
```

### Componente Logo
Para usar o logo em diferentes tamanhos:
```jsx
<Logo size="small" showSubtitle={false} />
<Logo size="medium" />
<Logo size="large" />
<Logo size="xlarge" />
```

## Integração com Logo Real

Para integrar o logo real da loja:

1. Adicione a imagem do logo na pasta `public/`
2. Descomente a linha no componente `Logo.jsx`:
   ```jsx
   <img src="/path/to/logo.png" alt="So Bugiganga Logo" className="logo-image" />
   ```
3. Ajuste o caminho da imagem conforme necessário
4. O CSS já está preparado para receber a imagem

## Consistência

Para manter a consistência visual:
- Sempre use as variáveis CSS definidas
- Mantenha os espaçamentos padronizados
- Use as cores da paleta oficial
- Siga os padrões de tipografia
- Aplique as animações de forma consistente 