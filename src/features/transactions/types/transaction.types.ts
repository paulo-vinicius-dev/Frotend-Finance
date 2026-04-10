import type { Category } from '@/features/categories/types/category.types'
import type { Account } from '@/features/accounts/types/account.types'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  category: Category
  account: Account
  type: TransactionType
  amount: string | number
  date: string
  description: string
}

export type TransactionCreate = Omit<Transaction, 'id' | 'category' | 'account'> & {
  categoryId: string
  accountId: string
}

export type TransactionUpdate = Partial<TransactionCreate>

export interface TransactionFilter {
  type?: TransactionType
  accountId?: string
  categoryId?: string
  startDate?: string
  endDate?: string
}
