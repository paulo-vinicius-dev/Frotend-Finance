import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/report.service'
import type { ReportFilters } from '../types/report.types'

export const reportKeys = {
  all: ['reports'] as const,
  summary: (filters?: ReportFilters) => [...reportKeys.all, 'summary', filters] as const,
  byCategory: (filters?: ReportFilters) => [...reportKeys.all, 'by-category', filters] as const,
  monthlyEvolution: (year?: number) => [...reportKeys.all, 'monthly-evolution', year] as const,
}

export function useReportSummary(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.summary(filters),
    queryFn: () => reportService.getSummary(filters),
  })
}

export function useExpensesByCategory(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.byCategory(filters),
    queryFn: () => reportService.getExpensesByCategory(filters),
  })
}

export function useMonthlyEvolution(year?: number) {
  return useQuery({
    queryKey: reportKeys.monthlyEvolution(year),
    queryFn: () => reportService.getMonthlyEvolution(year),
  })
}
