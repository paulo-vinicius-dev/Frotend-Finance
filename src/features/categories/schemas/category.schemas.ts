import { z } from 'zod'

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .max(30, 'Máximo 30 caracteres'),
})

export const categoryUpdateSchema = categoryCreateSchema.partial()

export type CategoryCreateFormData = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateFormData = z.infer<typeof categoryUpdateSchema>
