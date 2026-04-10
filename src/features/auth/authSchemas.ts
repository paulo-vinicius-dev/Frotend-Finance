import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('E-mail inválido').max(255),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(16),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
