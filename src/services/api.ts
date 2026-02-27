import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const auth = {
  login: (username: string, password: string) => api.post('/auth/login', { username, password }),
  register: (username: string, password: string, role?: string) => 
    api.post('/auth/register', { username, password, role }),
  me: () => api.get('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Family Members
export const familyMembers = {
  getAll: () => api.get('/family-members'),
  get: (id: string) => api.get(`/family-members/${id}`),
  create: (data: { name: string; color: string }) => api.post('/family-members', data),
  update: (id: string, data: { name: string; color: string }) => api.put(`/family-members/${id}`, data),
  delete: (id: string) => api.delete(`/family-members/${id}`),
};

// Events
export const events = {
  getAll: (params?: { start?: string; end?: string }) => api.get('/events', { params }),
  get: (id: string) => api.get(`/events/${id}`),
  create: (data: Partial<any>) => api.post('/events', data),
  update: (id: string, data: Partial<any>) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

// Tasks
export const tasks = {
  getAll: (params?: { completed?: boolean; family_member_id?: string; category?: string }) => 
    api.get('/tasks', { params }),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (data: Partial<any>) => api.post('/tasks', data),
  update: (id: string, data: Partial<any>) => api.put(`/tasks/${id}`, data),
  toggle: (id: string) => api.patch(`/tasks/${id}/toggle`),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Homework
export const homework = {
  getAll: (params?: { completed?: boolean; family_member_id?: string; due_before?: string; due_after?: string }) =>
    api.get('/homework', { params }),
  get: (id: string) => api.get(`/homework/${id}`),
  create: (data: Partial<any>) => api.post('/homework', data),
  update: (id: string, data: Partial<any>) => api.put(`/homework/${id}`, data),
  toggle: (id: string) => api.patch(`/homework/${id}/toggle`),
  delete: (id: string) => api.delete(`/homework/${id}`),
};

// Instrument Practice
export const instrumentPractice = {
  getAll: (params?: { family_member_id?: string; start_date?: string; end_date?: string }) =>
    api.get('/instrument-practice', { params }),
  get: (id: string) => api.get(`/instrument-practice/${id}`),
  create: (data: Partial<any>) => api.post('/instrument-practice', data),
  update: (id: string, data: Partial<any>) => api.put(`/instrument-practice/${id}`, data),
  delete: (id: string) => api.delete(`/instrument-practice/${id}`),
};

// Meals
export const meals = {
  getAll: (params?: { start_date?: string; end_date?: string }) => api.get('/meals', { params }),
  getByDate: (date: string) => api.get(`/meals/date/${date}`),
  get: (id: string) => api.get(`/meals/${id}`),
  create: (data: Partial<any>) => api.post('/meals', data),
  update: (id: string, data: Partial<any>) => api.put(`/meals/${id}`, data),
  delete: (id: string) => api.delete(`/meals/${id}`),
};

// Classes
export const classes = {
  getAll: (params?: { family_member_id?: string }) => api.get('/classes', { params }),
  get: (id: string) => api.get(`/classes/${id}`),
  create: (data: Partial<any>) => api.post('/classes', data),
  update: (id: string, data: Partial<any>) => api.put(`/classes/${id}`, data),
  delete: (id: string) => api.delete(`/classes/${id}`),
  getAttendance: (id: string) => api.get(`/classes/${id}/attendance`),
  addAttendance: (id: string, data: { date: string; completed: boolean; notes?: string }) =>
    api.post(`/classes/${id}/attendance`, data),
};

// Event Types
export const eventTypes = {
  getAll: () => api.get('/event-types'),
  get: (id: string) => api.get(`/event-types/${id}`),
  create: (data: { name: string; color: string; icon?: string }) => api.post('/event-types', data),
  update: (id: string, data: { name: string; color: string; icon?: string }) => api.put(`/event-types/${id}`, data),
  delete: (id: string) => api.delete(`/event-types/${id}`),
};

// Task Types
export const taskTypes = {
  getAll: () => api.get('/task-types'),
  get: (id: string) => api.get(`/task-types/${id}`),
  create: (data: { name: string; color: string; icon?: string }) => api.post('/task-types', data),
  update: (id: string, data: { name: string; color: string; icon?: string }) => api.put(`/task-types/${id}`, data),
  delete: (id: string) => api.delete(`/task-types/${id}`),
};

// Dashboard / TV Dashboard endpoints (public)
export const dashboard = {
  getLeaderboard: () => api.get('/leaderboard'),
  getUserStats: (userId: string) => api.get(`/users/${userId}/stats`),
  getWeather: () => api.get('/weather'),
  getNews: () => api.get('/news'),
};

export default api;