// API error shapes
export interface ApiFieldError {
  field: string
  message: string
}

export interface ApiError {
  status: number
  error: string
  message: string
  path: string
  timestamp: string
  fieldErrors?: ApiFieldError[]
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
  hasNext: boolean
}

export interface ListParams {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Auth
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

// User
export interface UserResponse {
  id: string
  fullName: string
  email: string
  roles: string[]
  isActive: boolean
}

// Accounts
export interface AccountResponse {
  id: string
  name: string
}

// Categories
export interface CategoryResponse {
  id: string
  name: string
  isDefault: boolean
}

// Transactions
export type TransactionType = 'INCOME' | 'EXPENSE'

export interface TransactionResponse {
  id: string
  category: CategoryResponse
  account: AccountResponse
  type: TransactionType
  amount: string | number
  date: string
  description: string
}

export interface TransactionRequest {
  categoryId: string
  accountId: string
  type: TransactionType
  amount: string
  date: string
  description: string
}
