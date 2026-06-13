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

  // ─── Auth & role ───────────────────────────────────────
  // role: null (guest) | 'reviewer' | 'admin'
  // NOTE: backend does not return roles yet, so the role is chosen
  // at login and stored locally. Wire to the API token later.
  isLoggedIn: !!localStorage.getItem('access_token'),
  role: localStorage.getItem('role') || null,

  login: async (phoneNumber, password, role = 'reviewer') => {
    const res = await api.post('/auth/login', {
      phone_number: phoneNumber,
      password,
    });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    localStorage.setItem('role', role);
    set({ isLoggedIn: true, role });
    await get().fetchFavorites();
  },

  register: async (phoneNumber, password, role = 'reviewer') => {
    await api.post('/auth/register', {
      phone_number: phoneNumber,
      password,
    });
    await get().login(phoneNumber, password, role);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
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
