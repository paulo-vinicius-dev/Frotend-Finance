import { api } from '@/lib/axios'
import type { InsightResponse } from '../types/insight.types'

class InsightService {
  async getInsights(month?: number, year?: number): Promise<InsightResponse[]> {
    const { data } = await api.get<InsightResponse[]>('/api/v1/insights', {
      params: { month, year },
    })
    return data
  }
}

export const insightService = new InsightService()
