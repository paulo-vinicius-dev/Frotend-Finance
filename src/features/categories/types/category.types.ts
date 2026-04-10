export interface Category {
  id: string
  name: string
  isDefault: boolean
}

export type CategoryCreate = Pick<Category, 'name'>
export type CategoryUpdate = Partial<Pick<Category, 'name'>>
