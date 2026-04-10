import { useState } from 'react'
import type { Transaction } from '../types/transaction.types'
import { useTransactions, useDeleteTransaction } from '../queries/transaction.queries'
import { TransactionForm } from './TransactionForm'
import { TransactionFilters } from './TransactionFilters'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Spinner, Badge, EmptyState } from '@/components/ui'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import type { TransactionFilter } from '../types/transaction.types'

export function TransactionList() {
  const [filters, setFilters] = useState<TransactionFilter>({})
  const { data, isLoading, error } = useTransactions(filters)
  const deleteMutation = useDeleteTransaction()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const transactions = data ?? []
  const filteredTransactions = transactions

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
        <p>Erro ao carregar transações</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transações</h1>
          <Button onClick={() => { setSelectedTransaction(null); setIsFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <EmptyState
          title="Nenhuma transação encontrada"
          description="Crie sua primeira transação para começar"
          action={
            <Button onClick={() => { setSelectedTransaction(null); setIsFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          }
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto">
              <TransactionForm onSuccess={() => setIsFormOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div data-tour="transactions-header" className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transações</h1>
        <Button data-tour="transactions-new-btn" onClick={() => { setSelectedTransaction(null); setIsFormOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <div data-tour="transactions-filters">
        <TransactionFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="Nenhuma transação encontrada"
          description="Tente ajustar os filtros"
        />
      ) : (
        <div data-tour="transactions-list" className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={transaction.type === 'INCOME' ? 'income' : 'expense'}
                  >
                    {transaction.type === 'INCOME' ? 'Entrada' : 'Saída'}
                  </Badge>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.account.name} · {transaction.category.name} · {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === 'INCOME'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setSelectedTransaction(transaction); setIsFormOpen(true) }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(transaction.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTransaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <TransactionForm
              transaction={selectedTransaction}
              onSuccess={() => { setIsFormOpen(false); setSelectedTransaction(null) }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
