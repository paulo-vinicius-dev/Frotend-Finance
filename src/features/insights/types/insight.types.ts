export type InsightType =
  | 'TOP_EXPENSE_CATEGORY'
  | 'MONTHLY_COMPARISON'
  | 'EXPENSE_INCREASE'
  | 'SAVINGS_RATE'
  | 'BUDGET_WARNING'
  | 'BUDGET_EXCEEDED'

export interface InsightResponse {
  type: InsightType
  message: string
  value: string
}
