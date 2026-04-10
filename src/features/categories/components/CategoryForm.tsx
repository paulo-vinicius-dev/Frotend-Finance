import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateCategory, useUpdateCategory } from '../queries/category.queries'
import { categoryCreateSchema, type CategoryCreateFormData } from '../schemas/category.schemas'
import type { Category } from '../types/category.types'
import { Button, Input, Label } from '@/components/ui'
import { AlertCircle } from 'lucide-react'

type CategoryFormProps = {
  category?: Category | null
  onSuccess?: () => void
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory(category?.id ?? '')
  const isLoading = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryCreateFormData>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: category?.name ?? '',
    },
  })

  const onSubmit = async (data: CategoryCreateFormData) => {
    if (category) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria *</Label>
        <Input
          id="name"
          placeholder="Ex: Alimentação"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.name.message}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
