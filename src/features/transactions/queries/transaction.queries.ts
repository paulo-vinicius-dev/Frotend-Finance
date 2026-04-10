import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transaction.service'
import type { TransactionCreate, TransactionFilter, TransactionUpdate } from '../types/transaction.types'
import { toast } from 'react-hot-toast'

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: (filters?: TransactionFilter) => [...transactionKeys.all, 'list', filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
}

export function useTransactions(filters?: TransactionFilter) {
  return useQuery({
    queryKey: transactionKeys.lists(filters),
    queryFn: () => transactionService.list(filters),
  })
}

export function useTransactionById(id: string | null) {
  return useQuery({
    queryKey: id ? transactionKeys.detail(id) : [null],
    queryFn: () => (id ? transactionService.getById(id) : null),
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TransactionCreate) => transactionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      toast.success('Transação criada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao criar transação'
      toast.error(message)
    },
  })
}

export function useUpdateTransaction(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TransactionUpdate) => transactionService.update(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(transactionKeys.detail(id), data)
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      toast.success('Transação atualizada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar transação'
      toast.error(message)
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      toast.success('Transação deletada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao deletar transação'
      toast.error(message)
    },
  })
}
