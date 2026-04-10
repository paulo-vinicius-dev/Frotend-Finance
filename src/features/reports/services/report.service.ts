import { api } from '@/lib/axios'
import type { CategoryBreakdownResponse, MonthlyEvolutionResponse, ReportFilters, SummaryResponse } from '../types/report.types'

class ReportService {
  private readonly base = '/api/v1/reports'

  async getSummary(filters?: ReportFilters): Promise<SummaryResponse> {
    const { data } = await api.get<SummaryResponse>(`${this.base}/summary`, { params: filters })
    return data
  }

  async getExpensesByCategory(filters?: ReportFilters): Promise<CategoryBreakdownResponse[]> {
    const { data } = await api.get<CategoryBreakdownResponse[]>(`${this.base}/by-category`, { params: filters })
    return data
  }

  async getMonthlyEvolution(year?: number): Promise<MonthlyEvolutionResponse[]> {
    const { data } = await api.get<MonthlyEvolutionResponse[]>(`${this.base}/monthly-evolution`, {
      params: year ? { year } : undefined,
    })
    return data
  }
}

export const reportService = new ReportService()
