export interface Account {
  id: string
  name: string
  balance?: string
  createdAt?: string
  updatedAt?: string | null
}

export type AccountCreate = Pick<Account, 'name'>
export type AccountUpdate = Partial<Pick<Account, 'name'>>
