import { useState } from 'react'
import { useBudgets, useDeleteBudget } from './queries/budget.queries'
import { BudgetForm } from './components/BudgetForm'
import type { Budget, BudgetStatus } from './types/budget.types'
import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, EmptyState, Spinner } from '@/components/ui'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/cn'

const STATUS_STYLES: Record<BudgetStatus, string> = {
  ON_TRACK: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  WARNING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  EXCEEDED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const STATUS_LABELS: Record<BudgetStatus, string> = {
  ON_TRACK: 'Dentro do limite',
  WARNING: 'Atenção',
  EXCEEDED: 'Excedido',
}

const BAR_COLORS: Record<BudgetStatus, string> = {
  ON_TRACK: 'bg-green-500',
  WARNING: 'bg-yellow-500',
  EXCEEDED: 'bg-red-500',
}

export default function BudgetsPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const { data, isLoading } = useBudgets(month, year)
  const deleteMutation = useDeleteBudget()
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const budgets = data ?? []

  return (
    <div className="space-y-6">
      <div data-tour="budgets-header" className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Button data-tour="budgets-new-btn" onClick={() => { setSelectedBudget(null); setIsFormOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      {/* Period selector */}
      <div data-tour="budgets-period" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Período:</span>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(2000, m - 1).toLocaleString('pt-BR', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>
      ) : budgets.length === 0 ? (
        <EmptyState
          title="Nenhum orçamento definido"
          description="Defina limites de gastos por categoria para controlar suas finanças"
          action={
            <Button onClick={() => { setSelectedBudget(null); setIsFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Button>
          }
        />
      ) : (
        <div data-tour="budgets-list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <Card key={budget.id}>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{budget.category.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(2000, budget.month - 1).toLocaleString('pt-BR', { month: 'long' })} / {budget.year}
                    </p>
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', STATUS_STYLES[budget.status])}>
                    {STATUS_LABELS[budget.status]}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatCurrency(budget.spentAmount)} de {formatCurrency(budget.limitAmount)}
                    </span>
                    <span className="font-medium">{Number(budget.usagePercentage).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={cn('h-full rounded-full transition-all', BAR_COLORS[budget.status])}
                      style={{ width: `${Math.min(100, Number(budget.usagePercentage))}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setSelectedBudget(budget); setIsFormOpen(true) }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(budget.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedBudget ? 'Editar Orçamento' : 'Novo Orçamento'}</DialogTitle>
          </DialogHeader>
          <BudgetForm
            budget={selectedBudget}
            onSuccess={() => { setIsFormOpen(false); setSelectedBudget(null) }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
