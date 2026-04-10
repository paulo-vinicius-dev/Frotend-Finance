import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Spinner } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/cn'
import { useDashboardOverview } from './queries/dashboard.queries'
import type { DashboardRangePreset } from './types/dashboard.types'

const CATEGORY_COLORS = ['#0f766e', '#ea580c', '#2563eb', '#7c3aed', '#15803d', '#dc2626', '#4f46e5']

const RANGE_PRESETS: Array<{ key: DashboardRangePreset; label: string }> = [
  { key: 'last7Days', label: '7 dias' },
  { key: 'last30Days', label: '30 dias' },
  { key: 'last90Days', label: '90 dias' },
  { key: 'thisMonth', label: 'Mês atual' },
  { key: 'thisYear', label: 'Ano atual' },
  { key: 'custom', label: 'Personalizado' },
]

const MONTH_NAMES: Record<string, string> = {
  JANUARY: 'Jan',
  FEBRUARY: 'Fev',
  MARCH: 'Mar',
  APRIL: 'Abr',
  MAY: 'Mai',
  JUNE: 'Jun',
  JULY: 'Jul',
  AUGUST: 'Ago',
  SEPTEMBER: 'Set',
  OCTOBER: 'Out',
  NOVEMBER: 'Nov',
  DECEMBER: 'Dez',
}

function formatChartCurrency(value: unknown): string {
  const normalized = Array.isArray(value) ? value[0] : value
  const amount = typeof normalized === 'number' ? normalized : Number(normalized ?? 0)
  return formatCurrency(Number.isFinite(amount) ? amount : 0)
}

function toInputDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function resolveDateRange(preset: DashboardRangePreset): { startDate?: string; endDate?: string } {
  const now = new Date()
  const endDate = toInputDate(now)

  const subtractDays = (days: number) => {
    const start = new Date(now)
    start.setDate(start.getDate() - days)
    return toInputDate(start)
  }

  switch (preset) {
    case 'last7Days':
      return { startDate: subtractDays(6), endDate }
    case 'last30Days':
      return { startDate: subtractDays(29), endDate }
    case 'last90Days':
      return { startDate: subtractDays(89), endDate }
    case 'thisMonth': {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return { startDate: toInputDate(firstDayOfMonth), endDate }
    }
    case 'thisYear': {
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
      return { startDate: toInputDate(firstDayOfYear), endDate }
    }
    case 'custom':
    default:
      return {}
  }
}

export default function DashboardPage() {
  const [preset, setPreset] = useState<DashboardRangePreset>('last30Days')
  const defaultRange = useMemo(() => resolveDateRange('last30Days'), [])
  const [customStartDate, setCustomStartDate] = useState(defaultRange.startDate ?? '')
  const [customEndDate, setCustomEndDate] = useState(defaultRange.endDate ?? '')

  const activeFilters = useMemo(() => {
    if (preset === 'custom') {
      return {
        startDate: customStartDate || undefined,
        endDate: customEndDate || undefined,
      }
    }

    return resolveDateRange(preset)
  }, [preset, customStartDate, customEndDate])

  const { data, isLoading, isFetching } = useDashboardOverview(activeFilters)

  const summary = data?.summary
  const totalBalance = data?.totalBalance ?? 0
  const byCategory = data?.byCategory ?? []
  const monthlyEvolution = data?.monthlyEvolution ?? []
  const budgets = data?.budgets ?? []
  const alerts = data?.alerts ?? []
  const insights = data?.insights ?? []
  const recentTransactions = data?.recentTransactions ?? []

  const totalBudgetLimit = budgets.reduce((acc, budget) => acc + Number(budget.limitAmount), 0)
  const totalBudgetSpent = budgets.reduce((acc, budget) => acc + Number(budget.spentAmount), 0)
  const totalBudgetUsage = totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div data-tour="dashboard-hero" className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-teal-100">Painel financeiro</p>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">Dashboard estratégico</h1>
            <p className="max-w-2xl text-sm text-cyan-100 md:text-base">
              Acompanhe receitas, despesas, metas e comportamento financeiro em tempo real com visualizações interativas.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">Saldo acumulado</p>
              <p className={cn('text-2xl font-bold', !isLoading && totalBalance < 0 ? 'text-rose-300' : 'text-white')}>
                {isLoading ? '—' : formatCurrency(totalBalance)}
              </p>
              <p className="mt-0.5 text-xs text-white/60">total de todas as transações</p>
            </div>
            <div className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm">
              {isFetching ? 'Atualizando dados...' : 'Dados atualizados'}
            </div>
          </div>
        </div>
      </section>

      <section data-tour="dashboard-filters" className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-5">
        <div className="flex flex-wrap gap-2">
          {RANGE_PRESETS.map((option) => (
            <Button
              key={option.key}
              variant={preset === option.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreset(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {preset === 'custom' && (
          <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
            <div className="space-y-1.5">
              <Label htmlFor="dashboard-start-date">Data inicial</Label>
              <Input
                id="dashboard-start-date"
                type="date"
                value={customStartDate}
                onChange={(event) => setCustomStartDate(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dashboard-end-date">Data final</Label>
              <Input
                id="dashboard-end-date"
                type="date"
                value={customEndDate}
                onChange={(event) => setCustomEndDate(event.target.value)}
              />
            </div>
          </div>
        )}
      </section>

      {isLoading && !data ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <>
          {summary && (
            <section data-tour="dashboard-kpis" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Receitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(summary.totalIncome)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(summary.totalExpense)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Resultado do período</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={cn(
                      'text-2xl font-bold',
                      Number(summary.balance) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    )}
                  >
                    {formatCurrency(summary.balance)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Taxa de economia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={cn(
                      'text-2xl font-bold',
                      Number(summary.savingsRate) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'
                    )}
                  >
                    {Number(summary.savingsRate).toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Uso do orçamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{Number(totalBudgetUsage).toFixed(1)}%</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        totalBudgetUsage < 80 ? 'bg-emerald-500' : totalBudgetUsage < 100 ? 'bg-amber-500' : 'bg-rose-500'
                      )}
                      style={{ width: `${Math.min(100, Math.max(0, totalBudgetUsage))}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
 
          <section data-tour="dashboard-charts" className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Despesas por categoria</CardTitle>
              </CardHeader>
              <CardContent>
                {byCategory.length === 0 ? (
                  <p className="py-10 text-sm text-gray-500 dark:text-gray-400">Sem despesas no período selecionado.</p>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={byCategory}
                          dataKey="total"
                          nameKey="categoryName"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          innerRadius={52}
                          label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {byCategory.map((entry, index) => (
                            <Cell key={`${entry.categoryId}-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatChartCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução mensal</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyEvolution.length === 0 ? (
                  <p className="py-10 text-sm text-gray-500 dark:text-gray-400">Sem dados de evolução para o ano em foco.</p>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyEvolution.map((item) => ({
                          ...item,
                          monthLabel: MONTH_NAMES[item.monthName] ?? item.monthName,
                        }))}
                        margin={{ top: 8, right: 16, left: 8, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthLabel" />
                        <YAxis tickFormatter={(value) => `R$ ${Math.round(Number(value) / 1000)}k`} />
                        <Tooltip formatter={(value) => formatChartCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="totalIncome" stroke="#16a34a" strokeWidth={2.2} dot={{ r: 3 }} name="Receitas" />
                        <Line type="monotone" dataKey="totalExpense" stroke="#dc2626" strokeWidth={2.2} dot={{ r: 3 }} name="Despesas" />
                        <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={2.4} dot={{ r: 3 }} name="Saldo" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section data-tour="dashboard-bottom" className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Orçamentos por categoria</CardTitle>
              </CardHeader>
              <CardContent>
                {budgets.length === 0 ? (
                  <p className="py-10 text-sm text-gray-500 dark:text-gray-400">Nenhum orçamento disponível para o mês selecionado.</p>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={budgets.map((budget) => ({
                          category: budget.category.name,
                          limite: Number(budget.limitAmount),
                          gasto: Number(budget.spentAmount),
                        }))}
                        margin={{ top: 8, right: 12, left: 8, bottom: 36 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" angle={-20} textAnchor="end" interval={0} height={60} />
                        <YAxis tickFormatter={(value) => `R$ ${Math.round(Number(value) / 1000)}k`} />
                        <Tooltip formatter={(value) => formatChartCurrency(value)} />
                        <Legend />
                        <Bar dataKey="limite" fill="#0284c7" name="Limite" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="gasto" fill="#f97316" name="Gasto" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas e insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.slice(0, 3).map((alert, index) => (
                  <div key={`${alert.type}-${index}`} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.message}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{alert.categoryName ?? 'Geral'}</p>
                  </div>
                ))}

                {insights.slice(0, 3).map((insight, index) => (
                  <div key={`${insight.type}-${index}`} className="rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/30 dark:bg-blue-900/15">
                    <p className="text-sm text-blue-900 dark:text-blue-100">{insight.message}</p>
                    <p className="mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300">{insight.value}</p>
                  </div>
                ))}

                {alerts.length === 0 && insights.length === 0 && (
                  <p className="py-6 text-sm text-gray-500 dark:text-gray-400">Sem alertas ou insights para este período.</p>
                )}
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Transações recentes</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {recentTransactions.length === 0 ? (
                  <p className="py-6 text-sm text-gray-500 dark:text-gray-400">Nenhuma transação no período selecionado.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                        <th className="pb-3 font-semibold text-gray-500">Descrição</th>
                        <th className="pb-3 font-semibold text-gray-500">Categoria</th>
                        <th className="pb-3 font-semibold text-gray-500">Conta</th>
                        <th className="pb-3 font-semibold text-gray-500">Data</th>
                        <th className="pb-3 text-right font-semibold text-gray-500">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                          <td className="py-3 pr-3">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                            <Badge variant={transaction.type === 'INCOME' ? 'income' : 'expense'} className="mt-1">
                              {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                            </Badge>
                          </td>
                          <td className="py-3 pr-3 text-gray-600 dark:text-gray-300">{transaction.category.name}</td>
                          <td className="py-3 pr-3 text-gray-600 dark:text-gray-300">{transaction.account.name}</td>
                          <td className="py-3 pr-3 text-gray-600 dark:text-gray-300">{formatDate(transaction.date)}</td>
                          <td
                            className={cn(
                              'py-3 text-right font-semibold',
                              transaction.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            )}
                          >
                            {formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
