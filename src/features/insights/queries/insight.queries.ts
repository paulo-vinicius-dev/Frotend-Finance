import { useQuery } from '@tanstack/react-query'
import { insightService } from '../services/insight.service'

export const insightKeys = {
  all: ['insights'] as const,
  list: (month?: number, year?: number) => [...insightKeys.all, month, year] as const,
}

export function useInsights(month?: number, year?: number) {
  return useQuery({
    queryKey: insightKeys.list(month, year),
    queryFn: () => insightService.getInsights(month, year),
  })
}
