import { z } from 'zod'

export const budgetCreateSchema = z.object({
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  limitAmount: z.string().refine((v) => parseFloat(v) > 0, { message: 'Valor deve ser maior que zero' }),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
})

export type BudgetCreateFormData = z.infer<typeof budgetCreateSchema>
