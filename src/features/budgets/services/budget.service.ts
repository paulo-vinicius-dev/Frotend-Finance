import { api } from '@/lib/axios'
import type { Budget, BudgetCreate, BudgetUpdate } from '../types/budget.types'

class BudgetService {
  private readonly base = '/api/v1/budgets'

  async list(month?: number, year?: number): Promise<Budget[]> {
    const { data } = await api.get<Budget[]>(this.base, { params: { month, year } })
    return data
  }

  async getById(id: string): Promise<Budget> {
    const { data } = await api.get<Budget>(`${this.base}/${id}`)
    return data
  }

  async create(payload: BudgetCreate): Promise<Budget> {
    const { data } = await api.post<Budget>(this.base, payload)
    return data
  }

  async update(id: string, payload: BudgetUpdate): Promise<Budget> {
    const { data } = await api.put<Budget>(`${this.base}/${id}`, payload)
    return data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.base}/${id}`)
  }
}

export const budgetService = new BudgetService()
