import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
});

// Request interceptor to attach JWT token and handle multipart
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodverse_token') || 'demo-token';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If FormData, let browser set multipart/form-data with proper boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
