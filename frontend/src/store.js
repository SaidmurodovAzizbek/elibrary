import { create } from 'zustand';
import api from './api';

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

  login: async (phoneNumber, password) => {
    const res = await api.post('/auth/login', {
      phone_number: phoneNumber,
      password,
    });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({ isLoggedIn: true });
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
    set({ isLoggedIn: false, favorites: [] });
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
