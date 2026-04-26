import { api } from './api';

export const tasksService = {
  list: async () => api.get('/api/tasks/'),
  create: async (data: any) => api.post('/api/tasks/', data),
  update: async (id: number | string, data: any) => api.put(`/api/tasks/${id}/`, data),
  delete: async (id: number | string) => api.delete(`/api/tasks/${id}/`),
};
