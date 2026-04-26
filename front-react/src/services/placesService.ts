import { api } from './api';

export const placesService = {
  list: async () => api.get('/api/places/'),
  create: async (data: any) => api.post('/api/places/', data),
  update: async (id: number | string, data: any) => api.put(`/api/places/${id}/`, data),
};
