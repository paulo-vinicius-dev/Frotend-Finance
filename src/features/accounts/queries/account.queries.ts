import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { accountService } from '../services/account.service'
import type { AccountCreate, AccountUpdate } from '../types/account.types'
import { toast } from 'react-hot-toast'

export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
}

export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: () => accountService.list(),
  })
}

export function useAccountById(id: string | null) {
  return useQuery({
    queryKey: id ? accountKeys.detail(id) : [null],
    queryFn: () => (id ? accountService.getById(id) : null),
    enabled: !!id,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AccountCreate) => accountService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      toast.success('Conta criada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao criar conta'
      toast.error(message)
    },
  })
}

export function useUpdateAccount(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AccountUpdate) => accountService.update(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(accountKeys.detail(id), data)
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      toast.success('Conta atualizada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar conta'
      toast.error(message)
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => accountService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      toast.success('Conta deletada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao deletar conta'
      toast.error(message)
    },
  })
}
