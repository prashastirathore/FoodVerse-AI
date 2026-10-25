import api from './client';

export const nutritionApi = {
  getSamples: () => api.get('/nutrition/samples'),
  getHistory: () => api.get('/nutrition/history'),
  analyzeNutrition: (formData) => api.post('/nutrition/analyze', formData),
};
