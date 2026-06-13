import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import './Favorites.css';

const GRADIENTS = [
  'linear-gradient(135deg, #8a2be2, #4a00e0)',
  'linear-gradient(135deg, #008080, #004d40)',
  'linear-gradient(135deg, #ff7f50, #ff4500)',
  'linear-gradient(135deg, #3498db, #2980b9)',
  'linear-gradient(135deg, #f1c40f, #f39c12)',
  'linear-gradient(135deg, #e74c3c, #c0392b)',
  'linear-gradient(135deg, #1abc9c, #16a085)',
  'linear-gradient(135deg, #9b59b6, #8e44ad)',
];

export default function Favorites() {
  const [selectedBook, setSelectedBook] = useState(null);

  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const favorites = useStore((state) => state.favorites);
  const fetchFavorites = useStore((state) => state.fetchFavorites);
  const removeFavorite = useStore((state) => state.removeFavorite);

  useEffect(() => {
    if (isLoggedIn) fetchFavorites();
  }, [isLoggedIn]);

  const closeModal = () => setSelectedBook(null);

  const handleRemove = async (bookId) => {
    await removeFavorite(bookId);
    closeModal();
  };

  if (!isLoggedIn) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className="favorites-section">
          <div className="empty-favorites">
            <h2>Tizimga kirish kerak</h2>
            <p>Sevimli kitoblarni ko'rish uchun avval tizimga kiring.</p>
          </div>
        </section>
      </motion.div>
    );
  }

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
          <div className="page-head" style={{ marginBottom: 0 }}>
            <span className="page-eyebrow">Shaxsiy kutubxona</span>
            <h1 className="section-title">Sizning <span className="grad-text">sevimlilaringiz</span></h1>
          </div>
          <span className="favorites-count">{favorites.length} ta kitob</span>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <h2>Sizda hozircha sevimli kitoblar yo'q</h2>
            <p>Kitoblar sahifasiga o'tib, o'zingizga yoqqanlarini sevimlilarga qo'shing.</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((fav, index) => {
              const book = fav.book;
              if (!book) return null;
              return (
                <motion.div
                  key={fav.id}
                  className="fav-book-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedBook({ ...book, favBookId: book.id })}
                >
                  <div
                    className="fav-book-card__cover"
                    style={{ background: book.image ? `url(${book.image}) center/cover` : GRADIENTS[index % GRADIENTS.length] }}
                  >
                    <div className="book-card__spine"></div>
                    <div className="fav-book-card__heart">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                  </div>
                  <div className="fav-book-card__info">
                    <h3>{book.title}</h3>
                    <p>{book.author?.full_name}</p>
                    <div className="fav-book-card__bottom">
                      <div className="fav-book-card__rating">⭐ {book.rating?.toFixed(1)}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

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
              transition={{ type: 'spring', bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="book-modal__close" onClick={closeModal} aria-label="Yopish">×</button>

              <div className="book-modal__content">
                <div className="book-modal__image-wrapper">
                  <div
                    className="book-modal__cover"
                    style={{ background: selectedBook.image ? `url(${selectedBook.image}) center/cover` : GRADIENTS[0] }}
                  >
                    <div className="book-card__spine"></div>
                  </div>
                </div>

                <div className="book-modal__details">
                  <h2 className="book-modal__title">{selectedBook.title}</h2>
                  <h4 className="book-modal__author">{selectedBook.author?.full_name}</h4>

                  <div className="book-modal__meta">
                    {selectedBook.publisher && (
                      <div className="meta-item">
                        <span className="meta-label">Nashriyot:</span>
                        <span className="meta-value">{selectedBook.publisher.name}</span>
                      </div>
                    )}
                    {selectedBook.published_year && (
                      <div className="meta-item">
                        <span className="meta-label">Nashr yili:</span>
                        <span className="meta-value">{selectedBook.published_year}</span>
                      </div>
                    )}
                    {selectedBook.pages && (
                      <div className="meta-item">
                        <span className="meta-label">Betlar soni:</span>
                        <span className="meta-value">{selectedBook.pages}</span>
                      </div>
                    )}
                    <div className="meta-item">
                      <span className="meta-label">Reyting:</span>
                      <span className="meta-value">⭐ {selectedBook.rating?.toFixed(1)}</span>
                    </div>
                  </div>

                  {selectedBook.description && (
                    <div className="book-modal__desc">
                      <h4>Qisqacha ma'lumot</h4>
                      <p>{selectedBook.description}</p>
                    </div>
                  )}

                  <div className="book-modal__actions">
                    <button
                      className="book-modal__btn danger"
                      onClick={() => handleRemove(selectedBook.favBookId)}
                    >
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
