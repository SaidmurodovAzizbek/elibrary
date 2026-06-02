import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useStore();
  const navigate = useNavigate();

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="cart-section">
        <div className="cart-header">
          <h1 className="section-title">Korzinka</h1>
          {cart.length > 0 && (
            <span className="cart-count">{cart.length} ta kitob mavjud</span>
          )}
        </div>
        
        {cart.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((book, index) => (
                <motion.div 
                  key={book.id} 
                  className="cart-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="cart-item__cover" style={{ background: book.cover }}>
                    <div className="book-card__spine"></div>
                  </div>
                  
                  <div className="cart-item__details">
                    <h3 className="cart-item__title">{book.title}</h3>
                    <p className="cart-item__author">{book.author}</p>
                    <div className="cart-item__meta">
                      <span>{book.publisher}</span> • <span>{book.year}</span>
                    </div>
                  </div>

                  <div className="cart-item__actions">
                    <button 
                      className="cart-item__remove" 
                      onClick={() => removeFromCart(book.id)}
                      title="O'chirish"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary__box">
                <h2>Buyurtma ma'lumoti</h2>
                
                <div className="summary-row">
                  <span>Jami kitoblar:</span>
                  <span>{cart.length} ta</span>
                </div>
                <div className="summary-row">
                  <span>Yetkazib berish:</span>
                  <span>Bepul</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <button className="summary-btn primary" onClick={() => {
                  alert("Buyurtmangiz rasmiylashtirildi!");
                  clearCart();
                }}>
                  Buyurtmani rasmiylashtirish
                </button>
                <button className="summary-btn secondary" onClick={() => clearCart()}>
                  Korzinkani tozalash
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h2>Korzinangiz hozircha bo'sh</h2>
            <p>O'zingizga yoqqan kitoblarni topib, "Buyurtma qilish" tugmasini bosing.</p>
            <button className="empty-cart__btn" onClick={() => navigate('/home')}>
              Kitoblar bo'limiga o'tish
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
}
