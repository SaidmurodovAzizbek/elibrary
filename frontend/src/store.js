import { create } from 'zustand';
import api from './api';

/* JWT payload ichidan rolni o'qish (admin / reviewer). */
function decodeRole(token) {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)).role || null;
  } catch {
    return null;
  }
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
  role: decodeRole(localStorage.getItem('access_token')),

  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({ isLoggedIn: true, role: decodeRole(res.data.access_token) });
    await get().fetchFavorites();
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
