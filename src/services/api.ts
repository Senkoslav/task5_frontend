import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath.startsWith('/verify');
      
      if (!isAuthPage) {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    status: 'UNVERIFIED' | 'ACTIVE' | 'BLOCKED';
    lastLogin: string | null;
    createdAt: string;
  };
  message?: string;
}

export interface BulkOperationRequest {
  userIds: number[];
}

export const authAPI = {
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  verifyEmail: (id: string) => api.get(`/auth/verify/${id}`),
};

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  blockUsers: (data: BulkOperationRequest) => api.post('/users/block', data),
  unblockUsers: (data: BulkOperationRequest) => api.post('/users/unblock', data),
  deleteUsers: (data: BulkOperationRequest) => api.post('/users/delete', data),
};

export default api;