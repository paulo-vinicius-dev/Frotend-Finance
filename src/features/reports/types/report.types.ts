export interface SummaryResponse {
  totalIncome: number
  totalExpense: number
  balance: number
  savingsRate: number
}

export interface CategoryBreakdownResponse {
  categoryId: string
  categoryName: string
  total: number
  percentage: number
}

export interface MonthlyEvolutionResponse {
  month: number
  monthName: string
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface ReportFilters {
  startDate?: string
  endDate?: string
}
