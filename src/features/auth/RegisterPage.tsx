import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { registerSchema, type RegisterFormValues } from './authSchemas'
import { Button, Input, FormField } from '@/components/ui'

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(values: RegisterFormValues) {
    try {
      await axios.post('/api/v1/auth/register', values)
      toast.success('Conta criada com sucesso! Faça login para continuar.')
      navigate('/login')
    } catch {
      toast.error('Não foi possível criar a conta. Tente novamente.')
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
            Crie sua conta
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-900 shadow rounded-xl px-8 py-10 space-y-6"
          noValidate
        >
          <FormField label="Nome completo" error={errors.fullName?.message} required>
            <Input
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              {...register('fullName')}
            />
          </FormField>
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
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('password')}
            />
          </FormField>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
