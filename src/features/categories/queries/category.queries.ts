import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../services/category.service'
import type { CategoryCreate, CategoryUpdate } from '../types/category.types'
import { toast } from 'react-hot-toast'

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryService.list(),
  })
}

export function useCategoryById(id: string | null) {
  return useQuery({
    queryKey: id ? categoryKeys.detail(id) : [null],
    queryFn: () => (id ? categoryService.getById(id) : null),
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CategoryCreate) => categoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Categoria criada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao criar categoria'
      toast.error(message)
    },
  })
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CategoryUpdate) => categoryService.update(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(categoryKeys.detail(id), data)
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Categoria atualizada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar categoria'
      toast.error(message)
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Categoria deletada com sucesso')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao deletar categoria'
      toast.error(message)
    },
  })
}
