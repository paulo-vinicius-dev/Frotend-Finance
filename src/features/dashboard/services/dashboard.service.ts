import { alertService } from '@/features/alerts/services/alert.service'
import { budgetService } from '@/features/budgets/services/budget.service'
import { insightService } from '@/features/insights/services/insight.service'
import { reportService } from '@/features/reports/services/report.service'
import { transactionService } from '@/features/transactions/services/transaction.service'
import type { DashboardFilters, DashboardOverview } from '../types/dashboard.types'

class DashboardService {
  private getMonthAndYear(referenceDate?: string): { month: number; year: number } {
    const parsedDate = referenceDate ? new Date(referenceDate + 'T00:00:00') : new Date()
    const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate

    return {
      month: safeDate.getMonth() + 1,
      year: safeDate.getFullYear(),
    }
  }

  async getOverview(filters: DashboardFilters): Promise<DashboardOverview> {
    const { startDate, endDate } = filters
    const { month, year } = this.getMonthAndYear(endDate)

    const [summary, allTimeSummary, byCategory, monthlyEvolution, budgets, alerts, insights, transactions] =
      await Promise.all([
        reportService.getSummary({ startDate, endDate }),
        reportService.getSummary({}),
        reportService.getExpensesByCategory({ startDate, endDate }),
        reportService.getMonthlyEvolution(year),
        budgetService.list(month, year),
        alertService.getAlerts(month, year),
        insightService.getInsights(month, year),
        transactionService.list({ startDate, endDate }),
      ])

    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)

    return {
      summary,
      totalBalance: Number(allTimeSummary.balance),
      byCategory,
      monthlyEvolution,
      budgets,
      alerts,
      insights,
      recentTransactions,
    }
  }
}

export const dashboardService = new DashboardService()
