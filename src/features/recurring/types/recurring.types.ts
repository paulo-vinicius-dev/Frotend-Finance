import type { Category } from '@/features/categories/types/category.types'
import type { Account } from '@/features/accounts/types/account.types'
import type { TransactionType } from '@/features/transactions/types/transaction.types'

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export interface RecurringTransaction {
  id: string
  category: Category
  account: Account
  type: TransactionType
  amount: number
  description: string
  frequency: Frequency
  startDate: string
  nextDueDate: string
  isActive: boolean
}

export interface RecurringCreate {
  categoryId: string
  accountId: string
  type: TransactionType
  amount: string
  description?: string
  frequency: Frequency
  startDate: string
}

export type RecurringUpdate = RecurringCreate
