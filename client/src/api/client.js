import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dastak_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ERR_NETWORK') {
    return 'We could not reach the Dastak server. Please check that the API is running.';
  }
  return fallback;
}

export default api;
