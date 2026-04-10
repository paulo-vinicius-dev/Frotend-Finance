import { useQuery } from '@tanstack/react-query'
import { alertService } from '../services/alert.service'

export const alertKeys = {
  all: ['alerts'] as const,
  list: (month?: number, year?: number) => [...alertKeys.all, month, year] as const,
}

export function useAlerts(month?: number, year?: number) {
  return useQuery({
    queryKey: alertKeys.list(month, year),
    queryFn: () => alertService.getAlerts(month, year),
  })
}

/** Returns alert count for current month — used by the topbar bell. */
export function useCurrentMonthAlertCount() {
  const now = new Date()
  const { data } = useAlerts(now.getMonth() + 1, now.getFullYear())
  return data?.length ?? 0
}
