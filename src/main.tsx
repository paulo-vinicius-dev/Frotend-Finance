import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { router } from '@/router'
import { AxiosError } from 'axios'
// @ts-ignore - CSS import
import './index.css'

const savedTheme = localStorage.getItem('theme')
const shouldUseDark = savedTheme === 'dark'

if (shouldUseDark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
  if (!savedTheme) {
    localStorage.setItem('theme', 'light')
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          // toast.error('Sem permissão para esta ação')
        } else if (error.response?.status === 500) {
          // toast.error(data?.message ?? 'Erro interno do servidor')
        }
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
