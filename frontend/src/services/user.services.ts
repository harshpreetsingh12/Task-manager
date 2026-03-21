import { apiClient } from './apiClient';

export const userService = {
  getUser: () => apiClient(`/user`, { method: 'GET' }),
};