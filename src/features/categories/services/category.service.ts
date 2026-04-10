import { api } from '@/lib/axios'
import type { Category, CategoryCreate, CategoryUpdate } from '../types/category.types'

class CategoryService {
  private readonly base = '/api/categories'

  async list(): Promise<Category[]> {
    const { data } = await api.get<Category[]>(this.base)
    return data
  }

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<Category>(`${this.base}/${id}`)
    return data
  }

  async create(payload: CategoryCreate): Promise<Category> {
    const { data } = await api.post<Category>(this.base, payload)
    return data
  }

  async update(id: string, payload: CategoryUpdate): Promise<Category> {
    const { data } = await api.put<Category>(`${this.base}/${id}`, payload)
    return data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.base}/${id}`)
  }
}

export const categoryService = new CategoryService()
