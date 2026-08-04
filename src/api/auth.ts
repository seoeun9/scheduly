import type { LoginRequest, LoginResponse } from '@/types/auth';
import { apiClient } from './client';

export const authApi = {
  login(body: LoginRequest) {
    return apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body,
      userToken: false,
    });
  },

  getMe() {
    return apiClient<LoginResponse['user']>('/user/me', {
      method: 'GET',
    });
  },
};
