import { api } from '@/lib/axios'
import type { Account, AccountCreate, AccountUpdate } from '../types/account.types'

class AccountService {
  private readonly base = '/api/v1/accounts'

  async list(): Promise<Account[]> {
    const { data } = await api.get<Account[]>(this.base)
    return data
  }

  async getById(id: string): Promise<Account> {
    const { data } = await api.get<Account>(`${this.base}/${id}`)
    return data
  }

  async create(payload: AccountCreate): Promise<Account> {
    const { data } = await api.post<Account>(this.base, payload)
    return data
  }

  async update(id: string, payload: AccountUpdate): Promise<Account> {
    const { data } = await api.put<Account>(`${this.base}/${id}`, payload)
    return data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.base}/${id}`)
  }
}

export const accountService = new AccountService()
