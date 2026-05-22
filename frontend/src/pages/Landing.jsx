import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Generate 40 items to ensure they cover the entire scrollable height
  // ALL books face pages-out with covers sticking out
  const leftSideItems = Array.from({ length: 40 }, (_, i) => {
    const visibleWidth = 140 + Math.sin(i * 1.7 + 3) * 90; // 50px to 230px
    const thickness = 20 + Math.abs(Math.cos(i * 2.1)) * 35; // 20px to 55px
    const colors = ['#8a2be2', '#008080', '#ff7f50', '#ffbc00', '#2c3e50', '#e74c3c', '#3498db', '#f1c40f'];
    const color = colors[i % colors.length];
    return { id: i, width: `${visibleWidth}px`, height: `${thickness}px`, color };
  });

  const rightSideItems = Array.from({ length: 40 }, (_, i) => {
    const visibleWidth = 140 + Math.cos(i * 2.3 + 1) * 90;
    const thickness = 20 + Math.abs(Math.sin(i * 1.8)) * 35;
    const colors = ['#34495e', '#16a085', '#d35400', '#2980b9', '#8e44ad', '#c0392b', '#27ae60', '#f39c12'];
    const color = colors[i % colors.length];
    return { id: i, width: `${visibleWidth}px`, height: `${thickness}px`, color };
  });

  return (
    <div className="landing-new" data-theme={theme}>
      {/* Texture and Pattern Overlays */}
      <div className="noise-overlay"></div>
      <div className="grid-overlay"></div>

      {/* Dynamic bright background effect elements */}
      <div className="landing-new__glow landing-new__glow--1"></div>
      <div className="landing-new__glow landing-new__glow--2"></div>

      <header className="landing-new__header">
        <motion.div 
          className="landing-new__logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          eLibrary
        </motion.div>
        
        <motion.div 
          className="landing-new__actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button className="landing-new__theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Night' : '☀️ Light'}
          </button>
          <div className="landing-new__lang">
            eng
          </div>
        </motion.div>
      </header>

      {/* ABSOLUTE SIDE GALLERIES (Book Stack Style) */}
      <div className="side-gallery left-gallery">
        {leftSideItems.map((item) => (
          <div 
            key={`left-${item.id}`} 
            className="book-stack-item left-book" 
            style={{ 
              width: item.width, 
              height: item.height,
              '--book-color': item.color 
            }} 
          >
            <div className="book-cover top-cover"></div>
            <div className="book-pages-block"></div>
            <div className="book-cover bottom-cover"></div>
          </div>
        ))}
      </div>

      <div className="side-gallery right-gallery">
        {rightSideItems.map((item) => (
          <div 
            key={`right-${item.id}`} 
            className="book-stack-item right-book" 
            style={{ 
              width: item.width, 
              height: item.height,
              '--book-color': item.color 
            }} 
          >
            <div className="book-cover top-cover"></div>
            <div className="book-pages-block"></div>
            <div className="book-cover bottom-cover"></div>
          </div>
        ))}
      </div>

      {/* Main hero section */}
      <main className="landing-new__main">
        <motion.div 
          className="landing-new__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="landing-new__badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            ✨ Yangi avlod kutubxonasi
          </motion.div>

          <h1 className="landing-new__title">Xush kelibsiz</h1>
          
          <div className="landing-new__lines">
            <motion.div className="line line-1" initial={{ width: 0 }} animate={{ width: "350px" }} transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}></motion.div>
            <motion.div className="line line-2" initial={{ width: 0 }} animate={{ width: "550px" }} transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}></motion.div>
            <motion.div className="line line-3" initial={{ width: 0 }} animate={{ width: "300px" }} transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}></motion.div>
            <motion.div className="line line-4" initial={{ width: 0 }} animate={{ width: "450px" }} transition={{ delay: 1.0, duration: 1, ease: "easeOut" }}></motion.div>
          </div>
          
          <motion.div 
            className="landing-new__scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Pastga suring <span className="scroll-arrow">⬇️</span>
          </motion.div>
        </motion.div>
      </main>

      {/* Notebooks scroll section */}
      <section className="notebooks-section">
        <div className="notebooks-container">
          
          {/* Notebook 1 (Blue) */}
          <motion.div 
            className="notebook notebook-blue"
            initial={{ x: "-50vw", y: 150, opacity: 0, rotate: -30 }}
            whileInView={{ x: -180, y: 50, opacity: 1, rotate: -20 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
          >
            <div className="notebook-spiral"></div>
            <div className="notebook-cover"></div>
          </motion.div>

          {/* Notebook 2 (Green) */}
          <motion.div 
            className="notebook notebook-green"
            initial={{ x: "50vw", y: 150, opacity: 0, rotate: 30 }}
            whileInView={{ x: 180, y: 50, opacity: 1, rotate: 20 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, type: "spring", bounce: 0.2, delay: 0.1 }}
          >
            <div className="notebook-spiral"></div>
            <div className="notebook-cover"></div>
          </motion.div>

          {/* Notebook 3 (Red) */}
          <motion.div 
            className="notebook notebook-red"
            initial={{ y: -150, opacity: 0, rotate: -15 }}
            whileInView={{ x: -40, y: -60, opacity: 1, rotate: -8 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, type: "spring", bounce: 0.2, delay: 0.2 }}
          >
            <div className="notebook-spiral"></div>
            <div className="notebook-cover"></div>
          </motion.div>

          {/* Notebook 4 (Yellow Front) */}
          <motion.div 
            className="notebook notebook-yellow-front"
            initial={{ y: 250, opacity: 0, scale: 0.8 }}
            whileInView={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.9, type: "spring", bounce: 0.3, delay: 0.3 }}
          >
            <div className="notebook-spiral"></div>
            <div className="notebook-content">
              <div className="cursive-links">
                <h2>Sahifalar</h2>
                <button className="notebook-btn-cursive" onClick={() => navigate('/home')}>Bosh sahifa</button>
                <button className="notebook-btn-cursive" onClick={() => navigate('/signin')}>Tizimga kirish</button>
                <button className="notebook-btn-cursive" onClick={() => navigate('/about')}>Biz haqimizda</button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <footer className="landing-new__footer">
        <p>© 2026 eLibrary - Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}
