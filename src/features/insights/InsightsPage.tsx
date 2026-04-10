import { useState } from 'react'
import { useInsights } from './queries/insight.queries'
import type { InsightType } from './types/insight.types'
import { Card, CardContent, Spinner } from '@/components/ui'
import { TrendingUp, TrendingDown, PiggyBank, Tag, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

const INSIGHT_CONFIG: Record<InsightType, { icon: React.ElementType; color: string; bg: string }> = {
  TOP_EXPENSE_CATEGORY: { icon: Tag, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  MONTHLY_COMPARISON: { icon: TrendingDown, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  EXPENSE_INCREASE: { icon: TrendingUp, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  SAVINGS_RATE: { icon: PiggyBank, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  BUDGET_WARNING: { icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  BUDGET_EXCEEDED: { icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
}

export default function InsightsPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const { data, isLoading } = useInsights(month, year)

  const insights = data ?? []

  return (
    <div className="space-y-6">
      <div data-tour="insights-header" className="flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-bold">Insights</h1>
        <div className="flex items-center gap-2">
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
            {[now.getFullYear() - 1, now.getFullYear()].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>
      ) : insights.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
            Nenhum insight disponível para este período. Registre mais transações para ver análises.
          </CardContent>
        </Card>
      ) : (
        <div data-tour="insights-list" className="grid gap-4 sm:grid-cols-2">
          {insights.map((insight, i) => {
            const config = INSIGHT_CONFIG[insight.type] ?? INSIGHT_CONFIG.SAVINGS_RATE
            const Icon = config.icon
            return (
              <Card key={i}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', config.bg)}>
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
                      <p className={cn('mt-1 text-lg font-bold', config.color)}>{insight.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
