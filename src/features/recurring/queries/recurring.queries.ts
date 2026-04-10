import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { recurringService } from '../services/recurring.service'
import type { RecurringCreate, RecurringUpdate } from '../types/recurring.types'
import { toast } from 'react-hot-toast'

export const recurringKeys = {
  all: ['recurring'] as const,
  lists: () => [...recurringKeys.all, 'list'] as const,
}

export function useRecurring() {
  return useQuery({
    queryKey: recurringKeys.lists(),
    queryFn: () => recurringService.list(),
  })
}

export function useCreateRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RecurringCreate) => recurringService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.all })
      toast.success('Movimentação recorrente criada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao criar movimentação recorrente'
      toast.error(message)
    },
  })
}

export function useUpdateRecurring(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RecurringUpdate) => recurringService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.all })
      toast.success('Movimentação recorrente atualizada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar movimentação recorrente'
      toast.error(message)
    },
  })
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recurringService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.all })
      toast.success('Movimentação recorrente excluída')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao excluir movimentação recorrente'
      toast.error(message)
    },
  })
}
