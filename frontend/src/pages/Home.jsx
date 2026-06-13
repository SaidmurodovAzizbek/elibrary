import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import api from '../api';
import './Home.css';

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

export default function Home() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const addToCart = useStore((state) => state.addToCart);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const favorites = useStore((state) => state.favorites);
  const addFavorite = useStore((state) => state.addFavorite);
  const removeFavorite = useStore((state) => state.removeFavorite);

  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (search) params.search = search;
    api.get('/books/', { params })
      .then((res) => setBooks(res.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [search]);

  const closeModal = () => setSelectedBook(null);

  const isFavorited = (bookId) => favorites.some((f) => f.book_id === bookId);

  const toggleFavorite = async (book) => {
    if (!isLoggedIn) return;
    if (isFavorited(book.id)) {
      await removeFavorite(book.id);
    } else {
      await addFavorite(book.id);
    }
  };

  return (
    <motion.div
      className="page-container home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="books-section">
        <div className="page-head">
          <span className="page-eyebrow">eLibrary kolleksiyasi</span>
          {search ? (
            <h1 className="section-title">"{search}" — <span className="grad-text">natijalar</span></h1>
          ) : (
            <h1 className="section-title">Barcha <span className="grad-text">kitoblar</span></h1>
          )}
          <p className="page-sub">Minglab asarlar orasidan o'zingizga yoqqanini tanlang va kashf eting.</p>
        </div>

        {loading ? (
          <div className="loading-state">Yuklanmoqda...</div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <h2>Kitoblar topilmadi</h2>
            <p>Hozircha kutubxonada kitoblar mavjud emas. Admin sifatida kirip kitob qo'shing.</p>
          </div>
        ) : (
          <div className="book-grid">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                className="book-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBook(book)}
              >
                <div
                  className="book-card__cover"
                  style={{ background: book.image ? `url(${book.image})` : GRADIENTS[index % GRADIENTS.length] }}
                >
                  <div className="book-card__spine"></div>
                </div>
                <div className="book-card__info">
                  <h3>{book.title}</h3>
                  <p>{book.author?.full_name}</p>
                  <div className="book-card__rating">⭐ {book.rating?.toFixed(1)}</div>
                </div>
              </motion.div>
            ))}
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
                    style={{
                      background: selectedBook.image
                        ? `url(${selectedBook.image})`
                        : GRADIENTS[books.indexOf(selectedBook) % GRADIENTS.length],
                    }}
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
                    {selectedBook.price > 0 && (
                      <div className="meta-item">
                        <span className="meta-label">Narx:</span>
                        <span className="meta-value">{selectedBook.price?.toLocaleString()} so'm</span>
                      </div>
                    )}
                  </div>

                  {selectedBook.description && (
                    <div className="book-modal__desc">
                      <h4>Qisqacha ma'lumot</h4>
                      <p>{selectedBook.description}</p>
                    </div>
                  )}

                  <div className="book-modal__actions">
                    <button
                      className="book-modal__btn primary"
                      onClick={() => { addToCart(selectedBook); closeModal(); }}
                    >
                      Buyurtma qilish
                    </button>
                    {isLoggedIn && (
                      <button
                        className={`book-modal__btn ${isFavorited(selectedBook.id) ? 'danger' : 'secondary'}`}
                        onClick={() => toggleFavorite(selectedBook)}
                      >
                        {isFavorited(selectedBook.id) ? 'Sevimlilardan olib tashlash' : "Sevimlilarga qo'shish"}
                      </button>
                    )}
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
