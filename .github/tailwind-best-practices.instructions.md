# Melhores Práticas — Tailwind CSS

> **Propósito:** Referência para agentes de IA e desenvolvedores utilizarem Tailwind CSS de forma consistente, performática, manutenível e acessível. Cada seção contém regras obrigatórias, justificativa, exemplos de uso correto e antipatterns a evitar.

---

## Índice

1. [Princípios Fundamentais](#1-princípios-fundamentais)
2. [Configuração do Projeto](#2-configuração-do-projeto)
3. [Design Tokens e Tema Customizado](#3-design-tokens-e-tema-customizado)
4. [Organização de Classes](#4-organização-de-classes)
5. [Layout com Tailwind](#5-layout-com-tailwind)
6. [Responsividade](#6-responsividade)
7. [Tipografia](#7-tipografia)
8. [Cores e Temas](#8-cores-e-temas)
9. [Dark Mode](#9-dark-mode)
10. [Espaçamento](#10-espaçamento)
11. [Componentes e Reutilização](#11-componentes-e-reutilização)
12. [Estados e Interatividade](#12-estados-e-interatividade)
13. [Formulários](#13-formulários)
14. [Animações e Transições](#14-animações-e-transições)
15. [Acessibilidade](#15-acessibilidade)
16. [Performance](#16-performance)
17. [Integração com React/Vue/Frameworks](#17-integração-com-reactvueframeworks)
18. [Plugins e Extensões Úteis](#18-plugins-e-extensões-úteis)
19. [Antipatterns — O Que Nunca Fazer](#19-antipatterns--o-que-nunca-fazer)
20. [Checklist para o Agente de IA](#20-checklist-para-o-agente-de-ia)

---

## 1. Princípios Fundamentais

### 1.1 Filosofia do Tailwind

| Princípio | Significado |
|---|---|
| **Utility-first** | Compor estilos via classes utilitárias, não CSS customizado |
| **Constraints** | Usar a escala de design pré-definida (não valores arbitrários) |
| **Composição** | Combinar classes pequenas para construir componentes |
| **Responsividade** | Mobile-first via prefixos de breakpoint (`md:`, `lg:`) |
| **Estado** | Variantes para hover, focus, active, disabled via prefixos |

### 1.2 Quando Usar Tailwind vs CSS Customizado

| Situação | Usar |
|---|---|
| Qualquer estilo coberto pela escala do Tailwind | **Tailwind classes** |
| Animações complexas com keyframes | **CSS customizado** (via `@layer`) |
| Seletores complexos (`:nth-child`, adjacentes) | **CSS customizado** |
| Estilos de conteúdo dinâmico (CMS, Markdown renderizado) | **`@tailwindcss/typography`** (plugin `prose`) |
| Temas de terceiros que exigem CSS | **CSS customizado isolado** |

### 1.3 Regra de Ouro

```
Se o Tailwind tem uma classe para isso → use a classe.
Se precisa de um valor que não existe na escala → estenda o tema (não use valor arbitrário).
Se precisa de CSS que o Tailwind não cobre → use @layer components ou @layer utilities.
```

---

## 2. Configuração do Projeto

### 2.1 tailwind.config.ts (Tailwind v4 com @config)

```typescript
// tailwind.config.ts — Tailwind v3.x
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue,svelte}',
  ],
  darkMode: 'class',  // 'class' para toggle manual, 'media' para prefers-color-scheme
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(0.5rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
```

### 2.2 CSS Base

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100;
  }

  /* Reset de focus — aplicar estilo consistente */
  *:focus-visible {
    @apply outline-2 outline-offset-2 outline-blue-500;
  }
}
```

### 2.3 Tailwind v4 (CSS-first Config)

```css
/* Tailwind v4 — configuração diretamente no CSS */
@import "tailwindcss";

@theme {
  --color-brand-50: #EFF6FF;
  --color-brand-500: #3B82F6;
  --color-brand-600: #2563EB;
  --color-brand-700: #1D4ED8;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --animate-fade-in: fadeIn 0.3s ease-out;
  --animate-slide-up: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 2.4 Prettier Plugin (Ordenação Automática)

```bash
npm install -D prettier-plugin-tailwindcss
```

```jsonc
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.ts"
}
```

> Este plugin **ordena classes automaticamente** na ordem recomendada pelo Tailwind. Usar em **todo** projeto.

---

## 3. Design Tokens e Tema Customizado

### 3.1 Regras Obrigatórias

- **Sempre** estender o tema em vez de sobrescrever — preservar classes default.
- Definir **paleta de cores da marca** no config — nunca usar valores arbitrários para cores da marca.
- Usar a **escala existente** do Tailwind quando possível. Só criar tokens novos quando a escala não cobre.
- Nomear cores customizadas de forma **semântica** quando possível.
- Usar **CSS custom properties** para valores dinâmicos (temas, dark mode granular).

### 3.2 Cores Semânticas via CSS Variables

```typescript
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        // Cores semânticas que mudam com dark mode via CSS vars
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          light: 'var(--color-accent-light)',
        },
      },
    },
  },
};
```

```css
/* globals.css */
@layer base {
  :root {
    --color-surface: theme('colors.white');
    --color-surface-raised: theme('colors.gray.50');
    --color-border: theme('colors.gray.200');
    --color-text-primary: theme('colors.gray.900');
    --color-text-secondary: theme('colors.gray.500');
    --color-text-muted: theme('colors.gray.400');
    --color-accent: theme('colors.blue.600');
    --color-accent-hover: theme('colors.blue.700');
    --color-accent-light: theme('colors.blue.50');
  }

  .dark {
    --color-surface: theme('colors.gray.900');
    --color-surface-raised: theme('colors.gray.800');
    --color-border: theme('colors.gray.700');
    --color-text-primary: theme('colors.gray.50');
    --color-text-secondary: theme('colors.gray.400');
    --color-text-muted: theme('colors.gray.500');
    --color-accent: theme('colors.blue.400');
    --color-accent-hover: theme('colors.blue.300');
    --color-accent-light: theme('colors.blue.950');
  }
}
```

```html
<!-- Uso — muda automaticamente com dark mode -->
<div class="bg-surface border border-border text-text-primary">
  <p class="text-text-secondary">Subtítulo</p>
  <a class="text-accent hover:text-accent-hover">Link</a>
</div>
```

---

## 4. Organização de Classes

### 4.1 Ordem Recomendada de Classes

Organizar classes na seguinte ordem lógica (o Prettier plugin faz automaticamente):

```
1. Layout       → flex, grid, block, hidden, absolute, relative, sticky
2. Dimensão     → w-, h-, min-w-, max-w-, min-h-
3. Spacing      → p-, m-, gap-, space-
4. Posição      → top-, left-, inset-, z-
5. Overflow     → overflow-
6. Display/Flex → flex-row, items-center, justify-between, flex-1
7. Grid         → grid-cols-, col-span-, row-span-
8. Borda        → border, rounded-, ring-
9. Background   → bg-
10. Tipografia  → text-, font-, tracking-, leading-
11. Cor do texto → text-gray-
12. Efeitos     → shadow-, opacity-
13. Transições  → transition, duration-, ease-
14. Variantes   → hover:, focus:, dark:, md:, lg:
```

### 4.2 Exemplos de Ordem

```html
<!-- ✅ CORRETO — ordem lógica, agrupamento visual -->
<button class="
  inline-flex items-center justify-center gap-2
  h-10 px-4
  rounded-lg border border-transparent
  bg-blue-600 text-sm font-semibold text-white
  shadow-sm
  transition-colors duration-150
  hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Salvar
</button>
```

### 4.3 Quebra de Linha em Classes Longas

```html
<!-- Para componentes com muitas classes, quebrar por grupo lógico -->

<!-- Em JSX/TSX — usando template literals ou cn() -->
<div
  className={cn(
    // Layout
    'flex items-center gap-4',
    // Dimensão e espaçamento
    'w-full px-6 py-4',
    // Visual
    'rounded-xl border border-gray-200 bg-white',
    // Tipografia
    'text-sm text-gray-900',
    // Interação
    'transition-shadow hover:shadow-md',
    // Condicional
    isSelected && 'ring-2 ring-blue-500',
  )}
>
```

### 4.4 Utility `cn()` para Classes Condicionais

```typescript
// src/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Uso
cn('px-4 py-2 bg-blue-500', isActive && 'bg-blue-700', className)
// clsx resolve condicionais → twMerge resolve conflitos de classes
```

> **`tailwind-merge`** é essencial: resolve conflitos como `px-4` + `px-6` → `px-6`, e `bg-blue-500` + `bg-red-500` → `bg-red-500`.

---

## 5. Layout com Tailwind

### 5.1 Container

```html
<!-- Container centralizado com padding -->
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <!-- Conteúdo -->
</div>

<!-- Container estreito (texto longo, formulários) -->
<div class="mx-auto max-w-2xl px-4">
  <!-- Conteúdo -->
</div>

<!-- Container com largura do Tailwind -->
<!-- Habilitar no config: theme.container.center: true -->
<div class="container mx-auto px-4">
  <!-- Conteúdo -->
</div>
```

### 5.2 Flexbox Patterns

```html
<!-- Stack vertical com gap -->
<div class="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Toolbar / Header -->
<header class="flex items-center justify-between gap-4 px-6 py-4">
  <div>Logo</div>
  <nav class="flex items-center gap-1">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
  </nav>
  <div>Avatar</div>
</header>

<!-- Centralizar na tela inteira -->
<div class="flex min-h-dvh items-center justify-center">
  <div>Conteúdo centralizado</div>
</div>

<!-- Sidebar + Conteúdo -->
<div class="flex gap-6">
  <aside class="w-64 shrink-0">Sidebar fixa</aside>
  <main class="min-w-0 flex-1">Conteúdo flexível</main>
  <!-- min-w-0 impede overflow do texto -->
</div>

<!-- Sticky footer -->
<div class="flex min-h-dvh flex-col">
  <header>Header</header>
  <main class="flex-1">Conteúdo</main>
  <footer>Footer sempre no fundo</footer>
</div>

<!-- Cluster (itens que quebram linha) -->
<div class="flex flex-wrap gap-2">
  <span class="rounded-full bg-gray-100 px-3 py-1 text-sm">Tag 1</span>
  <span class="rounded-full bg-gray-100 px-3 py-1 text-sm">Tag 2</span>
  <span class="rounded-full bg-gray-100 px-3 py-1 text-sm">Tag 3</span>
</div>
```

### 5.3 CSS Grid Patterns

```html
<!-- Grid de cards responsivo (sem breakpoints explícitos) -->
<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Grid fixo com breakpoints -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div>Card</div>
</div>

<!-- Stats grid (4 → 2 → 1) -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <div>Stat 1</div>
  <div>Stat 2</div>
  <div>Stat 3</div>
  <div>Stat 4</div>
</div>

<!-- Layout de página com áreas nomeadas (via arbitrary) -->
<div class="grid min-h-dvh grid-cols-[16rem_1fr] grid-rows-[auto_1fr_auto]">
  <header class="col-span-2">Header</header>
  <aside>Sidebar</aside>
  <main>Content</main>
  <footer class="col-span-2">Footer</footer>
</div>

<!-- Dois lados iguais com conteúdo centralizado (hero, auth split) -->
<div class="grid min-h-dvh lg:grid-cols-2">
  <div class="flex items-center justify-center p-8">Formulário</div>
  <div class="hidden bg-cover bg-center lg:block" style="background-image: url(...)"></div>
</div>
```

### 5.4 Posicionamento

```html
<!-- Sticky header -->
<header class="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
  <!-- Conteúdo do header -->
</header>

<!-- Badge posicionado no canto -->
<div class="relative">
  <img src="..." alt="..." class="size-12 rounded-full" />
  <span class="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
    3
  </span>
</div>

<!-- Overlay com conteúdo centralizado -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
  <div class="rounded-xl bg-white p-6 shadow-xl">Modal</div>
</div>
```

---

## 6. Responsividade

### 6.1 Regras Obrigatórias

- **Mobile-first**: estilos base sem prefixo = mobile. Prefixos adicionam complexidade.
- Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px).
- Preferir **layouts intrinsecamente responsivos** (auto-fill, flex-wrap, clamp) sobre breakpoints.
- **Nunca** usar breakpoint para esconder conteúdo essencial — reorganizar.
- Testar em viewports reais (320px, 375px, 768px, 1024px, 1440px).

### 6.2 Padrões Responsivos

```html
<!-- Direção: coluna no mobile, linha no desktop -->
<div class="flex flex-col gap-4 md:flex-row md:items-center">
  <div class="md:flex-1">Conteúdo principal</div>
  <div class="md:w-64">Sidebar</div>
</div>

<!-- Padding responsivo -->
<section class="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
  <!-- Mais espaço em telas maiores -->
</section>

<!-- Tipografia responsiva -->
<h1 class="text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-5xl">
  Título responsivo
</h1>

<!-- Grid responsivo -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <!-- 1 coluna → 2 → 3 -->
</div>

<!-- Ocultar/mostrar por breakpoint -->
<nav class="hidden md:flex">Desktop nav</nav>
<button class="md:hidden">Menu hamburger</button>

<!-- Tamanhos de fonte responsivos -->
<p class="text-sm md:text-base lg:text-lg">
  Texto que cresce com a tela
</p>
```

### 6.3 Container Queries

```html
<!-- Responsividade baseada no container, não na viewport -->
<div class="@container">
  <div class="flex flex-col @md:flex-row @md:items-center gap-4">
    <img class="w-full @md:w-48 rounded-lg" src="..." alt="..." />
    <div>
      <h3 class="text-lg font-semibold">Título</h3>
      <p class="text-sm text-gray-500">Descrição</p>
    </div>
  </div>
</div>

<!-- Requer plugin: @tailwindcss/container-queries -->
```

---

## 7. Tipografia

### 7.1 Regras

- Body text **nunca** menor que `text-sm` (14px) para leitura contínua. Preferir `text-base` (16px).
- Headings: usar escala hierárquica. **Máximo 3–4** tamanhos por página.
- Largura máxima de texto: `max-w-prose` (65ch) para parágrafos longos.
- `leading-` (line-height) apertado para headings (`leading-tight`), relaxado para body (`leading-relaxed`).
- `tracking-` (letter-spacing) negativo em headings grandes, levemente positivo em labels/caps.

### 7.2 Escala Tipográfica

```html
<!-- Headings -->
<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
  Título principal
</h1>
<h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
  Subtítulo
</h2>
<h3 class="text-xl font-semibold text-gray-900">
  Heading de seção
</h3>
<h4 class="text-lg font-semibold text-gray-900">
  Heading menor
</h4>

<!-- Body text -->
<p class="text-base leading-relaxed text-gray-600">
  Parágrafo com largura ideal para leitura.
</p>

<!-- Texto secundário -->
<span class="text-sm text-gray-500">Texto secundário</span>

<!-- Caption / Texto pequeno -->
<span class="text-xs text-gray-400">Caption ou metadata</span>

<!-- Label -->
<label class="text-sm font-medium text-gray-700">Label do campo</label>

<!-- Texto em maiúsculas (labels, badges, categorias) -->
<span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
  Categoria
</span>

<!-- Largura ideal de leitura -->
<article class="prose mx-auto max-w-prose">
  <!-- Conteúdo longo com largura ideal (65ch) -->
</article>
```

### 7.3 Plugin Typography (`prose`)

```html
<!-- Para conteúdo gerado (CMS, Markdown renderizado) -->
<article class="prose prose-lg prose-blue dark:prose-invert mx-auto">
  <!-- Todo o HTML interno recebe tipografia automaticamente:
       - Headings com escala e espaçamento
       - Parágrafos com line-height ideal
       - Links com cor e hover
       - Listas com marcadores
       - Code blocks com background
       - Tabelas formatadas
       - Blockquotes estilizados -->
  <h1>Título do artigo</h1>
  <p>Parágrafo com estilo automático...</p>
  <ul>
    <li>Item formatado automaticamente</li>
  </ul>
</article>

<!-- Customizar dentro do prose -->
<article class="prose prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
  <!-- Headings bold, links azuis sem underline -->
</article>
```

### 7.4 Truncamento

```html
<!-- Uma linha com ellipsis -->
<p class="truncate">Texto longo que será cortado com reticências...</p>

<!-- Múltiplas linhas -->
<p class="line-clamp-2">Texto longo que será cortado após 2 linhas...</p>
<p class="line-clamp-3">Texto longo que será cortado após 3 linhas...</p>

<!-- Quebra de palavras longas -->
<p class="break-words">URLmuitolongasemespaçosquequebraocontainer</p>
<p class="break-all">Quebra em qualquer caractere (útil para hashes/IDs)</p>
```

---

## 8. Cores e Temas

### 8.1 Regras

- Usar **cores da paleta do Tailwind** — não inventar tons arbitrários.
- Definir cores da marca (`brand`) no config — não usar `[#hex]` espalhado pelo código.
- Usar **variação de shade** para hierarquia: 900 para texto, 500 para ações, 50 para backgrounds.
- Manter **contraste 4.5:1** para texto (WCAG AA).
- **Nunca** usar cor como único indicador — adicionar ícone ou texto.

### 8.2 Paleta Semântica

```html
<!-- Hierarquia com shades de cinza -->
<div class="text-gray-900">Texto principal (mais forte)</div>
<div class="text-gray-600">Texto secundário</div>
<div class="text-gray-400">Texto desabilitado/muted</div>

<!-- Backgrounds -->
<div class="bg-white">Superfície elevada</div>
<div class="bg-gray-50">Background da página</div>
<div class="bg-gray-100">Background de seção alternada</div>

<!-- Bordas -->
<div class="border border-gray-200">Borda padrão</div>
<div class="border border-gray-300">Borda mais forte (hover)</div>

<!-- Estados -->
<span class="bg-green-50 text-green-700 ring-1 ring-green-600/20">Sucesso</span>
<span class="bg-red-50 text-red-700 ring-1 ring-red-600/20">Erro</span>
<span class="bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">Alerta</span>
<span class="bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">Info</span>

<!-- Opacidade como separador sutil -->
<div class="bg-black/5">Fundo levemente escurecido</div>
<div class="border-b border-black/10">Linha sutil</div>
```

### 8.3 Valores Arbitrários — Quando Permitidos

```html
<!-- ✅ PERMITIDO — valores pontuais que não fazem sentido na escala -->
<div class="top-[117px]">Posição muito específica (caso raro)</div>
<div class="grid-cols-[250px_1fr_100px]">Grid com colunas específicas</div>

<!-- ❌ PROIBIDO — cores da marca como valores arbitrários -->
<div class="bg-[#2563EB]">ERRADO — deveria ser bg-brand-600</div>
<div class="text-[#6B7280]">ERRADO — deveria ser text-gray-500</div>

<!-- ❌ PROIBIDO — espaçamento que existe na escala -->
<div class="p-[16px]">ERRADO — deveria ser p-4</div>
<div class="mt-[24px]">ERRADO — deveria ser mt-6</div>
```

---

## 9. Dark Mode

### 9.1 Regras

- Configurar `darkMode: 'class'` para controle programático (toggle manual).
- Usar `darkMode: 'media'` apenas se quiser seguir automaticamente a preferência do OS.
- **Sempre** declarar variante `dark:` para cada cor de fundo, texto e borda.
- Não usar preto puro (`bg-black`) como background — preferir `bg-gray-900` ou `bg-gray-950`.
- Texto principal em dark: `text-gray-50` ou `text-gray-100` (não `text-white`).
- Sombras são **menos visíveis** no dark — usar bordas ou elevar opacidade.

### 9.2 Padrões Completos

```html
<!-- Card com dark mode completo -->
<div class="
  rounded-xl border border-gray-200 bg-white shadow-sm
  dark:border-gray-800 dark:bg-gray-900 dark:shadow-none
">
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
      Título
    </h3>
    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      Descrição do card
    </p>
  </div>
  <div class="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
    <span class="text-xs text-gray-400 dark:text-gray-500">
      Metadata
    </span>
  </div>
</div>


<!-- Badge com dark mode -->
<span class="
  inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
  bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20
  dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20
">
  Ativo
</span>


<!-- Input com dark mode -->
<input class="
  w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
  placeholder:text-gray-400
  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
  dark:placeholder:text-gray-500
  dark:focus:border-blue-400 dark:focus:ring-blue-400
" />
```

### 9.3 Toggle de Tema

```typescript
// Hook para toggle de dark mode
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') as 'light' | 'dark'
      ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
}
```

---

## 10. Espaçamento

### 10.1 Regras

- Usar **escala de espaçamento do Tailwind** — não valores arbitrários.
- `gap` em Flex/Grid em vez de `margin` nos filhos.
- `p-` para espaçamento **interno**, `m-` para **externo**.
- `space-y-` ou `space-x-` como alternativa a `gap` quando gap não é suportado.
- Espaçamento maior entre seções, menor entre elementos relacionados.

### 10.2 Referência Rápida de Escala

| Classe | Valor | Uso Comum |
|---|---|---|
| `p-1` / `gap-1` | 0.25rem (4px) | Micro espaçamento (ícone + texto) |
| `p-2` / `gap-2` | 0.5rem (8px) | Dentro de badges, tags |
| `p-3` / `gap-3` | 0.75rem (12px) | Dentro de botões pequenos |
| `p-4` / `gap-4` | 1rem (16px) | Gap padrão entre elementos |
| `p-5` / `gap-5` | 1.25rem (20px) | Padding de cards |
| `p-6` / `gap-6` | 1.5rem (24px) | Padding de seções |
| `p-8` / `gap-8` | 2rem (32px) | Entre blocos de conteúdo |
| `p-12` | 3rem (48px) | Padding de seções grandes |
| `p-16` | 4rem (64px) | Entre seções de página |
| `py-20` / `py-24` | 5–6rem | Hero sections, separação de seções |

### 10.3 Padrões de Espaçamento

```html
<!-- Stack com espaçamento semântico -->
<div class="space-y-8">         <!-- Entre seções -->
  <section class="space-y-4">   <!-- Entre blocos -->
    <h2>Título</h2>
    <div class="space-y-2">     <!-- Entre elementos relacionados -->
      <p>Item 1</p>
      <p>Item 2</p>
    </div>
  </section>
</div>

<!-- Padding responsivo -->
<section class="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
  <!-- Conteúdo -->
</section>

<!-- Espaçamento com divider -->
<div class="divide-y divide-gray-200 dark:divide-gray-800">
  <div class="py-4">Item 1</div>
  <div class="py-4">Item 2</div>
  <div class="py-4">Item 3</div>
</div>
```

---

## 11. Componentes e Reutilização

### 11.1 Estratégias de Reutilização (Ordem de Preferência)

1. **Componente de framework** (React/Vue) — encapsular classes no componente.
2. **`@apply`** em `@layer components` — para elementos repetidos sem framework.
3. **Copiar e colar** — para variações pequenas que não justificam abstração.

### 11.2 Componente React (Preferido)

```tsx
// src/components/ui/Button.tsx
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:outline-blue-600',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:outline-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 rounded-md px-3 text-xs',
  md: 'h-10 gap-2 rounded-lg px-4 text-sm',
  lg: 'h-12 gap-2.5 rounded-lg px-6 text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center font-semibold transition-colors duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      variantStyles[variant],
      sizeStyles[size],
      loading && 'relative text-transparent',
      className,
    )}
    {...props}
  >
    {children}
    {loading && (
      <span class="absolute inset-0 flex items-center justify-center">
        <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </span>
    )}
  </button>
);
```

```tsx
// Uso
<Button variant="primary" size="md">Salvar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button variant="danger" loading>Excluindo...</Button>
<Button variant="ghost" className="text-blue-600">Link estilo</Button>
```

### 11.3 `@apply` — Quando Usar

```css
/* @apply é válido para: */
/* 1. Estilos base de elementos que não são componentes de framework */
/* 2. Estilos de terceiros que exigem classes CSS */

@layer components {
  /* Botão genérico (quando não usa React/Vue) */
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
           text-sm font-semibold transition-colors duration-150
           focus-visible:outline-2 focus-visible:outline-offset-2
           disabled:cursor-not-allowed disabled:opacity-50;
  }
  .btn-primary {
    @apply bg-blue-600 text-white shadow-sm hover:bg-blue-700
           focus-visible:outline-blue-600;
  }
  .btn-secondary {
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  }

  /* Input base */
  .input {
    @apply w-full rounded-lg border border-gray-300 bg-white px-3 py-2
           text-sm text-gray-900 placeholder:text-gray-400
           focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
           dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100;
  }
}

/* ❌ NUNCA usar @apply para: */
/* - Estilos que mudam com props/estado (usar componente) */
/* - Estilos que são usados uma única vez (deixar inline) */
/* - Recriar todo o design system (overengineering) */
```

### 11.4 Quando NÃO Abstrair

```html
<!-- Se aparece apenas 1–2 vezes na app, NÃO criar componente ou @apply -->
<!-- Copiar e colar é aceitável para casos isolados -->

<!-- Exemplo: uma seção hero específica de uma página -->
<section class="relative overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
  <div class="mx-auto max-w-2xl text-center">
    <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">
      Título do Hero
    </h1>
    <p class="mt-6 text-lg leading-8 text-gray-300">
      Descrição do hero.
    </p>
  </div>
</section>
<!-- Isso NÃO precisa virar um componente — é usado uma vez -->
```

---

## 12. Estados e Interatividade

### 12.1 Variantes de Estado

```html
<!-- Hover -->
<button class="bg-blue-600 hover:bg-blue-700">Hover</button>

<!-- Focus (apenas teclado) -->
<input class="focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2" />

<!-- Active (clique) -->
<button class="active:scale-95">Clique com feedback</button>

<!-- Disabled -->
<button class="disabled:cursor-not-allowed disabled:opacity-50" disabled>
  Desabilitado
</button>

<!-- Group hover (pai hover afeta filho) -->
<div class="group cursor-pointer rounded-lg border p-4 hover:border-blue-500">
  <h3 class="text-gray-900 group-hover:text-blue-600">Título</h3>
  <p class="text-gray-500 group-hover:text-gray-700">Descrição</p>
  <span class="opacity-0 transition-opacity group-hover:opacity-100">→</span>
</div>

<!-- Peer (estado de irmão afeta outro irmão) -->
<input class="peer" type="checkbox" id="toggle" />
<label class="peer-checked:text-blue-600 peer-checked:font-semibold" for="toggle">
  Opção
</label>

<!-- First/Last child -->
<div class="divide-y">
  <div class="py-4 first:pt-0 last:pb-0">Item</div>
</div>

<!-- Odd/Even (zebra striping) -->
<tr class="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
  <td>Dado</td>
</tr>

<!-- Placeholder -->
<input class="placeholder:text-gray-400 placeholder:italic" placeholder="Digite..." />

<!-- Selection -->
<p class="selection:bg-blue-200 selection:text-blue-900">
  Texto selecionável com cor customizada
</p>
```

### 12.2 Composição de Variantes

```html
<!-- Combinar múltiplas variantes -->
<a class="
  text-gray-600
  hover:text-blue-600
  focus-visible:text-blue-600
  dark:text-gray-400
  dark:hover:text-blue-400
  dark:focus-visible:text-blue-400
">
  Link com todos os estados
</a>

<!-- Responsivo + estado -->
<button class="
  w-full sm:w-auto
  bg-blue-600 hover:bg-blue-700
  text-sm sm:text-base
">
  Botão responsivo com hover
</button>
```

---

## 13. Formulários

### 13.1 Plugin `@tailwindcss/forms`

```html
<!-- O plugin reseta e estiliza inputs automaticamente -->
<!-- Instalar: npm install @tailwindcss/forms -->

<!-- Input texto -->
<div class="space-y-1.5">
  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Email <span class="text-red-500">*</span>
  </label>
  <input
    id="email"
    type="email"
    placeholder="seu@email.com"
    class="
      block w-full rounded-lg border-gray-300 text-sm shadow-sm
      placeholder:text-gray-400
      focus:border-blue-500 focus:ring-blue-500
      dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
    "
  />
  <!-- Mensagem de erro -->
  <p class="text-sm text-red-600" role="alert">Email é obrigatório</p>
</div>

<!-- Select -->
<select class="
  block w-full rounded-lg border-gray-300 text-sm shadow-sm
  focus:border-blue-500 focus:ring-blue-500
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
">
  <option value="">Selecione...</option>
  <option>Opção 1</option>
</select>

<!-- Textarea -->
<textarea
  rows={4}
  class="
    block w-full rounded-lg border-gray-300 text-sm shadow-sm
    placeholder:text-gray-400
    focus:border-blue-500 focus:ring-blue-500
    dark:border-gray-600 dark:bg-gray-800
  "
  placeholder="Sua mensagem..."
/>

<!-- Checkbox -->
<label class="flex items-center gap-2">
  <input
    type="checkbox"
    class="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  />
  <span class="text-sm text-gray-700 dark:text-gray-300">Aceito os termos</span>
</label>

<!-- Radio -->
<label class="flex items-center gap-2">
  <input
    type="radio"
    name="plan"
    class="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
  />
  <span class="text-sm text-gray-700">Plano mensal</span>
</label>

<!-- Toggle switch customizado -->
<button
  role="switch"
  aria-checked="true"
  class="
    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
    border-2 border-transparent bg-gray-200 transition-colors duration-200
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
    aria-checked:bg-blue-600
  "
>
  <span class="
    pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm
    ring-0 transition-transform duration-200
    translate-x-0 aria-checked:translate-x-5
  " />
</button>
```

### 13.2 Layout de Formulário

```html
<form class="mx-auto max-w-lg space-y-6">
  <!-- Campos em linha -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="space-y-1.5">
      <label class="block text-sm font-medium text-gray-700">Nome</label>
      <input type="text" class="block w-full rounded-lg border-gray-300 text-sm" />
    </div>
    <div class="space-y-1.5">
      <label class="block text-sm font-medium text-gray-700">Sobrenome</label>
      <input type="text" class="block w-full rounded-lg border-gray-300 text-sm" />
    </div>
  </div>

  <!-- Campo full width -->
  <div class="space-y-1.5">
    <label class="block text-sm font-medium text-gray-700">Email</label>
    <input type="email" class="block w-full rounded-lg border-gray-300 text-sm" />
  </div>

  <!-- Input com estado de erro -->
  <div class="space-y-1.5">
    <label class="block text-sm font-medium text-gray-700">Senha</label>
    <input
      type="password"
      aria-invalid="true"
      aria-describedby="password-error"
      class="
        block w-full rounded-lg text-sm
        border-red-300 text-red-900 placeholder:text-red-300
        focus:border-red-500 focus:ring-red-500
      "
    />
    <p id="password-error" class="text-sm text-red-600" role="alert">
      Senha deve ter no mínimo 8 caracteres
    </p>
  </div>

  <!-- Ações -->
  <div class="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
    <button type="button" class="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
      Cancelar
    </button>
    <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
      Salvar
    </button>
  </div>
</form>
```

---

## 14. Animações e Transições

### 14.1 Regras

- Usar classes `transition-*` para transições simples (hover, focus).
- Duração: **150ms** para interações rápidas (hover), **300ms** para aparições (modais, dropdowns).
- **Nunca** animar layout properties — apenas `transform`, `opacity`, `colors`, `shadow`.
- Usar `animate-*` do Tailwind para animações pré-definidas.
- Respeitar `prefers-reduced-motion` com `motion-reduce:`.

### 14.2 Transições

```html
<!-- Transição de cor (botões, links) -->
<button class="bg-blue-600 transition-colors duration-150 hover:bg-blue-700">
  Hover
</button>

<!-- Transição completa (múltiplas propriedades) -->
<div class="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
  Card com elevação no hover
</div>

<!-- Transição específica -->
<div class="transition-opacity duration-300 hover:opacity-80">
  Fade
</div>

<!-- Transição de transform (sem causar layout reflow) -->
<button class="transition-transform duration-150 active:scale-95">
  Clique com feedback
</button>
```

### 14.3 Animações

```html
<!-- Spinner -->
<svg class="size-5 animate-spin text-white" viewBox="0 0 24 24">...</svg>

<!-- Pulse (skeleton) -->
<div class="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

<!-- Bounce (atenção) -->
<span class="animate-bounce">↓</span>

<!-- Ping (notificação) -->
<span class="relative flex size-3">
  <span class="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
  <span class="relative inline-flex size-3 rounded-full bg-blue-500"></span>
</span>

<!-- Animação customizada (definida no config) -->
<div class="animate-fade-in">Aparece com fade</div>
<div class="animate-slide-up">Sobe com slide</div>
```

### 14.4 Reduced Motion

```html
<!-- Desabilitar animações para usuários que preferem -->
<div class="animate-bounce motion-reduce:animate-none">
  Animado, mas respeitando preferência
</div>

<button class="transition-all duration-200 motion-reduce:transition-none hover:scale-105 motion-reduce:hover:scale-100">
  Sem transição se reduced motion
</button>

<!-- motion-safe: aplica SÓ se o usuário NÃO prefere reduced motion -->
<div class="motion-safe:animate-fade-in">
  Só anima se o usuário permite
</div>
```

---

## 15. Acessibilidade

### 15.1 Regras Obrigatórias

- **`focus-visible:`** em todo elemento interativo — nunca remover outline sem substituto.
- **`sr-only`** para texto visível apenas por leitores de tela.
- Touch targets: mínimo **`h-10 w-10`** (40px) ou `min-h-[44px] min-w-[44px]`.
- Contraste 4.5:1 (verificar com plugin ou devtools).
- **`aria-*`** attributes quando o visual não é suficiente.
- `not-sr-only` para revelar texto hidden on focus (skip links).

### 15.2 Exemplos

```html
<!-- Focus ring visível apenas via teclado -->
<button class="
  rounded-lg bg-blue-600 px-4 py-2 text-white
  focus:outline-none
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
">
  Botão acessível
</button>

<!-- Texto somente para screen readers -->
<button class="p-2" aria-label="Fechar">
  <XIcon class="size-5" />
  <span class="sr-only">Fechar</span>
</button>

<!-- Ícone decorativo (ignorado por leitores de tela) -->
<span aria-hidden="true">🎉</span>

<!-- Skip link -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
         focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
>
  Pular para o conteúdo
</a>

<!-- Touch target adequado -->
<button class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2">
  <MenuIcon class="size-5" />
</button>

<!-- Live region para feedback dinâmico -->
<div role="alert" class="rounded-lg bg-green-50 p-4 text-green-700" aria-live="polite">
  Salvo com sucesso!
</div>

<!-- Formulário acessível -->
<div>
  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
    class="mt-1 block w-full rounded-lg border-gray-300"
  />
  {error && (
    <p id="email-error" class="mt-1 text-sm text-red-600" role="alert">
      {error}
    </p>
  )}
</div>
```

---

## 16. Performance

### 16.1 Regras

- O **PurgeCSS** built-in do Tailwind remove classes não usadas automaticamente — manter `content` correto no config.
- **Nunca** construir nomes de classes dinamicamente com concatenação — o purge não detecta.
- Classes arbitrárias (`[...]`) são geradas on-demand — usar com moderação.
- Evitar `@apply` excessivo — cada `@apply` duplica CSS no output.
- Tailwind v4 é significativamente mais rápido — considerar migração.

### 16.2 Classes Dinâmicas — CORRETO vs ERRADO

```typescript
// ❌ ERRADO — O purge NÃO detecta classes construídas dinamicamente
const color = isError ? 'red' : 'green';
<div className={`bg-${color}-500 text-${color}-700`}>  // PURGED! Não funciona

// ✅ CORRETO — Classes completas, detectáveis pelo purge
const colorClasses = isError
  ? 'bg-red-500 text-red-700'
  : 'bg-green-500 text-green-700';
<div className={colorClasses}>  // Funciona!

// ✅ CORRETO — Map de classes completas
const STATUS_STYLES: Record<Status, string> = {
  active:    'bg-green-50 text-green-700 ring-green-600/20',
  inactive:  'bg-gray-50 text-gray-700 ring-gray-600/20',
  error:     'bg-red-50 text-red-700 ring-red-600/20',
  pending:   'bg-amber-50 text-amber-700 ring-amber-600/20',
};
<span className={cn('inline-flex rounded-full px-2 py-1 text-xs ring-1 ring-inset', STATUS_STYLES[status])}>
  {label}
</span>

// ✅ CORRETO — Condicional com cn()
<div className={cn(
  'rounded-lg border p-4',
  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white',
)}>
```

### 16.3 Safelist (Casos Raros)

```typescript
// tailwind.config.ts
// Quando classes PRECISAM ser geradas dinamicamente (raro)
const config: Config = {
  safelist: [
    // Pattern: todas as cores de bg para badges dinâmicos
    {
      pattern: /bg-(red|green|blue|amber|gray)-(50|500|600)/,
      variants: ['dark'],
    },
  ],
};
// USE COM MODERAÇÃO — aumenta o tamanho do CSS
```

---

## 17. Integração com React/Vue/Frameworks

### 17.1 React — Patterns com Tailwind

```tsx
// CVA (Class Variance Authority) — para componentes com muitas variantes
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  // Base
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
  {
    variants: {
      variant: {
        success: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400',
        error:   'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400',
        warning: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400',
        info:    'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400',
        neutral: 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-2xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

type BadgeProps = React.ComponentPropsWithoutRef<'span'> & VariantProps<typeof badgeVariants>;

const Badge = ({ variant, size, className, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
);


// Uso
<Badge variant="success">Ativo</Badge>
<Badge variant="error" size="lg">Erro</Badge>
<Badge variant="info" className="animate-pulse">Processando</Badge>
```

### 17.2 Componentes Headless + Tailwind

```tsx
// Headless UI (@headlessui/react) + Tailwind = melhor combinação para:
// - Dropdowns, modais, comboboxes, tabs, disclosures
// - Toda a lógica de a11y pronta, estilo 100% com Tailwind

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => (
  <Transition show={isOpen} as={Fragment}>
    <Dialog onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      {/* Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
          leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {title}
            </DialogTitle>
            <div className="mt-4">{children}</div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </Transition>
);
```

---

## 18. Plugins e Extensões Úteis

### 18.1 Plugins Oficiais

| Plugin | Uso | Instalação |
|---|---|---|
| **`@tailwindcss/typography`** | Estilos para conteúdo CMS/Markdown (`prose`) | `npm i @tailwindcss/typography` |
| **`@tailwindcss/forms`** | Reset e estilo base para inputs | `npm i @tailwindcss/forms` |
| **`@tailwindcss/container-queries`** | Container queries (`@container`, `@md:`) | `npm i @tailwindcss/container-queries` |
| **`@tailwindcss/aspect-ratio`** | Aspect ratio (legado, não necessário em browsers modernos) | Usar `aspect-video` nativo |

### 18.2 Ferramentas Essenciais

| Ferramenta | Propósito |
|---|---|
| **`prettier-plugin-tailwindcss`** | Ordena classes automaticamente |
| **`tailwind-merge`** | Resolve conflitos de classes |
| **`clsx`** | Condicionais de classes |
| **`class-variance-authority`** (CVA) | Variantes tipadas de componentes |
| **Tailwind CSS IntelliSense** (VS Code) | Autocomplete, preview de cores, lint |

### 18.3 Plugin Customizado

```typescript
// tailwind.config.ts
import plugin from 'tailwindcss/plugin';

const config: Config = {
  plugins: [
    plugin(function ({ addUtilities, addComponents, theme }) {
      // Utility customizada
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        '.scrollbar-hidden': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });

      // Componente customizado
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          border: `1px solid ${theme('colors.gray.200')}`,
          overflow: 'hidden',
        },
      });
    }),
  ],
};
```

---

## 19. Antipatterns — O Que Nunca Fazer

| Antipattern | Por que é ruim | Correto |
|---|---|---|
| `bg-[#2563EB]` para cor da marca | Sem consistência, impossível manter | Definir no config como `brand-600` |
| `p-[17px]` quando `p-4` serve | Foge da escala sem motivo | Usar a escala existente |
| `` className={`bg-${color}-500`} `` | Purge não detecta, classe removida | Map de classes completas |
| `@apply` em tudo | Duplica CSS, perde propósito utility-first | Componente de framework |
| Muitas classes `!important` (`!p-4`) | Mascara conflitos de especificidade | Resolver com `cn()` / `twMerge` |
| `outline-none` sem substituto | Inacessível por teclado | `focus-visible:outline-*` |
| Ignorar dark mode | Experiência inconsistente | Sempre declarar `dark:` |
| `style={{}}` inline junto com Tailwind | Mistura dois sistemas | Tudo no Tailwind ou `cn()` |
| Classes de estado sem transição | Mudanças bruscas (janky) | Adicionar `transition-*` |
| Não usar `min-w-0` em flex items com texto | Texto causa overflow | `min-w-0` no flex child |
| `text-[12px]` quando `text-xs` existe | Foge da escala desnecessariamente | Usar a classe existente |
| Recriar componentes que existem no Headless UI | Reinventar a roda (a11y, keyboard) | Usar Headless UI + Tailwind |
| Safelist com centenas de classes | CSS output gigante | Refatorar para classes estáticas |
| Não instalar Prettier plugin | Classes em ordem aleatória | Instalar `prettier-plugin-tailwindcss` |

---

## 20. Checklist para o Agente de IA

### Configuração
```
[ ] tailwind.config com content paths corretos?
[ ] Prettier plugin instalado (prettier-plugin-tailwindcss)?
[ ] cn() configurado (clsx + tailwind-merge)?
[ ] Cores da marca definidas no config (não valores arbitrários)?
[ ] Plugins necessários instalados (typography, forms, container-queries)?
```

### Classes e Organização
```
[ ] Classes em ordem lógica (layout → dimensão → espaçamento → visual → texto → estado)?
[ ] Nenhum valor arbitrário quando existe classe equivalente na escala?
[ ] Classes condicionais com cn() e map estático (não concatenação dinâmica)?
[ ] Classes longas quebradas por grupo com comentário?
```

### Layout
```
[ ] gap em vez de margin entre filhos em flex/grid?
[ ] min-w-0 em flex items com texto?
[ ] Container com max-width e mx-auto?
[ ] min-h-dvh (não min-h-screen) para full height?
```

### Responsividade
```
[ ] Mobile-first (sem prefixo = mobile)?
[ ] Breakpoints usados consistentemente (sm, md, lg, xl)?
[ ] Layouts intrinsecamente responsivos quando possível?
[ ] Touch targets ≥ 44px em mobile?
```

### Dark Mode
```
[ ] dark: declarado para bg, text, border de todo componente?
[ ] Sem preto puro em dark mode (bg-gray-900 ou bg-gray-950)?
[ ] Texto principal em dark: text-gray-50 ou text-gray-100?
[ ] Sombras reduzidas/removidas no dark mode?
```

### Estados
```
[ ] hover: em todo elemento interativo?
[ ] focus-visible: com outline em todo focável?
[ ] disabled: com opacity e cursor-not-allowed?
[ ] transition-* para mudanças suaves?
[ ] active: para feedback de clique (quando relevante)?
```

### Tipografia
```
[ ] Body text ≥ text-sm (14px)?
[ ] max-w-prose para texto longo?
[ ] Hierarquia clara com no máximo 3-4 tamanhos?
[ ] prose class para conteúdo CMS/Markdown?
[ ] truncate ou line-clamp para texto que pode transbordar?
```

### Acessibilidade
```
[ ] sr-only para texto de screen reader?
[ ] aria-label em botões de ícone?
[ ] focus-visible ring visível e com contraste?
[ ] motion-reduce: para animações?
[ ] skip link no topo da página?
[ ] Contraste 4.5:1 verificado?
```

### Performance
```
[ ] Nenhuma classe construída via concatenação dinâmica?
[ ] @apply usado com moderação (preferir componentes)?
[ ] Safelist mínimo ou inexistente?
[ ] content paths no config cobrem todos os arquivos?
```

### Componentes
```
[ ] Componente de framework para UI reutilizável (não @apply)?
[ ] Variantes via objeto/map estático (não if/else com strings)?
[ ] className prop aceita e é mergeada com cn()?
[ ] CVA para componentes com muitas variantes?
[ ] Headless UI para modais, dropdowns, comboboxes?
```

---

## Dependências Recomendadas

```jsonc
{
  "dependencies": {
    "@headlessui/react": "^2.2",
    "@heroicons/react": "^2.1",
    "clsx": "^2.1",
    "tailwind-merge": "^2.5",
    "class-variance-authority": "^0.7"
  },
  "devDependencies": {
    "tailwindcss": "^3.4",
    "@tailwindcss/typography": "^0.5",
    "@tailwindcss/forms": "^0.5",
    "@tailwindcss/container-queries": "^0.1",
    "prettier-plugin-tailwindcss": "^0.6",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```
