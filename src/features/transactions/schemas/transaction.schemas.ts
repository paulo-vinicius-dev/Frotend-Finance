import { z } from 'zod'

export const transactionCreateSchema = z.object({
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: 'Valor deve ser um número positivo',
    }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  description: z
    .string()
    .trim()
    .min(1, 'Descrição é obrigatória'),
})

export const transactionUpdateSchema = transactionCreateSchema.partial()

export type TransactionCreateFormData = z.infer<typeof transactionCreateSchema>
export type TransactionUpdateFormData = z.infer<typeof transactionUpdateSchema>
