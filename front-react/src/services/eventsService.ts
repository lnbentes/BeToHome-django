import { api } from './api';

export const eventsService = {
  list: async () => api.get('/api/events/'),
  create: async (data: any) => api.post('/api/events/', data),
};
