import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state
  const [theme, setTheme] = useState('light');
  
  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Cart state from Zustand
  const cart = useStore((state) => state.cart);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Simulate login logic
    console.log('Login logic executed');
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <motion.header 
        className="navbar-new"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      >
        <div className="navbar-new__container">
          
          {/* Left: Logo */}
          <div className="navbar-new__logo-wrapper" onClick={() => navigate('/home')}>
            <div className="navbar-new__logo">eLibrary</div>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="navbar-new__nav">
            <NavLink to="/home" className={({ isActive }) => `navbar-new__link ${isActive ? 'active' : ''}`}>
              Kitoblar
            </NavLink>
            <NavLink to="/authors" className={({ isActive }) => `navbar-new__link ${isActive ? 'active' : ''}`}>
              Mualliflar
            </NavLink>
            <NavLink to="/publishers" className={({ isActive }) => `navbar-new__link ${isActive ? 'active' : ''}`}>
              Nashriyotlar
            </NavLink>
          </nav>

          {/* Right: Actions */}
          <div className="navbar-new__actions">
            {/* Search */}
            <form className={`navbar-new__search ${isSearchActive ? 'active' : ''}`} onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Qidiruv..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
              />
              <button type="submit" className="navbar-new__icon-btn" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>

            {/* Favorites */}
            <NavLink to="/favorites" className={({ isActive }) => `navbar-new__icon-btn nav-icon ${isActive ? 'active-icon' : ''}`} title="Sevimlilar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </NavLink>

            {/* Cart */}
            <NavLink to="/cart" className={({ isActive }) => `navbar-new__icon-btn nav-icon cart-icon ${isActive ? 'active-icon' : ''}`} title="Korzinka">
              <div style={{ position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
              </div>
            </NavLink>

            {/* Theme Toggle */}
            <button className="navbar-new__theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Night' : '☀️ Light'}
            </button>

            {/* Login Button */}
            <button className="navbar-new__login-btn" onClick={() => setIsLoginModalOpen(true)}>
              Log in
            </button>
          </div>
        </div>
      </motion.header>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div 
            className="login-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginModalOpen(false)}
          >
            <motion.div 
              className="login-modal"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="login-modal__close" onClick={() => setIsLoginModalOpen(false)} aria-label="Yopish">×</button>
              
              <div className="login-modal__header">
                <h2>Tizimga kirish</h2>
                <p>Telefon raqamingiz va parolingizni kiriting</p>
              </div>

              <form className="login-modal__form" onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <label>Telefon raqam</label>
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+998</span>
                    <input 
                      type="tel" 
                      placeholder="90 123 45 67" 
                      required 
                      pattern="[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}|[0-9]{9}" 
                      title="Misol: 90 123 45 67"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Parol</label>
                  <input 
                    type="password" 
                    placeholder="Parolingizni kiriting" 
                    required 
                    minLength="6"
                  />
                </div>

                <button type="submit" className="login-modal__submit" style={{marginTop: '1.5rem'}}>Kirish</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
