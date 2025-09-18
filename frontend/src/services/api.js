/**
 * services/api.js
 * Axios-based API client. Reads VITE_API_BASE_URL from env, and attaches Authorization header if token present.
 */

import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE + '/api',
  timeout: 10000
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
