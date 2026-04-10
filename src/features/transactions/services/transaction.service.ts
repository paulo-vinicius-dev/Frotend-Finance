import { api } from '@/lib/axios'
import type { Transaction, TransactionCreate, TransactionFilter, TransactionUpdate } from '../types/transaction.types'

class TransactionService {
  private readonly base = '/api/transactions'

  async list(filters?: TransactionFilter): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>(this.base, { params: filters })
    return data
  }

  async getById(id: string): Promise<Transaction> {
    const { data } = await api.get<Transaction>(`${this.base}/${id}`)
    return data
  }

  async create(payload: TransactionCreate): Promise<Transaction> {
    const { data } = await api.post<Transaction>(this.base, payload)
    return data
  }

  async update(id: string, payload: TransactionUpdate): Promise<Transaction> {
    const { data } = await api.put<Transaction>(`${this.base}/${id}`, payload)
    return data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.base}/${id}`)
  }
}

export const transactionService = new TransactionService()
