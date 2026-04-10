import { useState } from 'react'
import { useRecurring, useDeleteRecurring } from './queries/recurring.queries'
import { RecurringForm } from './components/RecurringForm'
import type { RecurringTransaction, Frequency } from './types/recurring.types'
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, EmptyState, Spinner } from '@/components/ui'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'

const FREQUENCY_LABELS: Record<Frequency, string> = {
  DAILY: 'Diária',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
}

export default function RecurringPage() {
  const { data, isLoading } = useRecurring()
  const deleteMutation = useDeleteRecurring()
  const [selected, setSelected] = useState<RecurringTransaction | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const items = data ?? []

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>
  }

  const handleConfirmDelete = () => {
    if (!confirmDeleteId) return
    deleteMutation.mutate(confirmDeleteId, {
      onSettled: () => setConfirmDeleteId(null),
    })
  }

  return (
    <div className="space-y-6">
      <div data-tour="recurring-header" className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movimentações Recorrentes</h1>
        <Button data-tour="recurring-new-btn" onClick={() => { setSelected(null); setIsFormOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Recorrência
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Nenhuma movimentação recorrente"
          description="Cadastre despesas e receitas que se repetem automaticamente"
          action={
            <Button onClick={() => { setSelected(null); setIsFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Recorrência
            </Button>
          }
        />
      ) : (
        <div data-tour="recurring-list" className="space-y-3">
          {items.map((r) => (
            <RecurringCard
              key={r.id}
              item={r}
              onEdit={(item) => { setSelected(item); setIsFormOpen(true) }}
              onDelete={(id) => setConfirmDeleteId(id)}
              isPending={deleteMutation.isPending && confirmDeleteId === r.id}
            />
          ))}
        </div>
      )}

      {/* Form dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected ? 'Editar Recorrência' : 'Nova Recorrência'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <RecurringForm
              recurring={selected}
              onSuccess={() => { setIsFormOpen(false); setSelected(null) }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm delete dialog */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={(open) => { if (!open) setConfirmDeleteId(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir movimentação recorrente</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Esta ação é permanente. Tem certeza que deseja excluir esta movimentação recorrente?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)} disabled={deleteMutation.isPending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type CardProps = {
  item: RecurringTransaction
  onEdit: (item: RecurringTransaction) => void
  onDelete: (id: string) => void
  isPending: boolean
}

function RecurringCard({ item, onEdit, onDelete, isPending }: CardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={item.type === 'INCOME' ? 'income' : 'expense'}>
            {item.type === 'INCOME' ? 'Entrada' : 'Saída'}
          </Badge>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {FREQUENCY_LABELS[item.frequency]}
          </span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {item.description || item.category.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.account.name} · {item.category.name} · Próxima: {formatDate(item.nextDueDate)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className={`text-lg font-bold ${item.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {item.type === 'INCOME' ? '+' : '-'}{formatCurrency(item.amount)}
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} disabled={isPending}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
