import { apiClient } from './apiClient';

export const authService = {
  login: (credentials: any) => 
    apiClient('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (userData: any) => 
    apiClient('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';//force go back to login
  }
};