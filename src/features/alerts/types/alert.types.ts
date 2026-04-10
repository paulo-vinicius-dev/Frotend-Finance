export type AlertType = 'BUDGET_EXCEEDED' | 'BUDGET_WARNING' | 'SPENDING_ABOVE_AVERAGE' | 'SIGNIFICANT_EXPENSE_INCREASE'
export type AlertSeverity = 'INFO' | 'WARNING' | 'DANGER'

export interface AlertResponse {
  type: AlertType
  severity: AlertSeverity
  message: string
  categoryId: string | null
  categoryName: string | null
}
