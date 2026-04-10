import type { AlertResponse } from '@/features/alerts/types/alert.types'
import type { Budget } from '@/features/budgets/types/budget.types'
import type { InsightResponse } from '@/features/insights/types/insight.types'
import type { SummaryResponse, CategoryBreakdownResponse, MonthlyEvolutionResponse } from '@/features/reports/types/report.types'
import type { Transaction } from '@/features/transactions/types/transaction.types'

export type DashboardRangePreset =
  | 'last7Days'
  | 'last30Days'
  | 'last90Days'
  | 'thisMonth'
  | 'thisYear'
  | 'custom'

export interface DashboardFilters {
  startDate?: string
  endDate?: string
}

export interface DashboardOverview {
  summary: SummaryResponse
  totalBalance: number
  byCategory: CategoryBreakdownResponse[]
  monthlyEvolution: MonthlyEvolutionResponse[]
  budgets: Budget[]
  alerts: AlertResponse[]
  insights: InsightResponse[]
  recentTransactions: Transaction[]
}
