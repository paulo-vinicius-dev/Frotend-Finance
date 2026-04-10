import { useState } from 'react'
import { useAlerts } from './queries/alert.queries'
import type { AlertSeverity } from './types/alert.types'
import { Card, CardContent, Spinner } from '@/components/ui'
import { AlertTriangle, XCircle, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

const SEVERITY_CONFIG: Record<AlertSeverity, { icon: React.ElementType; color: string; border: string }> = {
  INFO: { icon: Info, color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  WARNING: { icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
  DANGER: { icon: XCircle, color: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
}

export default function AlertsPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const { data, isLoading } = useAlerts(month, year)

  const alerts = data ?? []
  const danger = alerts.filter((a) => a.severity === 'DANGER')
  const warning = alerts.filter((a) => a.severity === 'WARNING')
  const info = alerts.filter((a) => a.severity === 'INFO')
  const sorted = [...danger, ...warning, ...info]

  return (
    <div className="space-y-6">
      <div data-tour="alerts-header" className="flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-bold">Alertas</h1>
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
      ) : sorted.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
            Nenhum alerta para este período.
          </CardContent>
        </Card>
      ) : (
        <div data-tour="alerts-list" className="space-y-3">
          {sorted.map((alert, i) => {
            const config = SEVERITY_CONFIG[alert.severity]
            const Icon = config.icon
            return (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-4 rounded-lg border bg-white p-4 dark:bg-gray-950',
                  config.border
                )}
              >
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.color)} />
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{alert.message}</p>
                  {alert.categoryName && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Categoria: {alert.categoryName}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
