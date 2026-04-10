import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateAccount, useUpdateAccount } from '../queries/account.queries'
import { accountCreateSchema, type AccountCreateFormData } from '../schemas/account.schemas'
import type { Account } from '../types/account.types'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { AlertCircle } from 'lucide-react'

type AccountFormProps = {
  account?: Account | null
  onSuccess?: () => void
}

export function AccountForm({ account, onSuccess }: AccountFormProps) {
  const createMutation = useCreateAccount()
  const updateMutation = useUpdateAccount(account?.id ?? '')
  const isLoading = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountCreateFormData>({
    resolver: zodResolver(accountCreateSchema),
    defaultValues: {
      name: account?.name ?? '',
    },
  })

  const onSubmit = async (data: AccountCreateFormData) => {
    if (account) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Conta *</Label>
        <Input
          id="name"
          placeholder="Ex: Conta Corrente"
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
