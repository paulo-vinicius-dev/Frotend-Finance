import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'
import type { DashboardFilters } from '../types/dashboard.types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: (filters: DashboardFilters) => [...dashboardKeys.all, 'overview', filters] as const,
}

export function useDashboardOverview(filters: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.overview(filters),
    queryFn: () => dashboardService.getOverview(filters),
  })
}
