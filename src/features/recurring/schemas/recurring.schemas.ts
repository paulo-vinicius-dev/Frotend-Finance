import { z } from 'zod'

export const recurringCreateSchema = z.object({
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  accountId: z.string().min(1, 'Selecione uma conta'),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.string().refine((v) => parseFloat(v) > 0, { message: 'Valor deve ser maior que zero' }),
  description: z.string().max(100).optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
})

export type RecurringCreateFormData = z.infer<typeof recurringCreateSchema>
