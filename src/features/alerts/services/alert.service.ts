import { api } from '@/lib/axios'
import type { AlertResponse } from '../types/alert.types'

class AlertService {
  async getAlerts(month?: number, year?: number): Promise<AlertResponse[]> {
    const { data } = await api.get<AlertResponse[]>('/api/v1/alerts', {
      params: { month, year },
    })
    return data
  }
}

export const alertService = new AlertService()
