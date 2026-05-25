import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="main-layout">
      {/* Texture and Pattern Overlays from Landing Page */}
      <div className="noise-overlay"></div>
      <div className="grid-overlay"></div>

      {/* Dynamic bright background effect elements */}
      <div className="main-layout__glow main-layout__glow--1"></div>
      <div className="main-layout__glow main-layout__glow--2"></div>

      <Navbar />
      
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
