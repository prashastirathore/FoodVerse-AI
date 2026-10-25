import api from './client';

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  loginDemoGuest: () => api.post('/auth/demo-guest'),
  getMe: () => api.get('/auth/me'),
  getStatus: () => api.get('/auth/status'),
  configureGeminiKey: (apiKey) => api.post('/auth/configure-gemini-key', { api_key: apiKey }),
};
