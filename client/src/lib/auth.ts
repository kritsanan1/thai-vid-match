import { apiRequest } from './queryClient';

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
}

export const auth = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    return apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return apiRequest('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signOut(): Promise<void> {
    await apiRequest('/api/auth/signout', {
      method: 'POST',
    });
  },

  async getUser(): Promise<AuthResponse> {
    return apiRequest('/api/auth/me');
  },
};