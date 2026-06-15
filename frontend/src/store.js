import { create } from 'zustand';
import api from './api';

/* JWT payload'ni dekod qilish. */
function decodeToken(token) {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/* Token mavjud, formati to'g'ri va muddati tugamaganmi? */
function isTokenValid(token) {
  const payload = decodeToken(token);
  if (!payload) return false;
  if (payload.exp && Date.now() >= payload.exp * 1000) return false;
  return true;
}

/* Boshlang'ich auth holati — muddati tugagan tokenni tozalaymiz. */
const _initialToken = localStorage.getItem('access_token');
const _initialValid = isTokenValid(_initialToken);
if (_initialToken && !_initialValid) {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export const useStore = create((set, get) => ({
  // ─── Cart ──────────────────────────────────────────────
  cart: [],
  addToCart: (book) => set((state) => {
    const exists = state.cart.find((item) => item.id === book.id);
    if (!exists) return { cart: [...state.cart, book] };
    return state;
  }),
  removeFromCart: (bookId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== bookId),
  })),
  clearCart: () => set({ cart: [] }),

  // ─── Auth ──────────────────────────────────────────────
  isLoggedIn: !!localStorage.getItem('access_token'),
  role: decodeToken(localStorage.getItem('access_token'))?.role ?? null,

  login: async (username, password) => {
    const res = await api.post('/auth/login', {
      username,
      password,
    });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({
      isLoggedIn: true,
      role: decodeToken(res.data.access_token)?.role ?? null,
    });
    await get().fetchFavorites();
  },

  register: async (phoneNumber, password) => {
    await api.post('/auth/register', {
      phone_number: phoneNumber,
      password,
    });
    await get().login(phoneNumber, password);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ isLoggedIn: false, role: null, favorites: [] });
  },

  // ─── Favorites ─────────────────────────────────────────
  favorites: [],

  fetchFavorites: async () => {
    try {
      const res = await api.get('/favorites/');
      set({ favorites: res.data });
    } catch {
      set({ favorites: [] });
    }
  },

  addFavorite: async (bookId) => {
    try {
      await api.post('/favorites/', { book_id: bookId });
      await get().fetchFavorites();
    } catch (err) {
      if (err.response?.status === 409) return;
      throw err;
    }
  },

  removeFavorite: async (bookId) => {
    await api.delete(`/favorites/${bookId}`);
    set((state) => ({
      favorites: state.favorites.filter((f) => f.book_id !== bookId),
    }));
  },
}));
