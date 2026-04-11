# Finance App — Frontend

Frontend de uma aplicação de finanças pessoais, desenvolvido com React, TypeScript e Tailwind CSS. Permite gerenciar contas, categorias, transações, orçamentos e muito mais.

## Tecnologias

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **React Router v7**
- **TanStack Query v5**
- **Zustand v5**
- **React Hook Form** + **Zod**
- **Axios**

## Pré-requisitos

- Node.js 20.19+ ou 22.12+
- Backend rodando em `http://localhost:8080`

## Configuração

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:3000**. As requisições para `/api` são redirecionadas automaticamente para o backend via proxy do Vite.

## Scripts

```bash
npm run dev          # Servidor de desenvolvimento com HMR
npm run build        # Build de produção
npm run preview      # Visualizar build de produção
npm run type-check   # Verificação de tipos TypeScript
```
