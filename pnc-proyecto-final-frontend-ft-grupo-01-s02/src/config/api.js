// src/config/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://sportmatch-backend-production-7c80.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api, API_URL };
export default api;
