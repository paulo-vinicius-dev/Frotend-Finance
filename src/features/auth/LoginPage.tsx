import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import axios from 'axios'
import { loginSchema, type LoginFormValues } from './authSchemas'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/axios'
import type { AuthResponse, UserResponse } from '@/types/api'
import { Button, Input, FormField } from '@/components/ui'

export default function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      // Reset local auth and cached data before switching session/user.
      logout()
      queryClient.clear()

      const { data: auth } = await axios.post<AuthResponse>(
        '/api/v1/auth/login',
        values
      )
      setTokens(auth.accessToken, auth.refreshToken)

      const { data: user } = await apiClient.get<UserResponse>(
        '/api/v1/users/me'
      )
      setUser(user)
      queryClient.clear()

      navigate('/')
    } catch {
      toast.error('E-mail ou senha inválidos')
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Finance App
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            Acesse sua conta
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-900 shadow rounded-xl px-8 py-10 space-y-6"
          noValidate
        >
          <FormField label="E-mail" error={errors.email?.message} required>
            <Input
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              {...register('email')}
            />
          </FormField>
          <FormField label="Senha" error={errors.password?.message} required>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
            />
          </FormField>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
