import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import './Authors.css';

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

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  useEffect(() => {
    api.get('/authors/', { params: { limit: 100 } })
      .then((res) => setAuthors(res.data))
      .catch(() => setAuthors([]))
      .finally(() => setLoading(false));
  }, []);

  const openAuthor = async (author) => {
    setSelectedAuthor(author);
    setAuthorBooks([]);
    setBooksLoading(true);
    try {
      const res = await api.get('/books/', { params: { author_id: author.id, limit: 20 } });
      setAuthorBooks(res.data);
    } catch {
      setAuthorBooks([]);
    } finally {
      setBooksLoading(false);
    }
  };

  const closeModal = () => { setSelectedAuthor(null); setAuthorBooks([]); };

  const yearsLabel = (author) => {
    if (author.birth_year && author.death_year) return `${author.birth_year} — ${author.death_year}`;
    if (author.birth_year) return `${author.birth_year} — hozir`;
    return '';
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="authors-section">
        <div className="page-head">
          <span className="page-eyebrow">Ijodkorlar</span>
          <h1 className="section-title">Taniqli <span className="grad-text">mualliflar</span></h1>
          <p className="page-sub">O'zbek va jahon adabiyotining yetuk ijodkorlari hamda ularning asarlari.</p>
        </div>

        {loading ? (
          <div className="loading-state">Yuklanmoqda...</div>
        ) : authors.length === 0 ? (
          <div className="empty-state">
            <h2>Mualliflar topilmadi</h2>
            <p>Hozircha mualliflar mavjud emas. Admin sifatida kirib muallif qo'shing.</p>
          </div>
        ) : (
          <div className="author-grid">
            {authors.map((author, index) => (
              <motion.div
                key={author.id}
                className="author-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => openAuthor(author)}
              >
                <div
                  className="author-card__image"
                  style={{ background: author.image ? `url(${author.image}) center/cover` : GRADIENTS[index % GRADIENTS.length] }}
                >
                  <div className="author-card__overlay"></div>
                </div>
                <div className="author-card__info">
                  <h3>{author.full_name}</h3>
                  <p>{yearsLabel(author)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedAuthor && (
          <motion.div
            className="author-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="author-modal"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="author-modal__close" onClick={closeModal} aria-label="Yopish">×</button>

              <div className="author-modal__header">
                <div
                  className="author-modal__portrait"
                  style={{
                    background: selectedAuthor.image
                      ? `url(${selectedAuthor.image}) center/cover`
                      : GRADIENTS[authors.indexOf(selectedAuthor) % GRADIENTS.length],
                  }}
                ></div>
                <div className="author-modal__meta">
                  <h2 className="author-modal__name">{selectedAuthor.full_name}</h2>
                  {yearsLabel(selectedAuthor) && (
                    <span className="author-modal__years">{yearsLabel(selectedAuthor)}</span>
                  )}
                  {selectedAuthor.description && (
                    <p className="author-modal__bio">{selectedAuthor.description}</p>
                  )}
                </div>
              </div>

              {(booksLoading || authorBooks.length > 0) && (
                <div className="author-modal__books-section">
                  <h3>Muallifning kitoblari</h3>
                  {booksLoading ? (
                    <p style={{ color: 'var(--text-secondary)', padding: '1rem 0' }}>Yuklanmoqda...</p>
                  ) : (
                    <div className="author-books-scroll">
                      {authorBooks.map((book, i) => (
                        <div key={book.id} className="author-book-item">
                          <div
                            className="author-book-cover"
                            style={{ background: book.image ? `url(${book.image}) center/cover` : GRADIENTS[i % GRADIENTS.length] }}
                          >
                            <div className="book-card__spine"></div>
                          </div>
                          <h4 className="author-book-title">{book.title}</h4>
                          {book.published_year && (
                            <span className="author-book-year">{book.published_year}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
