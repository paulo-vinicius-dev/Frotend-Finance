import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { budgetService } from '../services/budget.service'
import type { BudgetCreate, BudgetUpdate } from '../types/budget.types'
import { toast } from 'react-hot-toast'

export const budgetKeys = {
  all: ['budgets'] as const,
  lists: (month?: number, year?: number) => [...budgetKeys.all, 'list', month, year] as const,
  detail: (id: string) => [...budgetKeys.all, 'detail', id] as const,
}

export function useBudgets(month?: number, year?: number) {
  return useQuery({
    queryKey: budgetKeys.lists(month, year),
    queryFn: () => budgetService.list(month, year),
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BudgetCreate) => budgetService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all })
      toast.success('Orçamento criado com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao criar orçamento'
      toast.error(message)
    },
  })
}

export function useUpdateBudget(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BudgetUpdate) => budgetService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all })
      toast.success('Orçamento atualizado com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar orçamento'
      toast.error(message)
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => budgetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all })
      toast.success('Orçamento removido com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao remover orçamento'
      toast.error(message)
    },
  })
}
