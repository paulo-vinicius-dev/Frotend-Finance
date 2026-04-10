import { z } from 'zod'

export const accountCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .max(20, 'Máximo 20 caracteres'),
})

export const accountUpdateSchema = accountCreateSchema.partial()

export type AccountCreateFormData = z.infer<typeof accountCreateSchema>
export type AccountUpdateFormData = z.infer<typeof accountUpdateSchema>
