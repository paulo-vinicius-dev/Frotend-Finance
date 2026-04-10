import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTransaction, useUpdateTransaction } from '../queries/transaction.queries'
import { transactionCreateSchema, type TransactionCreateFormData } from '../schemas/transaction.schemas'
import { useAccounts } from '@/features/accounts/queries/account.queries'
import { useCategories } from '@/features/categories/queries/category.queries'
import type { Transaction } from '../types/transaction.types'
import type { Account } from '@/features/accounts/types/account.types'
import type { Category } from '@/features/categories/types/category.types'
import { Button, Input, Label, Select, Spinner } from '@/components/ui'
import { AlertCircle } from 'lucide-react'

type TransactionFormProps = {
  transaction?: Transaction | null
  onSuccess?: () => void
}

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts()
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction(transaction?.id ?? '')
  const isLoading = createMutation.isPending || updateMutation.isPending || accountsLoading || categoriesLoading

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionCreateFormData>({
    resolver: zodResolver(transactionCreateSchema),
    defaultValues: {
      categoryId: transaction?.category.id ?? '',
      accountId: transaction?.account.id ?? '',
      type: transaction?.type ?? 'EXPENSE',
      amount: transaction ? String(transaction.amount) : '',
      date: transaction?.date ?? new Date().toISOString().split('T')[0],
      description: transaction?.description ?? '',
    },
  })

  const onSubmit: SubmitHandler<TransactionCreateFormData> = async (data) => {
    if (transaction) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
    onSuccess?.()
  }

  const accounts: Account[] = accountsData ?? []
  const categories: Category[] = categoriesData ?? []

  if (accountsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Tipo *</Label>
        <div className="flex gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="INCOME"
              {...register('type')}
              className="h-4 w-4"
            />
            <span>Entrada</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="EXPENSE"
              {...register('type')}
              className="h-4 w-4"
            />
            <span>Saída</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="account">Conta *</Label>
        <Select id="account" aria-invalid={!!errors.accountId} {...register('accountId')}>
          <option value="">Selecione uma conta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
        {errors.accountId && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.accountId.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select id="category" aria-invalid={!!errors.categoryId} {...register('categoryId')}>
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {errors.categoryId && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.categoryId.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          aria-invalid={!!errors.amount}
          {...register('amount')}
        />
        {errors.amount && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.amount.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data *</Label>
        <Input
          id="date"
          type="date"
          aria-invalid={!!errors.date}
          {...register('date')}
        />
        {errors.date && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.date.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Input
          id="description"
          placeholder="Ex: Compra de alimentos"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.description.message}
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
