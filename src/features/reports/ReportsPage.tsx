import { useState } from 'react'
import { useReportSummary, useExpensesByCategory, useMonthlyEvolution } from './queries/report.queries'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Spinner } from '@/components/ui'
import type { ReportFilters } from './types/report.types'

const MONTH_NAMES: Record<string, string> = {
  JANUARY: 'Jan', FEBRUARY: 'Fev', MARCH: 'Mar', APRIL: 'Abr',
  MAY: 'Mai', JUNE: 'Jun', JULY: 'Jul', AUGUST: 'Ago',
  SEPTEMBER: 'Set', OCTOBER: 'Out', NOVEMBER: 'Nov', DECEMBER: 'Dez',
}

export default function ReportsPage() {
  const currentYear = new Date().getFullYear()
  const [filters, setFilters] = useState<ReportFilters>({})
  const [year, setYear] = useState(currentYear)

  const summary = useReportSummary(filters)
  const byCategory = useExpensesByCategory(filters)
  const monthly = useMonthlyEvolution(year)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Relatórios</h1>

      {/* Period filter */}
      <div data-tour="reports-filters" className="flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="space-y-1">
          <Label htmlFor="report-start">Data inicial</Label>
          <Input
            id="report-start"
            type="date"
            value={filters.startDate ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value || undefined }))}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="report-end">Data final</Label>
          <Input
            id="report-end"
            type="date"
            value={filters.endDate ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value || undefined }))}
          />
        </div>
      </div>

      {/* Summary cards */}
      <section data-tour="reports-summary">
        <h2 className="mb-4 text-xl font-semibold">Resumo financeiro</h2>
        {summary.isLoading ? (
          <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
        ) : summary.data ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader><CardTitle className="text-sm text-gray-500 dark:text-gray-400">Receitas</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(summary.data.totalIncome)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-gray-500 dark:text-gray-400">Despesas</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(summary.data.totalExpense)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-gray-500 dark:text-gray-400">Saldo</CardTitle></CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${summary.data.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(summary.data.balance)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-gray-500 dark:text-gray-400">Taxa de economia</CardTitle></CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${summary.data.savingsRate >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {Number(summary.data.savingsRate).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </section>

      {/* By category */}
      <section data-tour="reports-by-category">
        <h2 className="mb-4 text-xl font-semibold">Despesas por categoria</h2>
        {byCategory.isLoading ? (
          <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
        ) : !byCategory.data?.length ? (
          <p className="text-sm text-gray-500">Nenhuma despesa no período.</p>
        ) : (
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {byCategory.data.map((item) => (
                  <div key={item.categoryId}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{item.categoryName}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatCurrency(item.total)} &nbsp;
                        <span className="text-xs">({Number(item.percentage).toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${Math.min(100, Number(item.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Monthly evolution */}
      <section data-tour="reports-monthly">
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-xl font-semibold">Evolução mensal</h2>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {monthly.isLoading ? (
          <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
        ) : monthly.data ? (
          <Card>
            <CardContent className="pt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                    <th className="pb-2 font-semibold text-gray-500">Mês</th>
                    <th className="pb-2 font-semibold text-green-600 dark:text-green-400 text-right">Receitas</th>
                    <th className="pb-2 font-semibold text-red-600 dark:text-red-400 text-right">Despesas</th>
                    <th className="pb-2 font-semibold text-gray-900 dark:text-white text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.data.map((row) => (
                    <tr key={row.month} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <td className="py-2">{MONTH_NAMES[row.monthName] ?? row.monthName}</td>
                      <td className="py-2 text-right text-green-600 dark:text-green-400">{formatCurrency(row.totalIncome)}</td>
                      <td className="py-2 text-right text-red-600 dark:text-red-400">{formatCurrency(row.totalExpense)}</td>
                      <td className={`py-2 text-right font-semibold ${row.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  )
}
