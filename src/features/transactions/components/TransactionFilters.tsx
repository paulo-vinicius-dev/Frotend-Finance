import { useAccounts } from '@/features/accounts/queries/account.queries'
import { useCategories } from '@/features/categories/queries/category.queries'
import type { TransactionFilter } from '../types/transaction.types'
import { Select, Label, Input, Button } from '@/components/ui'
import { X } from 'lucide-react'

type TransactionFiltersProps = {
  filters: TransactionFilter
  onFiltersChange: (filters: TransactionFilter) => void
}

export function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
  const { data: accountsData } = useAccounts()
  const { data: categoriesData } = useCategories()

  const accounts = accountsData ?? []
  const categories = categoriesData ?? []

  const hasActiveFilters = Object.values(filters).some(Boolean)

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1">
          <Label htmlFor="filter-start-date">Data inicial</Label>
          <Input
            id="filter-start-date"
            type="date"
            value={filters.startDate ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value || undefined })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-end-date">Data final</Label>
          <Input
            id="filter-end-date"
            type="date"
            value={filters.endDate ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value || undefined })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-type">Tipo</Label>
          <Select
            id="filter-type"
            value={filters.type ?? ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, type: (e.target.value as 'INCOME' | 'EXPENSE') || undefined })
            }
          >
            <option value="">Todos</option>
            <option value="INCOME">Entrada</option>
            <option value="EXPENSE">Saída</option>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-account">Conta</Label>
          <Select
            id="filter-account"
            value={filters.accountId ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, accountId: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-category">Categoria</Label>
          <Select
            id="filter-category"
            value={filters.categoryId ?? ''}
            onChange={(e) => onFiltersChange({ ...filters, categoryId: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onFiltersChange({})}>
            <X className="mr-1 h-3 w-3" />
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
