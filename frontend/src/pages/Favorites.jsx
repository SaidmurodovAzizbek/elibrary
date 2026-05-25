import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Favorites.css';

export default function Favorites() {
  const [selectedBook, setSelectedBook] = useState(null);

  // Mock data for favorite books
  const favoriteBooks = [
    { 
      id: 1, 
      title: 'O\'tkan kunlar', 
      author: 'Abdulla Qodiriy', 
      cover: 'linear-gradient(135deg, #8a2be2, #4a00e0)', 
      rating: 4.9,
      publisher: 'Sharq nashriyoti',
      year: 1926,
      pages: 400,
      description: 'O\'zbek adabiyotining birinchi romani. Asarda XIX asr o\'rtalaridagi Qo\'qon xonligi hayoti, Otabek va Kumushbibi muhabbati va murakkab ijtimoiy munosabatlar tasvirlangan.'
    },
    { 
      id: 3, 
      title: 'Mehrobdan chayon', 
      author: 'Abdulla Qodiriy', 
      cover: 'linear-gradient(135deg, #ff7f50, #ff4500)', 
      rating: 4.7,
      publisher: 'O\'qituvchi',
      year: 1929,
      pages: 350,
      description: 'Qo\'qon xonligi davridagi xalq hayoti, Anvar va Ra\'noning sof muhabbati hamda saroy o\'yinlari yoritilgan asar.'
    },
    { 
      id: 5, 
      title: 'Sariq devni minib', 
      author: 'Xudoyberdi To\'xtaboyev', 
      cover: 'linear-gradient(135deg, #f1c40f, #f39c12)', 
      rating: 4.9,
      publisher: 'Kamalak',
      year: 1968,
      pages: 310,
      description: 'Hoshimjonning sehrli qalpoqcha yordamidagi qiziqarli va sarguzashtli sayohatlari haqida bolalar asari.'
    }
  ];

  const closeModal = () => setSelectedBook(null);

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="favorites-section">
        <div className="favorites-header">
          <h1 className="section-title">Sevimlilar</h1>
          <span className="favorites-count">{favoriteBooks.length} ta kitob</span>
        </div>
        
        {favoriteBooks.length > 0 ? (
          <div className="favorites-grid">
            {favoriteBooks.map((book, index) => (
              <motion.div 
                key={book.id} 
                className="fav-book-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBook(book)}
              >
                <div className="fav-book-card__cover" style={{ background: book.cover }}>
                  <div className="book-card__spine"></div>
                  {/* Heart Icon indicating it's a favorite */}
                  <div className="fav-book-card__heart">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>
                <div className="fav-book-card__info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <div className="fav-book-card__bottom">
                    <div className="fav-book-card__rating">⭐ {book.rating}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <h2>Sizda hozircha sevimli kitoblar yo'q</h2>
            <p>Kitoblar sahifasiga o'tib, o'zingizga yoqqanlarini sevimlilarga qo'shing.</p>
          </div>
        )}
      </section>

      {/* Book Details Modal (Reused Logic) */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div 
            className="book-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="book-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="book-modal__close" onClick={closeModal} aria-label="Yopish">×</button>
              
              <div className="book-modal__content">
                <div className="book-modal__image-wrapper">
                  <div className="book-modal__cover" style={{ background: selectedBook.cover }}>
                    <div className="book-card__spine"></div>
                  </div>
                </div>
                
                <div className="book-modal__details">
                  <h2 className="book-modal__title">{selectedBook.title}</h2>
                  <h4 className="book-modal__author">{selectedBook.author}</h4>
                  
                  <div className="book-modal__meta">
                    <div className="meta-item">
                      <span className="meta-label">Nashriyot:</span>
                      <span className="meta-value">{selectedBook.publisher}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Nashr yili:</span>
                      <span className="meta-value">{selectedBook.year}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Betlar soni:</span>
                      <span className="meta-value">{selectedBook.pages}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Reyting:</span>
                      <span className="meta-value">⭐ {selectedBook.rating}</span>
                    </div>
                  </div>
                  
                  <div className="book-modal__desc">
                    <h4>Qisqacha ma'lumot</h4>
                    <p>{selectedBook.description}</p>
                  </div>
                  
                  <div className="book-modal__actions">
                    <button className="book-modal__btn primary">O'qishni boshlash</button>
                    {/* Different action for favorites: Remove */}
                    <button className="book-modal__btn danger" onClick={() => {
                        console.log('Sevimlilardan o\'chirildi');
                        closeModal();
                    }}>
                      Sevimlilardan olib tashlash
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
