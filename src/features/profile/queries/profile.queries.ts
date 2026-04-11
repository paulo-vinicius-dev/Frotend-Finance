import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export const profileKeys = {
  me: ['profile', 'me'] as const,
}

export function useMe() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: () => profileService.getMe(),
  })
}

export function useDeleteMe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => profileService.deleteMe(),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
