import api from './client';

export const hygieneApi = {
  getSamples: () => api.get('/hygiene/samples'),
  getHistory: () => api.get('/hygiene/history'),
  auditHygiene: (formData) => api.post('/hygiene/audit', formData),
};
