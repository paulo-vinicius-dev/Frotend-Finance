import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateRecurring, useUpdateRecurring } from '../queries/recurring.queries'
import { recurringCreateSchema, type RecurringCreateFormData } from '../schemas/recurring.schemas'
import { useAccounts } from '@/features/accounts/queries/account.queries'
import { useCategories } from '@/features/categories/queries/category.queries'
import type { RecurringTransaction } from '../types/recurring.types'
import { Button, Input, Label, Select, Spinner } from '@/components/ui'
import { AlertCircle } from 'lucide-react'

type RecurringFormProps = {
  recurring?: RecurringTransaction | null
  onSuccess?: () => void
}

const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: 'Diária',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
}

export function RecurringForm({ recurring, onSuccess }: RecurringFormProps) {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts()
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  const createMutation = useCreateRecurring()
  const updateMutation = useUpdateRecurring(recurring?.id ?? '')
  const isLoading = createMutation.isPending || updateMutation.isPending

  const { register, handleSubmit, formState: { errors } } = useForm<RecurringCreateFormData>({
    resolver: zodResolver(recurringCreateSchema),
    defaultValues: {
      categoryId: recurring?.category.id ?? '',
      accountId: recurring?.account.id ?? '',
      type: recurring?.type ?? 'EXPENSE',
      amount: recurring ? String(recurring.amount) : '',
      description: recurring?.description ?? '',
      frequency: recurring?.frequency ?? 'MONTHLY',
      startDate: recurring?.startDate ?? new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit: SubmitHandler<RecurringCreateFormData> = async (data) => {
    if (recurring) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
    onSuccess?.()
  }

  if (accountsLoading || categoriesLoading) {
    return <div className="flex justify-center py-6"><Spinner className="h-6 w-6" /></div>
  }

  const accounts = accountsData ?? []
  const categories = categoriesData ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo *</Label>
        <div className="flex gap-4">
          {(['INCOME', 'EXPENSE'] as const).map((t) => (
            <label key={t} className="flex items-center gap-2">
              <input type="radio" value={t} {...register('type')} className="h-4 w-4" />
              <span>{t === 'INCOME' ? 'Entrada' : 'Saída'}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rec-account">Conta *</Label>
        <Select id="rec-account" aria-invalid={!!errors.accountId} {...register('accountId')}>
          <option value="">Selecione uma conta</option>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </Select>
        {errors.accountId && <p className="flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{errors.accountId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rec-category">Categoria *</Label>
        <Select id="rec-category" aria-invalid={!!errors.categoryId} {...register('categoryId')}>
          <option value="">Selecione uma categoria</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        {errors.categoryId && <p className="flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rec-amount">Valor *</Label>
        <Input id="rec-amount" type="number" step="0.01" placeholder="0.00" aria-invalid={!!errors.amount} {...register('amount')} />
        {errors.amount && <p className="flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rec-desc">Descrição</Label>
        <Input id="rec-desc" placeholder="Ex: Aluguel" {...register('description')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rec-frequency">Frequência *</Label>
        <Select id="rec-frequency" {...register('frequency')}>
          {Object.entries(FREQUENCY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rec-start">Data de início *</Label>
        <Input id="rec-start" type="date" aria-invalid={!!errors.startDate} {...register('startDate')} />
        {errors.startDate && <p className="flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{errors.startDate.message}</p>}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </form>
  )
}
