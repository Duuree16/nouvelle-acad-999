import axios, { AxiosError } from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProgressData {
  lessonId: string;
  score: number;
  completed: boolean;
  progress: number;
}

export interface Progress {
  id: string;
  lessonId: string;
  completed: boolean;
  score: number;
  progress: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authAPI = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  async update(data: ProgressData): Promise<{ progress: Progress }> {
    const response = await apiClient.post<{ progress: Progress }>(
      '/progress',
      data
    );
    return response.data;
  },

  async getAll(): Promise<{ progress: Progress[] }> {
    const response = await apiClient.get<{ progress: Progress[] }>('/progress');
    return response.data;
  },

  async getByLesson(lessonId: string): Promise<{ progress: Progress }> {
    const response = await apiClient.get<{ progress: Progress }>(
      `/progress/${lessonId}`
    );
    return response.data;
  },
};

export default apiClient;
