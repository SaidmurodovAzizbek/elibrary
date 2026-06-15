import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';

/**
 * Himoyalangan route — faqat tizimga kirgan foydalanuvchini o'tkazadi.
 * Kirmagan bo'lsa /login sahifasiga yo'naltiradi.
 */
export default function ProtectedRoute() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
