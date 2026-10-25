import api from './client';

export const mealApi = {
  generatePlan: (data) => api.post('/meals/generate', data),
  swapMeal: (data) => api.post('/meals/swap', data),
  getSavedPlans: () => api.get('/meals/saved'),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};
