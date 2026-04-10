# Boas Práticas de Layout de Interface Web

> **Propósito:** Referência para agentes de IA e desenvolvedores construírem layouts web consistentes, responsivos, acessíveis e visualmente profissionais. Cada seção contém regras obrigatórias, justificativa, exemplos visuais em CSS/HTML e antipatterns a evitar.

---

## Índice

1. [Fundamentos de Layout](#1-fundamentos-de-layout)
2. [Sistema de Grid](#2-sistema-de-grid)
3. [Flexbox — Quando e Como](#3-flexbox--quando-e-como)
4. [CSS Grid — Quando e Como](#4-css-grid--quando-e-como)
5. [Espaçamento e Ritmo Visual](#5-espaçamento-e-ritmo-visual)
6. [Tipografia](#6-tipografia)
7. [Cores e Contraste](#7-cores-e-contraste)
8. [Responsividade](#8-responsividade)
9. [Layouts de Página Comuns](#9-layouts-de-página-comuns)
10. [Navegação](#10-navegação)
11. [Formulários](#11-formulários)
12. [Cards e Listas](#12-cards-e-listas)
13. [Tabelas de Dados](#13-tabelas-de-dados)
14. [Modais e Overlays](#14-modais-e-overlays)
15. [Feedback Visual e Estados](#15-feedback-visual-e-estados)
16. [Acessibilidade no Layout](#16-acessibilidade-no-layout)
17. [Dark Mode](#17-dark-mode)
18. [Performance de Layout](#18-performance-de-layout)
19. [Design Tokens e Variáveis CSS](#19-design-tokens-e-variáveis-css)
20. [Antipatterns — O Que Nunca Fazer](#20-antipatterns--o-que-nunca-fazer)
21. [Checklist para o Agente de IA](#21-checklist-para-o-agente-de-ia)

---

## 1. Fundamentos de Layout

### 1.1 Princípios Visuais

| Princípio | Descrição | Aplicação |
|---|---|---|
| **Hierarquia** | Elementos mais importantes devem ter maior destaque visual | Tamanho de fonte, peso, cor, posição |
| **Proximidade** | Elementos relacionados ficam próximos; não relacionados, distantes | Agrupamento com espaçamento |
| **Alinhamento** | Elementos devem estar alinhados a uma linha guia | Grid, margens consistentes |
| **Contraste** | Diferenciação clara entre elementos distintos | Cor, tamanho, peso de fonte |
| **Repetição** | Padrões visuais recorrentes criam unidade | Cores, espaçamentos, componentes |
| **Espaço em branco** | Áreas vazias dão respiro e direcionam o olhar | Margens, paddings, gaps |

### 1.2 Box Model — Sempre `border-box`

```css
/* OBRIGATÓRIO — Aplicar no reset global */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Isso garante que padding e border são incluídos na largura/altura.
   Sem isso, um elemento com width: 100% e padding: 16px ultrapassa o container. */
```

### 1.3 Reset e Normalização

```css
/* Reset mínimo recomendado */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
  height: auto;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
  line-height: 1.2;
}

p {
  overflow-wrap: break-word;
  text-wrap: pretty;  /* Melhora quebra de linha em parágrafos */
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}
```

### 1.4 Unidades de Medida

| Unidade | Quando Usar | Exemplo |
|---|---|---|
| `rem` | Tipografia, espaçamento, containers | `font-size: 1rem`, `padding: 1.5rem` |
| `em` | Espaçamento relativo ao font-size do elemento | `letter-spacing: 0.05em` |
| `px` | Bordas finas, sombras, detalhes que não devem escalar | `border: 1px solid`, `box-shadow` |
| `%` | Larguras relativas ao container | `width: 100%`, `max-width: 80%` |
| `vw` / `vh` | Dimensões relativas à viewport | `min-height: 100vh` |
| `dvh` | Altura real da viewport (mobile — barra de endereço) | `min-height: 100dvh` |
| `ch` | Largura ideal de texto (60–75 caracteres) | `max-width: 65ch` |
| `fr` | Frações em CSS Grid | `grid-template-columns: 1fr 2fr` |
| `clamp()` | Valores fluidos com min e max | `font-size: clamp(1rem, 2.5vw, 1.5rem)` |

```css
/* REGRA: rem para a maioria, px para bordas/sombras, ch para largura de texto */

/* ERRADO */
.container {
  width: 1200px;        /* ❌ Fixo, não responsivo */
  padding: 20px;        /* ❌ Não escala com preferências do usuário */
  font-size: 14px;      /* ❌ Ignora configurações de acessibilidade */
}

/* CORRETO */
.container {
  max-width: 75rem;     /* ✅ Escala com font-size do root */
  padding: 1.25rem;     /* ✅ Respeita preferências */
  font-size: 0.875rem;  /* ✅ Relativo ao root */
}
```

---

## 2. Sistema de Grid

### 2.1 Regras Obrigatórias

- Definir um **grid de 12 colunas** como base para layouts de página.
- Usar **max-width** no container principal — conteúdo nunca deve se espalhar pela tela inteira em monitores largos.
- Manter **gutters (gaps)** consistentes em todo o projeto.
- Centralizar o container principal com `margin-inline: auto`.
- Container **nunca** encosta nas bordas da tela — sempre padding lateral.

### 2.2 Container System

```css
/* Design tokens de layout */
:root {
  --container-max: 75rem;        /* 1200px */
  --container-narrow: 42rem;     /* 672px — para texto longo */
  --container-wide: 90rem;       /* 1440px — dashboards */
  --gutter: 1.5rem;              /* 24px */
  --gutter-sm: 1rem;             /* 16px — mobile */
}

/* Container base */
.container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

/* Variantes */
.container--narrow {
  max-width: var(--container-narrow);
}

.container--wide {
  max-width: var(--container-wide);
}

/* Fluid — sem max-width, útil para full-bleed sections */
.container--fluid {
  max-width: none;
  padding-inline: var(--gutter);
}

/* Responsivo */
@media (max-width: 640px) {
  .container {
    padding-inline: var(--gutter-sm);
  }
}
```

### 2.3 Grid de 12 Colunas

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
}

/* Helpers de span */
.col-1  { grid-column: span 1; }
.col-2  { grid-column: span 2; }
.col-3  { grid-column: span 3; }
.col-4  { grid-column: span 4; }
.col-5  { grid-column: span 5; }
.col-6  { grid-column: span 6; }
.col-7  { grid-column: span 7; }
.col-8  { grid-column: span 8; }
.col-9  { grid-column: span 9; }
.col-10 { grid-column: span 10; }
.col-11 { grid-column: span 11; }
.col-12 { grid-column: span 12; }

/* Responsivo — mobile full width */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 3. Flexbox — Quando e Como

### 3.1 Quando Usar Flexbox

- Alinhamento de itens em **uma dimensão** (horizontal OU vertical).
- Distribuição de espaço entre itens de tamanhos variáveis.
- Centralização (o caso de uso clássico).
- Navbars, toolbars, card headers, button groups, form rows.

### 3.2 Patterns Essenciais

```css
/* Centralizar perfeitamente */
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Centralizar verticalmente na tela inteira */
.center-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
}


/* Space between — usado em headers, toolbars */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}


/* Stack vertical (coluna com espaçamento) */
.stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Stack com espaçamento variável */
.stack-sm { gap: 0.5rem; }
.stack-md { gap: 1rem; }
.stack-lg { gap: 1.5rem; }
.stack-xl { gap: 2rem; }


/* Cluster — itens que quebram linha naturalmente */
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}


/* Sidebar layout — sidebar fixa + conteúdo flexível */
.with-sidebar {
  display: flex;
  gap: var(--gutter);
}
.with-sidebar > :first-child {
  flex-shrink: 0;
  width: 16rem;           /* Sidebar fixa */
}
.with-sidebar > :last-child {
  flex-grow: 1;            /* Conteúdo preenche o restante */
  min-width: 0;            /* IMPORTANTE: permite shrink abaixo do conteúdo */
}


/* Sticky footer — footer sempre no fundo da página */
.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
.page-layout > main {
  flex-grow: 1;
}
/* header e footer ficam no tamanho do conteúdo */
```

### 3.3 Regras Importantes do Flexbox

```css
/* REGRA 1: Sempre usar gap em vez de margin nos filhos */
/* ❌ ERRADO */
.nav-item + .nav-item { margin-left: 1rem; }

/* ✅ CORRETO */
.nav { display: flex; gap: 1rem; }


/* REGRA 2: min-width: 0 para evitar overflow */
/* Flex items têm min-width: auto por padrão, que impede shrink abaixo do conteúdo */
.flex-child-with-text {
  min-width: 0;          /* Permite que o texto quebre */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


/* REGRA 3: Não usar flex em tudo — Grid é melhor para layouts 2D */
```

---

## 4. CSS Grid — Quando e Como

### 4.1 Quando Usar Grid

- Layouts **bidimensionais** (linhas E colunas).
- Layout de página inteira (header, sidebar, main, footer).
- Grid de cards/produtos (quantidade variável).
- Qualquer layout onde a **estrutura do container** define o posicionamento.
- Quando itens precisam estar **alinhados em ambas as dimensões**.

### 4.2 Patterns Essenciais

```css
/* Grid de cards responsivo (sem media queries) */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.5rem;
}
/* auto-fill: cria quantas colunas couberem
   minmax(18rem, 1fr): mínimo 18rem, máximo 1fr
   Resultado: grid responsivo automático */


/* Grid de cards com mínimo de colunas fixo */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 1.5rem;
}
/* min(100%, 16rem): garante que em telas pequenas o card ocupa 100% */


/* Layout de página com áreas nomeadas */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 16rem 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;
}

.page-header  { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main    { grid-area: main; }
.page-footer  { grid-area: footer; }

@media (max-width: 768px) {
  .page {
    grid-template-areas:
      "header"
      "main"
      "footer";
    grid-template-columns: 1fr;
  }
  .page-sidebar { display: none; }
}


/* Grid com alinhamento preciso */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}


/* Subgrid (herdar grid do pai) */
.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  /* O conteúdo do card se alinha com os de outros cards na mesma row */
}


/* Sobreposição com Grid (substituir position: absolute em muitos casos) */
.hero {
  display: grid;
  place-items: center;
}
.hero > * {
  grid-area: 1 / 1;   /* Todos os filhos ocupam a mesma célula */
}
.hero-image {
  z-index: 0;
}
.hero-content {
  z-index: 1;
}
```

### 4.3 Flexbox vs Grid — Resumo

| Situação | Usar |
|---|---|
| Uma dimensão (linha OU coluna) | **Flexbox** |
| Duas dimensões (linhas E colunas) | **Grid** |
| Tamanho do conteúdo define o layout | **Flexbox** |
| Estrutura do container define o layout | **Grid** |
| Navbar, toolbar, button group | **Flexbox** |
| Grid de cards, layout de página | **Grid** |
| Centralizar um item | **Ambos** (`place-items: center` ou `align-items` + `justify-content`) |
| Componente de lista vertical | **Flexbox** (`flex-direction: column; gap`) |

---

## 5. Espaçamento e Ritmo Visual

### 5.1 Regras Obrigatórias

- Usar **escala de espaçamento** fixa (múltiplos de 4px ou 8px) — nunca valores arbitrários.
- Espaçamento **externo** (entre elementos) via `gap` ou `margin`. Espaçamento **interno** via `padding`.
- **Nunca** usar margin para layout — usar `gap` (Flexbox/Grid).
- Manter **consistência vertical** (ritmo) entre seções, headings e parágrafos.
- Espaçamento maior indica **separação**. Espaçamento menor indica **relação**.
- Usar **CSS custom properties** para espaçamentos — nunca hardcoded.

### 5.2 Escala de Espaçamento (8px base)

```css
:root {
  --space-0:   0;
  --space-1:   0.25rem;  /* 4px */
  --space-2:   0.5rem;   /* 8px */
  --space-3:   0.75rem;  /* 12px */
  --space-4:   1rem;     /* 16px */
  --space-5:   1.25rem;  /* 20px */
  --space-6:   1.5rem;   /* 24px */
  --space-8:   2rem;     /* 32px */
  --space-10:  2.5rem;   /* 40px */
  --space-12:  3rem;     /* 48px */
  --space-16:  4rem;     /* 64px */
  --space-20:  5rem;     /* 80px */
  --space-24:  6rem;     /* 96px */
}

/* Aplicação semântica */
:root {
  --space-section:    var(--space-16);  /* Entre seções da página */
  --space-block:      var(--space-8);   /* Entre blocos de conteúdo */
  --space-element:    var(--space-4);   /* Entre elementos relacionados */
  --space-inline:     var(--space-2);   /* Entre itens inline (ícone + texto) */
}
```

### 5.3 Padrão Flow Space (Lobotomized Owl)

```css
/* Adicionar espaçamento vertical entre todos os filhos diretos
   exceto o primeiro (o chamado "lobotomized owl" selector) */

.flow > * + * {
  margin-block-start: var(--flow-space, 1rem);
}

/* Customizar por contexto */
.flow--tight { --flow-space: 0.5rem; }
.flow--loose { --flow-space: 2rem; }

/* Headings com mais espaço acima (separação visual de seção) */
.flow > h2 { --flow-space: 2.5rem; }
.flow > h3 { --flow-space: 2rem; }
```

### 5.4 Margin vs Gap vs Padding

```css
/* PADDING — espaçamento interno do elemento */
.card {
  padding: var(--space-6);         /* Conteúdo longe da borda */
}

/* GAP — espaçamento entre filhos (Flexbox/Grid) */
.card-grid {
  display: grid;
  gap: var(--space-6);             /* Entre os cards */
}

/* MARGIN — espaçamento entre blocos/seções (quando gap não é possível) */
.section + .section {
  margin-block-start: var(--space-section);
}

/* NUNCA usar margin para alinhar/posicionar dentro de flex/grid */
/* ❌ */ .flex-child { margin-right: 16px; }
/* ✅ */ .flex-parent { gap: 1rem; }
```

---

## 6. Tipografia

### 6.1 Regras Obrigatórias

- Definir **escala tipográfica** com proporção consistente.
- Body text: `16px` mínimo (1rem). **Nunca** menor que 14px para texto de leitura.
- Largura máxima de texto: **60–75 caracteres** por linha (`max-width: 65ch`).
- Hierarquia clara: **apenas 3–4 tamanhos** de heading por página.
- `line-height`: 1.2 para headings, 1.5–1.6 para body text.
- Carregar **no máximo 2 fontes** (uma para headings, uma para body). Idealmente, uma família com pesos variados.
- Usar `font-display: swap` para fontes customizadas (evitar FOIT).

### 6.2 Escala Tipográfica

```css
:root {
  /* Escala modular (ratio ~1.25 — Major Third) */
  --text-xs:    0.75rem;   /* 12px */
  --text-sm:    0.875rem;  /* 14px */
  --text-base:  1rem;      /* 16px */
  --text-lg:    1.125rem;  /* 18px */
  --text-xl:    1.25rem;   /* 20px */
  --text-2xl:   1.5rem;    /* 24px */
  --text-3xl:   1.875rem;  /* 30px */
  --text-4xl:   2.25rem;   /* 36px */
  --text-5xl:   3rem;      /* 48px */

  /* Fluid typography com clamp */
  --text-hero:  clamp(2.25rem, 5vw + 1rem, 4rem);

  /* Line heights */
  --leading-tight:  1.2;
  --leading-snug:   1.4;
  --leading-normal: 1.6;
  --leading-loose:  1.8;

  /* Font weights */
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  /* Font families */
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text);
}

h1 {
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

h2 {
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.01em;
}

h3 {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

h4 {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

/* Largura ideal de texto para leitura */
.prose {
  max-width: 65ch;
}
```

### 6.3 Responsive Typography com Clamp

```css
/* clamp(min, preferred, max)
   Escala fluidamente entre min e max com base na viewport */

h1 { font-size: clamp(1.875rem, 4vw + 0.5rem, 3rem); }
h2 { font-size: clamp(1.5rem, 3vw + 0.5rem, 2.25rem); }
h3 { font-size: clamp(1.25rem, 2vw + 0.5rem, 1.875rem); }

/* Body que cresce levemente em telas grandes */
body { font-size: clamp(1rem, 0.5vw + 0.875rem, 1.125rem); }
```

### 6.4 Truncamento de Texto

```css
/* Uma linha com ellipsis */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Múltiplas linhas com ellipsis */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 7. Cores e Contraste

### 7.1 Regras Obrigatórias

- Contraste mínimo **4.5:1** para texto normal, **3:1** para texto grande (≥18px bold / ≥24px) — WCAG AA.
- **Nunca** usar cor como único indicador (daltonismo) — adicionar ícone, texto ou padrão.
- Paleta definida via **CSS custom properties** — nunca hex/rgb hardcoded nos componentes.
- Definir cores **semânticas** (text, background, primary, error) além das cores brutas.
- Testar paleta com simuladores de daltonismo.

### 7.2 Sistema de Cores

```css
:root {
  /* Cores brutas (primitivas) — definidas uma vez */
  --blue-50:  #EFF6FF;
  --blue-100: #DBEAFE;
  --blue-500: #3B82F6;
  --blue-600: #2563EB;
  --blue-700: #1D4ED8;
  --blue-900: #1E3A5F;

  --gray-50:  #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  --gray-950: #030712;

  --red-500:  #EF4444;
  --red-600:  #DC2626;
  --green-500: #22C55E;
  --green-600: #16A34A;
  --amber-500: #F59E0B;
  --amber-600: #D97706;

  /* Cores semânticas (light mode) */
  --color-bg:             var(--gray-50);
  --color-surface:        #FFFFFF;
  --color-surface-raised: #FFFFFF;
  --color-border:         var(--gray-200);
  --color-border-hover:   var(--gray-300);

  --color-text:           var(--gray-900);
  --color-text-secondary: var(--gray-500);
  --color-text-muted:     var(--gray-400);
  --color-text-inverse:   #FFFFFF;

  --color-primary:        var(--blue-600);
  --color-primary-hover:  var(--blue-700);
  --color-primary-light:  var(--blue-50);

  --color-error:          var(--red-600);
  --color-error-light:    #FEE2E2;
  --color-success:        var(--green-600);
  --color-success-light:  #DCFCE7;
  --color-warning:        var(--amber-600);
  --color-warning-light:  #FEF3C7;

  --color-overlay:        rgb(0 0 0 / 0.5);
  --color-focus-ring:     var(--blue-500);
}
```

### 7.3 Uso de Cor Correto

```css
/* CORRETO — usar variáveis semânticas */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.error-message {
  color: var(--color-error);
  background-color: var(--color-error-light);
}

/* ERRADO — cores hardcoded */
.card {
  background-color: #ffffff;     /* ❌ */
  border: 1px solid #e5e7eb;    /* ❌ */
  color: #111827;               /* ❌ */
}
```

---

## 8. Responsividade

### 8.1 Regras Obrigatórias

- **Mobile-first**: estilos base para mobile, media queries adicionam complexidade para telas maiores.
- Usar **no máximo 3–4 breakpoints** consistentes.
- **Nunca** esconder conteúdo importante no mobile — reorganizar, não ocultar.
- Touch targets mínimo **44×44px** em mobile.
- Testar em dispositivos **reais** além de simuladores.
- Preferir **layouts intrinsecamente responsivos** (auto-fill, clamp, min) sobre media queries.

### 8.2 Breakpoints Padrão

```css
/* Mobile-first: base = mobile, depois amplia */
:root {
  --bp-sm:   640px;
  --bp-md:   768px;
  --bp-lg:   1024px;
  --bp-xl:   1280px;
  --bp-2xl:  1536px;
}

/* Uso */
/* ← Mobile (base) — sem media query */

@media (min-width: 640px)  { /* sm: telefone grande / tablet pequeno */ }
@media (min-width: 768px)  { /* md: tablet */ }
@media (min-width: 1024px) { /* lg: laptop */ }
@media (min-width: 1280px) { /* xl: desktop */ }
```

### 8.3 Layout Responsivo sem Media Queries

```css
/* Grid auto-responsivo (mágico) */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: 1.5rem;
}
/* Em telas pequenas: 1 coluna
   Em telas médias: 2 colunas
   Em telas grandes: 3+ colunas
   ZERO media queries */


/* Tipografia fluida */
h1 { font-size: clamp(1.75rem, 4vw + 0.5rem, 3rem); }


/* Espaçamento fluido */
.section {
  padding-block: clamp(2rem, 5vw, 5rem);
}


/* Sidebar que colapsa automaticamente */
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.sidebar {
  flex: 1 1 15rem;   /* Mínimo 15rem; se não cabe, quebra linha */
}
.main-content {
  flex: 999 1 0%;    /* Ocupa o máximo possível; cede apenas se necessário */
  min-width: 50%;
}
```

### 8.4 Container Queries

```css
/* Container queries: responsividade baseada no container, não na viewport.
   Ideal para componentes que vivem em containers de tamanho variável. */

.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Estilos baseados na largura do container, não da viewport */
@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;  /* Card horizontal quando cabe */
  }
}

@container card (max-width: 399px) {
  .card {
    flex-direction: column;  /* Card empilhado quando estreito */
  }
}
```

---

## 9. Layouts de Página Comuns

### 9.1 Dashboard (Sidebar + TopBar + Content)

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "sidebar topbar"
    "sidebar content";
  grid-template-columns: 16rem 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100dvh;
}

.dashboard__sidebar {
  grid-area: sidebar;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100dvh;
}

.dashboard__topbar {
  grid-area: topbar;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  height: 4rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.dashboard__content {
  grid-area: content;
  padding: var(--space-6);
  background-color: var(--color-bg);
  overflow-y: auto;
}

/* Mobile: sidebar vira drawer */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-areas:
      "topbar"
      "content";
    grid-template-columns: 1fr;
  }
  .dashboard__sidebar {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .dashboard__sidebar[data-open="true"] {
    transform: translateX(0);
  }
}
```

### 9.2 Landing Page (Sections Empilhadas)

```css
.landing {
  display: flex;
  flex-direction: column;
}

.landing__section {
  padding-block: clamp(3rem, 8vw, 6rem);
  padding-inline: var(--gutter);
}

.landing__section--hero {
  min-height: 80dvh;
  display: flex;
  align-items: center;
}

.landing__section--alt {
  background-color: var(--color-surface);
}

.landing__section-inner {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
}
```

### 9.3 Auth Page (Centralizada)

```css
.auth-page {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--space-4);
  background-color: var(--color-bg);
}

.auth-card {
  width: 100%;
  max-width: 26rem;    /* ~416px — estreito para foco */
  padding: var(--space-8);
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

/* Variante com imagem lateral (split screen) */
.auth-page--split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100dvh;
}

.auth-page--split .auth-image {
  background: url('/auth-bg.jpg') center / cover;
}

@media (max-width: 768px) {
  .auth-page--split {
    grid-template-columns: 1fr;
  }
  .auth-page--split .auth-image {
    display: none;
  }
}
```

### 9.4 Holy Grail (Header + 3 Colunas + Footer)

```css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "left    main    right"
    "footer  footer  footer";
  grid-template-columns: 14rem 1fr 14rem;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;
}

@media (max-width: 768px) {
  .holy-grail {
    grid-template-areas:
      "header"
      "main"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

---

## 10. Navegação

### 10.1 Regras

- Navbar fixa no topo: **`position: sticky; top: 0`** (melhor que fixed — não sai do flow).
- Mobile: **hamburger menu** que abre drawer ou fullscreen overlay.
- **Máximo 7 itens** de navegação primária visíveis (carga cognitiva).
- Item ativo com **indicador visual** claro (cor, underline, background).
- **Nunca** esconder navegação essencial — simplificar, não ocultar.

### 10.2 Navbar Responsiva

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--gutter);
  height: 4rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  background-color: rgb(255 255 255 / 0.85);
}

.navbar__logo {
  font-weight: var(--weight-bold);
  font-size: var(--text-lg);
}

.navbar__links {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}

.navbar__link {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
  transition: color 0.15s, background-color 0.15s;
}

.navbar__link:hover {
  color: var(--color-text);
  background-color: var(--color-surface-raised);
}

.navbar__link[aria-current="page"] {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

/* Hamburger visível apenas em mobile */
.navbar__hamburger {
  display: none;
}

@media (max-width: 768px) {
  .navbar__links {
    display: none;
  }
  .navbar__links[data-open="true"] {
    display: flex;
    flex-direction: column;
    position: fixed;
    inset: 4rem 0 0 0;
    background-color: var(--color-surface);
    padding: var(--space-4);
    gap: var(--space-2);
  }
  .navbar__hamburger {
    display: flex;
  }
}
```

### 10.3 Sidebar Navigation

```css
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4);
}

.sidebar-nav__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
  transition: all 0.15s;
}

.sidebar-nav__item:hover {
  color: var(--color-text);
  background-color: var(--color-bg);
}

.sidebar-nav__item[aria-current="page"] {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  font-weight: var(--weight-semibold);
}

/* Grupo de navegação com label */
.sidebar-nav__group-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  padding: var(--space-6) var(--space-3) var(--space-2);
}
```

---

## 11. Formulários

### 11.1 Regras Obrigatórias

- **Todo** input com `<label>` associado (via `for`/`id` ou nesting).
- Largura máxima do formulário: **32–40rem** (foco visual).
- Inputs full-width dentro do form (consistência).
- Espaçamento vertical entre campos: **1–1.5rem**.
- Erros abaixo do campo, **não** em tooltip ou toast.
- Botão de submit **visualmente distinto** e no final do form.
- Agrupar campos relacionados com `<fieldset>` + `<legend>`.
- Nunca mais de **7–10 campos** visíveis por vez (dividir em etapas se necessário).

### 11.2 Layout de Formulário

```css
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  max-width: 32rem;
  width: 100%;
}

.form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text);
}

.form__label--required::after {
  content: " *";
  color: var(--color-error);
}

.form__input {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background-color: var(--color-surface);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form__input:focus {
  outline: none;
  border-color: var(--color-focus-ring);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.2);
}

.form__input[aria-invalid="true"] {
  border-color: var(--color-error);
}

.form__input[aria-invalid="true"]:focus {
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.2);
}

.form__error {
  font-size: var(--text-sm);
  color: var(--color-error);
}

.form__hint {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Campos em linha (ex.: primeiro nome + sobrenome) */
.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

@media (max-width: 640px) {
  .form__row {
    grid-template-columns: 1fr;
  }
}

/* Ações do formulário */
.form__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding-block-start: var(--space-4);
  border-top: 1px solid var(--color-border);
}
```

---

## 12. Cards e Listas

### 12.1 Card Padrão

```css
.card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.card__image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-5);
  flex-grow: 1;           /* Preenche espaço restante em grids */
}

.card__title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

.card__description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
}

/* Card clicável inteiro */
.card--interactive {
  cursor: pointer;
}

.card--interactive:focus-within {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Grid de cards */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-6);
}
```

### 12.2 Lista de Itens

```css
.list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.list__item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  transition: background-color 0.15s;
}

.list__item:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.list__item:hover {
  background-color: var(--color-bg);
}

.list__item-content {
  flex-grow: 1;
  min-width: 0;           /* Permite text-overflow: ellipsis */
}

.list__item-actions {
  flex-shrink: 0;
  display: flex;
  gap: var(--space-2);
}
```

---

## 13. Tabelas de Dados

### 13.1 Regras

- Tabelas para **dados tabulares** — nunca para layout.
- **Sempre** `<thead>`, `<tbody>`, e `<th>` com `scope`.
- Mobile: **scroll horizontal** com indicador, ou transformar em cards.
- Largura fixa em colunas de ação/status; `min-width: 0` em colunas de texto.
- Zebra striping ou hover row para legibilidade.
- Sticky header para tabelas longas.

### 13.2 Tabela Responsiva

```css
/* Container com scroll */
.table-container {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  -webkit-overflow-scrolling: touch;
}

/* Indicador de scroll (gradiente) */
.table-container::after {
  content: '';
  position: sticky;
  right: 0;
  width: 2rem;
  background: linear-gradient(to left, var(--color-surface), transparent);
  pointer-events: none;
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: var(--text-sm);
}

.table th {
  font-weight: var(--weight-semibold);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  background-color: var(--color-bg);
  padding: var(--space-3) var(--space-4);
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}

.table td {
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border);
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: var(--color-bg);
}

/* Coluna de texto com truncamento */
.table td.truncate {
  max-width: 16rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Coluna de ações (fixa à direita) */
.table td:last-child,
.table th:last-child {
  width: 5rem;
  text-align: center;
}
```

---

## 14. Modais e Overlays

### 14.1 Regras

- Usar `<dialog>` nativo quando possível (acessibilidade built-in).
- Overlay escurece o fundo: `rgba(0, 0, 0, 0.5)`.
- **Trap focus** dentro do modal (Tab não sai do modal).
- **Escape** fecha o modal.
- Clique fora (no overlay) fecha o modal.
- Scroll do body **bloqueado** quando modal está aberto.
- Largura máxima do modal: **32rem** (pequeno), **48rem** (médio), **64rem** (grande).
- Animação de entrada suave (fade + scale).

### 14.2 Modal com `<dialog>`

```css
/* Dialog nativo — já tem backdrop e focus trap */
.modal {
  border: none;
  border-radius: var(--radius-xl);
  padding: 0;
  max-width: min(32rem, 90vw);
  max-height: 85dvh;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

/* Backdrop */
.modal::backdrop {
  background-color: var(--color-overlay);
  backdrop-filter: blur(4px);
}

/* Animação */
.modal[open] {
  animation: modal-in 0.2s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Estrutura interna */
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.modal__body {
  padding: var(--space-6);
  overflow-y: auto;
  max-height: 60dvh;
}

.modal__footer {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
}
```

```html
<!-- HTML: dialog nativo -->
<dialog class="modal" id="confirm-dialog">
  <div class="modal__header">
    <h2>Confirmar exclusão</h2>
    <button class="modal__close" aria-label="Fechar" onclick="this.closest('dialog').close()">
      ✕
    </button>
  </div>
  <div class="modal__body">
    <p>Tem certeza que deseja excluir este item?</p>
  </div>
  <div class="modal__footer">
    <button class="btn btn--ghost" onclick="this.closest('dialog').close()">Cancelar</button>
    <button class="btn btn--danger">Excluir</button>
  </div>
</dialog>

<script>
  // Abrir como modal (com backdrop e focus trap)
  document.getElementById('confirm-dialog').showModal();
</script>
```

---

## 15. Feedback Visual e Estados

### 15.1 Regras

- **Todo** elemento interativo deve ter 4 estados visuais: default, hover, focus, active/disabled.
- **Focus ring** visível e com alto contraste (nunca `outline: none` sem substituto).
- Loading: **skeleton** para primeiro carregamento, **spinner/overlay** para ações.
- Transições: **150–300ms** para interações, **300–500ms** para layout shifts.
- **Nunca** animar layout properties (`width`, `height`, `top`) — usar `transform` e `opacity`.

### 15.2 Estados de Botão

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

/* Primary */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}
.btn--primary:hover {
  background-color: var(--color-primary-hover);
}
.btn--primary:active {
  transform: scale(0.98);
}

/* Focus — OBRIGATÓRIO e visível */
.btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading */
.btn--loading {
  color: transparent;        /* Esconde texto */
  pointer-events: none;
}
.btn--loading::after {
  content: '';
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 15.3 Skeleton Loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-skeleton, #e5e7eb) 25%,
    #f3f4f6 50%,
    var(--color-skeleton, #e5e7eb) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

.skeleton--text {
  height: 1rem;
  width: 80%;
}

.skeleton--title {
  height: 1.5rem;
  width: 60%;
}

.skeleton--avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

.skeleton--card {
  height: 12rem;
}

@keyframes skeleton-pulse {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 15.4 Empty State

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-12) var(--space-6);
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-state__icon {
  font-size: 3rem;
  opacity: 0.4;
}

.empty-state__title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
}

.empty-state__description {
  font-size: var(--text-sm);
  max-width: 24rem;
}
```

---

## 16. Acessibilidade no Layout

### 16.1 Regras Obrigatórias

- **Não remover** `outline` do focus sem substituto visível.
- Ordem visual deve corresponder à **ordem do DOM** (tabulação lógica).
- Contraste **4.5:1** para texto normal, **3:1** para texto grande.
- Touch targets **44×44px** mínimo (mobile).
- **`prefers-reduced-motion`** respeitado — desabilitar animações.
- **`prefers-color-scheme`** para dark mode automático.
- Skip link para pular navegação: primeiro elemento focável.
- Usar landmarks semânticos: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.

### 16.2 Skip Link

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
  z-index: 100;
  transition: top 0.2s;
}

.skip-link:focus {
  top: var(--space-2);
}
```

```html
<a href="#main-content" class="skip-link">Pular para o conteúdo</a>
<header>...</header>
<nav>...</nav>
<main id="main-content">...</main>
```

### 16.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 16.4 Focus Visible

```css
/* focus-visible: foco visível apenas via teclado, não via mouse */
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Remover outline no clique (mouse), manter no tab (teclado) */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 17. Dark Mode

### 17.1 Implementação com CSS Custom Properties

```css
/* Light mode (padrão) */
:root {
  --color-bg:             #F9FAFB;
  --color-surface:        #FFFFFF;
  --color-border:         #E5E7EB;
  --color-text:           #111827;
  --color-text-secondary: #6B7280;
  --color-text-muted:     #9CA3AF;
  --color-primary:        #2563EB;
  --color-skeleton:       #E5E7EB;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px rgb(0 0 0 / 0.07);
  --shadow-lg: 0 10px 15px rgb(0 0 0 / 0.10);
}

/* Dark mode — override apenas as variáveis */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:             #0F172A;
    --color-surface:        #1E293B;
    --color-border:         #334155;
    --color-text:           #F1F5F9;
    --color-text-secondary: #94A3B8;
    --color-text-muted:     #64748B;
    --color-primary:        #60A5FA;
    --color-skeleton:       #334155;
    --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.3);
    --shadow-md: 0 4px 6px rgb(0 0 0 / 0.4);
    --shadow-lg: 0 10px 15px rgb(0 0 0 / 0.5);
  }
}

/* Toggle manual via classe (preferência do usuário) */
[data-theme="dark"] {
  --color-bg:             #0F172A;
  --color-surface:        #1E293B;
  /* ... mesmos overrides ... */
}
```

### 17.2 Regras de Dark Mode

- **Não** inverter cores simplesmente — redesenhar com propósito.
- Superfícies usam **cinzas**, não preto puro (`#000`). Background: `#0F172A` ou `#111827`.
- Texto principal: **não usar branco puro** (`#FFFFFF`). Preferir `#F1F5F9` ou `#E2E8F0`.
- Sombras mais **fortes** e **escuras** no dark mode (cinza escuro tem menos contraste).
- Imagens e ilustrações podem precisar de **ajuste de brilho/opacidade**.
- Borders mais **visíveis** (aumentar opacidade ou usar cinza mais claro).
- Cores de status (error, success) devem ser **menos saturadas** no dark mode.

```css
/* Ajustar imagens no dark mode */
@media (prefers-color-scheme: dark) {
  img:not([src*=".svg"]) {
    filter: brightness(0.9);
  }
}
```

---

## 18. Performance de Layout

### 18.1 Regras

- **Nunca** animar `width`, `height`, `top`, `left`, `margin`, `padding` — causam layout reflow.
- Animar **apenas** `transform` e `opacity` (GPU-accelerated, sem reflow).
- Usar `will-change` **com moderação** e apenas em elementos que serão animados.
- Evitar layout thrashing (ler e escrever propriedades de layout alternadamente no JS).
- Usar `content-visibility: auto` para conteúdo fora da tela em páginas longas.
- Carregar fontes com `font-display: swap` (evitar FOIT).

### 18.2 Animações Performáticas

```css
/* CORRETO — transform + opacity (compositing layer, sem reflow) */
.card-hover {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

/* ERRADO — causa reflow a cada frame */
.card-hover-bad {
  transition: margin-top 0.2s, box-shadow 0.2s;  /* ❌ */
}
.card-hover-bad:hover {
  margin-top: -2px;  /* ❌ Reflow */
}


/* Slide de sidebar — usar transform, não left/width */
.sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.sidebar[data-open="true"] {
  transform: translateX(0);
}
```

### 18.3 Content Visibility

```css
/* Pula renderização de seções fora da viewport */
.page-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;   /* Tamanho estimado para placeholder */
}
/* Reduz drasticamente o tempo de renderização inicial em páginas longas */
```

### 18.4 Font Loading

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;        /* Mostra fallback imediatamente, troca quando carregada */
  font-style: normal;
}
```

---

## 19. Design Tokens e Variáveis CSS

### 19.1 Sistema Completo de Tokens

```css
:root {
  /* =================== SPACING =================== */
  --space-0:   0;
  --space-1:   0.25rem;
  --space-2:   0.5rem;
  --space-3:   0.75rem;
  --space-4:   1rem;
  --space-5:   1.25rem;
  --space-6:   1.5rem;
  --space-8:   2rem;
  --space-10:  2.5rem;
  --space-12:  3rem;
  --space-16:  4rem;
  --space-20:  5rem;

  /* =================== RADIUS =================== */
  --radius-sm:   0.25rem;   /* 4px  */
  --radius-md:   0.5rem;    /* 8px  */
  --radius-lg:   0.75rem;   /* 12px */
  --radius-xl:   1rem;      /* 16px */
  --radius-2xl:  1.5rem;    /* 24px */
  --radius-full: 9999px;

  /* =================== SHADOWS =================== */
  --shadow-xs:  0 1px 2px rgb(0 0 0 / 0.04);
  --shadow-sm:  0 1px 3px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04);
  --shadow-md:  0 4px 6px rgb(0 0 0 / 0.06), 0 2px 4px rgb(0 0 0 / 0.04);
  --shadow-lg:  0 10px 15px rgb(0 0 0 / 0.08), 0 4px 6px rgb(0 0 0 / 0.04);
  --shadow-xl:  0 20px 25px rgb(0 0 0 / 0.08), 0 8px 10px rgb(0 0 0 / 0.04);

  /* =================== TRANSITIONS =================== */
  --transition-fast:    150ms ease;
  --transition-normal:  250ms ease;
  --transition-slow:    350ms ease;

  /* =================== Z-INDEX =================== */
  --z-dropdown:  10;
  --z-sticky:    20;
  --z-fixed:     30;
  --z-modal:     40;
  --z-popover:   50;
  --z-tooltip:   60;
  --z-toast:     70;

  /* =================== LAYOUT =================== */
  --container-max:      75rem;
  --container-narrow:   42rem;
  --container-wide:     90rem;
  --sidebar-width:      16rem;
  --topbar-height:      4rem;
  --gutter:             1.5rem;
}
```

---

## 20. Antipatterns — O Que Nunca Fazer

| Antipattern | Por que é ruim | Correto |
|---|---|---|
| `outline: none` sem substituto | Inacessível para navegação por teclado | `outline` customizado ou `:focus-visible` |
| Cores hardcoded (`#3B82F6`) | Sem consistência, impossível dark mode | CSS custom properties (`var(--color-primary)`) |
| `px` para font-size | Ignora configurações de acessibilidade do usuário | `rem` |
| `float` para layout | Obsoleto, bugs de colapso | Flexbox ou Grid |
| `position: absolute` para layout de página | Frágil, não responsivo | Grid ou Flexbox |
| Media queries para cada variação | Verboso, frágil | Layouts intrínsecos (auto-fill, clamp, min) |
| `!important` para resolver conflitos | Mascara problemas de especificidade | Especificidade correta ou refatorar |
| `height: 100vh` no mobile | Ignora barra de endereço do browser | `min-height: 100dvh` |
| Margin negativo para corrigir layout | Gambiarra frágil | Corrigir padding/gap do pai |
| Animar `width`/`height`/`top` | Causa layout reflow (jank) | `transform` e `opacity` |
| `box-sizing: content-box` (padrão) | Cálculos de tamanho confusos | `box-sizing: border-box` global |
| `z-index: 9999` | Escalation war, impossível gerenciar | Sistema de z-index com variáveis |
| Texto sem `max-width` em telas largas | Linhas de 200+ caracteres (ilegível) | `max-width: 65ch` |
| `display: none` para "responsividade" | Esconde conteúdo em vez de adaptar | Reorganizar layout |
| Fontes customizadas sem `font-display` | FOIT (texto invisível durante carregamento) | `font-display: swap` |

---

## 21. Checklist para o Agente de IA

### Layout e Estrutura
```
[ ] box-sizing: border-box global?
[ ] Container com max-width e margin-inline: auto?
[ ] Container com padding lateral (nunca encosta nas bordas)?
[ ] Flexbox para 1D, Grid para 2D?
[ ] gap em vez de margin para espaçamento entre filhos?
[ ] min-height: 100dvh (não 100vh) para layout full-height?
[ ] Sticky header/sidebar (não fixed, quando possível)?
```

### Espaçamento
```
[ ] Escala de espaçamento consistente (múltiplos de 4/8)?
[ ] CSS custom properties para todos os espaçamentos?
[ ] Nenhum valor hardcoded (16px, 24px) sem variável?
[ ] Espaçamento maior entre seções, menor entre relacionados?
```

### Tipografia
```
[ ] Font-size em rem (não px)?
[ ] Body text ≥ 16px (1rem)?
[ ] Largura máxima de texto 60-75ch?
[ ] Escala tipográfica consistente?
[ ] line-height: 1.2 headings, 1.5-1.6 body?
[ ] clamp() para tipografia responsiva?
[ ] font-display: swap em @font-face?
```

### Cores
```
[ ] Variáveis semânticas (--color-text, --color-primary)?
[ ] Contraste 4.5:1 para texto normal?
[ ] Cor nunca como único indicador?
[ ] Dark mode funcional (prefers-color-scheme)?
```

### Responsividade
```
[ ] Mobile-first (base = mobile)?
[ ] Layouts intrínsecos quando possível (auto-fill, clamp)?
[ ] Breakpoints consistentes (sm, md, lg, xl)?
[ ] Touch targets ≥ 44×44px?
[ ] Tabelas com scroll horizontal?
[ ] Imagens com max-width: 100%?
```

### Acessibilidade
```
[ ] Skip link para pular navegação?
[ ] outline visível em :focus-visible?
[ ] Ordem do DOM = ordem visual?
[ ] prefers-reduced-motion respeitado?
[ ] Labels em todos os inputs?
[ ] Landmarks semânticos (header, nav, main, footer)?
[ ] aria-current em item de navegação ativo?
```

### Performance
```
[ ] Animações apenas com transform/opacity?
[ ] Sem layout thrashing no JS?
[ ] content-visibility: auto em páginas longas?
[ ] Imagens com aspect-ratio e lazy loading?
[ ] z-index com sistema organizado?
```

### Componentes
```
[ ] Cards com border + radius + overflow: hidden?
[ ] Modais com dialog nativo (quando possível)?
[ ] Formulários com max-width e labels?
[ ] Botões com 4 estados (default, hover, focus, disabled)?
[ ] Empty states e skeletons para loading?
```

---

## Referências

| Recurso | URL |
|---------|-----|
| Every Layout | https://every-layout.dev/ |
| CSS Tricks — Flexbox Guide | https://css-tricks.com/snippets/css/a-guide-to-flexbox/ |
| CSS Tricks — Grid Guide | https://css-tricks.com/snippets/css/complete-guide-grid/ |
| Modern CSS Solutions | https://moderncss.dev/ |
| WCAG 2.2 Guidelines | https://www.w3.org/TR/WCAG22/ |
| Utopia (Fluid Type Calculator) | https://utopia.fyi/ |
| Open Props (Design Tokens) | https://open-props.style/ |
| Inclusive Components | https://inclusive-components.design/ |
| Web.dev Layout Patterns | https://web.dev/patterns/layout/ |
| SmolCSS | https://smolcss.dev/ |
