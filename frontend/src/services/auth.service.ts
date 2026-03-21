import { apiClient } from './apiClient';

export const authService = {
  login: (credentials: any) => 
    apiClient('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (userData: any) => 
    apiClient('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    
  logout: () => apiClient('/auth/logout', { method: 'POST'}),

};