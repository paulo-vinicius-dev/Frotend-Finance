import type { Category } from '@/features/categories/types/category.types'

export type BudgetStatus = 'ON_TRACK' | 'WARNING' | 'EXCEEDED'

export interface Budget {
  id: string
  category: Category
  limitAmount: number
  spentAmount: number
  usagePercentage: number
  status: BudgetStatus
  month: number
  year: number
}

export interface BudgetCreate {
  categoryId: string
  limitAmount: string
  month: number
  year: number
}

export type BudgetUpdate = BudgetCreate
