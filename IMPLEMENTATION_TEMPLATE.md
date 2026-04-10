# Feature Implementation Template

Use this template to implement the remaining features (Accounts, Categories, Transactions).

## Step-by-Step for Each Feature

### 1. Create Types File

`src/features/{feature}/{feature}Types.ts`

```typescript
export type { /*Model*/Response } from '@/types/api'

export interface {Model}Request {
  // POST/PUT body fields
}
```

### 2. Create Schema File

`src/features/{feature}/{feature}Schemas.ts`

```typescript
import { z } from 'zod'

export const {feature}Schema = z.object({
  field1: z.string().min(1, 'Required').max(N, 'Max N chars'),
  field2: z.enum(['OPTION1', 'OPTION2']),
  // ...
})

export type {Model}FormValues = z.infer<typeof {feature}Schema>
```

### 3. Create Service File

`src/features/{feature}/{feature}Service.ts`

```typescript
import { apiClient } from '@/lib/axios'
import type { {Model}Response, {Model}Request } from './{feature}Types'

const BASE = '/api/{v1/}{feature}' // Note: no v1 for categories/transactions!

export const {feature}Service = {
  findAll: () =>
    apiClient.get<{Model}Response[]>(BASE).then((r) => r.data),

  findById: (id: string) =>
    apiClient.get<{Model}Response>(`${BASE}/${id}`).then((r) => r.data),

  create: (data: {Model}Request) =>
    apiClient.post<{Model}Response>(BASE, data).then((r) => r.data),

  update: (id: string, data: {Model}Request) =>
    apiClient.put<{Model}Response>(`${BASE}/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete(`${BASE}/${id}`),
}
```

### 4. Create React Query Hooks

`src/features/{feature}/{feature}Queries.ts`

```typescript
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { {feature}Service } from './{feature}Service'
import type { {Model}Request } from './{feature}Types'

export const {feature}Keys = {
  all: ['{feature}'] as const,
  detail: (id: string) => ['{feature}', id] as const,
}

export function use{Models}() {
  return useQuery({
    queryKey: {feature}Keys.all,
    queryFn: {feature}Service.findAll,
  })
}

export function useCreate{Model}() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {Model}Request) => {feature}Service.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: {feature}Keys.all })
      toast.success('{Model} criado com sucesso')
    },
    onError: () => toast.error('Erro ao criar {feature}'),
  })
}

export function useUpdate{Model}(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {Model}Request) => {feature}Service.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: {feature}Keys.all })
      toast.success('{Model} atualizado')
    },
    onError: () => toast.error('Erro ao atualizar {feature}'),
  })
}

export function useDelete{Model}() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {feature}Service.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: {feature}Keys.all })
      toast.success('{Model} excluído')
    },
    onError: () => toast.error('Erro ao excluir {feature}'),
  })
}
```

### 5. Create Form Modal

`src/features/{feature}/{Model}Form.tsx`

```typescript
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, FormField, Input, Button } from '@/components/ui'
import { {feature}Schema, type {Model}FormValues } from './{feature}Schemas'
import {
  useCreate{Model},
  useUpdate{Model},
} from './{feature}Queries'
import type { {Model}Response } from './{feature}Types'

type {Model}FormProps = {
  open: boolean
  onClose: () => void
  {feature}?: {Model}Response
}

export default function {Model}Form({ open, onClose, {feature} }: {Model}FormProps) {
  const isEdit = Boolean({feature})
  const createMutation = useCreate{Model}()
  const updateMutation = useUpdate{Model}({feature}?.id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{Model}FormValues>({
    resolver: zodResolver({feature}Schema),
    defaultValues: {
      // Initialize from {feature} or empty
    },
  })

  useEffect(() => {
    reset({
      // Reset when {feature} prop changes
    })
  }, [{feature}, reset])

  async function onSubmit(values: {Model}FormValues) {
    if (isEdit) {
      await updateMutation.mutateAsync(values)
    } else {
      await createMutation.mutateAsync(values)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar {Model}' : 'Novo {Model}'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Field" error={errors.field?.message} required>
          <Input {...register('field')} />
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
```

### 6. Create List Page

`src/features/{feature}/{Model}List.tsx`

```typescript
import { useState, useCallback } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button, ConfirmDialog, EmptyState, Spinner } from '@/components/ui'
import {Model}Form from './{Model}Form'
import {
  use{Models},
  useDelete{Model},
} from './{feature}Queries'
import type { {Model}Response } from './{feature}Types'

export default function {Model}List() {
  const { data: {features}, isLoading } = use{Models}()
  const deleteMutation = useDelete{Model}()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<{Model}Response | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleEdit = useCallback(({feature}: {Model}Response) => {
    setEditing({feature})
    setFormOpen(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setFormOpen(false)
    setEditing(undefined)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingId) return
    await deleteMutation.mutateAsync(deletingId)
    setDeletingId(null)
  }, [deletingId, deleteMutation])

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {Models}
        </h1>
        <Button onClick={() => setFormOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo
        </Button>
      </div>

      {!{features} || {features}.length === 0 ? (
        <EmptyState
          title="Nenhum {feature} cadastrado"
          description="Crie o seu primeiro {feature}."
          action={<Button onClick={() => setFormOpen(true)}>Novo</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {{features}.map(({feature}) => (
            <div
              key={{feature}.id}
              className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <span className="font-medium">{feature.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit({feature})}
                  className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <PencilIcon className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setDeletingId({feature}.id)}
                  className="rounded-lg p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <{Model}Form
        open={formOpen}
        onClose={handleCloseForm}
        {feature}={editing}
      />
      <ConfirmDialog
        open={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir {Model}"
        description="Tem certeza que deseja excluir? Esta ação não pode ser desfeita."
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
```

---

## Important Notes

**For Accounts:**
- Base path: `/api/v1/accounts` (with v1)
- Max name: 20 chars
- No special features

**For Categories:**
- Base path: `/api/categories` (NO v1!)
- Max name: 30 chars
- **Guard edit/delete when `isDefault === true`**
- Display "Padrão" badge for default categories

**For Transactions:**
- Base path: `/api/transactions` (NO v1!)
- Amount must stay as **string** throughout (Java BigDecimal)
- All fields required (including description)
- Type is enum: `'INCOME' | 'EXPENSE'`
- Date field: use `<input type="date">` which natively returns `YYYY-MM-DD`
- Need both account + category dropdowns in form
- Client-side filtering by type/account/category
- Display: INCOME green, EXPENSE red
- Format amount with: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`

---

## Quick Copy-Paste Replacements

Replace `{...}` with actual values:

- `{feature}` → `account` / `category` / `transaction`
- `{Model}` → `Account` / `Category` / `Transaction`
- `{Models}` → `Accounts` / `Categories` / `Transactions`
- `{MODEL}` → `ACCOUNT` / `CATEGORY` / `TRANSACTION`
- `{v1/}` → `v1/` for accounts, empty for others

Example for Accounts:
```
{feature} → account
{Model} → Account
{Models} → Accounts
{v1/} → v1/
BASE → /api/v1/accounts
```
