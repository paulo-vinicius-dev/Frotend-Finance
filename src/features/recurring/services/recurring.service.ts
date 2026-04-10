import { api } from '@/lib/axios'
import type { RecurringTransaction, RecurringCreate, RecurringUpdate } from '../types/recurring.types'

class RecurringService {
  private readonly base = '/api/v1/recurring'

  async list(): Promise<RecurringTransaction[]> {
    const { data } = await api.get<RecurringTransaction[]>(this.base)
    return data
  }

  async getById(id: string): Promise<RecurringTransaction> {
    const { data } = await api.get<RecurringTransaction>(`${this.base}/${id}`)
    return data
  }

  async create(payload: RecurringCreate): Promise<RecurringTransaction> {
    const { data } = await api.post<RecurringTransaction>(this.base, payload)
    return data
  }

  async update(id: string, payload: RecurringUpdate): Promise<RecurringTransaction> {
    const { data } = await api.put<RecurringTransaction>(`${this.base}/${id}`, payload)
    return data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.base}/${id}`)
  }
}

export const recurringService = new RecurringService()
