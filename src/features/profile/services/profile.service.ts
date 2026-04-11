import { api } from '@/lib/axios'
import type { UserResponse } from '@/types/api'

class ProfileService {
  async getMe(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>('/api/v1/users/me')
    return data
  }

  async deleteMe(): Promise<void> {
    await api.delete('/api/v1/users/me')
  }
}

export const profileService = new ProfileService()
