import { create } from 'zustand';

export const useStore = create((set) => ({
  cart: [],
  addToCart: (book) => set((state) => {
    // Check if book is already in cart to prevent duplicates
    const isExists = state.cart.find((item) => item.id === book.id);
    if (!isExists) {
      return { cart: [...state.cart, book] };
    }
    return state;
  }),
  removeFromCart: (bookId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== bookId)
  })),
  clearCart: () => set({ cart: [] })
}));
