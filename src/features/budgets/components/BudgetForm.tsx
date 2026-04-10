import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateBudget, useUpdateBudget } from '../queries/budget.queries'
import { budgetCreateSchema, type BudgetCreateFormData } from '../schemas/budget.schemas'
import { useCategories } from '@/features/categories/queries/category.queries'
import type { Budget } from '../types/budget.types'
import { Button, Input, Label, Select, Spinner } from '@/components/ui'
import { AlertCircle } from 'lucide-react'

type BudgetFormProps = {
  budget?: Budget | null
  onSuccess?: () => void
}

export function BudgetForm({ budget, onSuccess }: BudgetFormProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  const createMutation = useCreateBudget()
  const updateMutation = useUpdateBudget(budget?.id ?? '')
  const isLoading = createMutation.isPending || updateMutation.isPending

  const now = new Date()

  const { register, handleSubmit, formState: { errors } } = useForm<BudgetCreateFormData>({
    resolver: zodResolver(budgetCreateSchema),
    defaultValues: {
      categoryId: budget?.category.id ?? '',
      limitAmount: budget ? String(budget.limitAmount) : '',
      month: budget?.month ?? now.getMonth() + 1,
      year: budget?.year ?? now.getFullYear(),
    },
  })

  const onSubmit: SubmitHandler<BudgetCreateFormData> = async (data) => {
    if (budget) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
    onSuccess?.()
  }

  if (categoriesLoading) {
    return <div className="flex justify-center py-6"><Spinner className="h-6 w-6" /></div>
  }

  const categories = categoriesData ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="budget-category">Categoria *</Label>
        <Select id="budget-category" aria-invalid={!!errors.categoryId} {...register('categoryId')}>
          <option value="">Selecione uma categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        {errors.categoryId && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />{errors.categoryId.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget-limit">Limite (R$) *</Label>
        <Input
          id="budget-limit"
          type="number"
          step="0.01"
          placeholder="0.00"
          aria-invalid={!!errors.limitAmount}
          {...register('limitAmount')}
        />
        {errors.limitAmount && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />{errors.limitAmount.message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="budget-month">Mês *</Label>
          <Select id="budget-month" aria-invalid={!!errors.month} {...register('month')}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-year">Ano *</Label>
          <Input
            id="budget-year"
            type="number"
            placeholder="2026"
            aria-invalid={!!errors.year}
            {...register('year')}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
