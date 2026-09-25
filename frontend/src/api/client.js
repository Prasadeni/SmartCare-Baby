// src/api/client.js
import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';
import { mockAdapter } from './mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,
  ...(USE_MOCK ? { adapter: mockAdapter } : {}),
});

// Attach JWT on every outgoing request
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Global response handling
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      // Token expired or invalid — clear and send to login
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    // Normalize error message
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Something went wrong';
    return Promise.reject({ ...err, message });
  }
);

export const IS_MOCK = USE_MOCK;
export default client;
