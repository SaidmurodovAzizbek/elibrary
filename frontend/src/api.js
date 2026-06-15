import axios from 'axios';

// Production'da Vercel env-variable (VITE_API_URL) ishlatiladi;
// lokal dev'da fallback sifatida localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token muddati tugasa yoki yaroqsiz bo'lsa (401) — tizimdan chiqarib,
// login sahifasiga yo'naltiramiz. Login so'rovining o'zidagi 401 bundan mustasno.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    if (status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
