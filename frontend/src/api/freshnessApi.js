import api from './client';

export const freshnessApi = {
  getSamples: () => api.get('/freshness/samples'),
  getHistory: () => api.get('/freshness/history'),
  analyzeFreshness: (formData) => api.post('/freshness/analyze', formData),
};
