const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = async (
    endpoint: string,
    options: RequestInit = {}
) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { 
    ...options,
    credentials: 'include',
    headers
 });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API Request Failed');
  }

  return response.json();
};