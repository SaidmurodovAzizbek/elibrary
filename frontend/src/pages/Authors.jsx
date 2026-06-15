import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
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

const EMPTY_FORM = { full_name: '', birth_year: '', death_year: '', description: '', image: '' };

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  const role = useStore((state) => state.role);
  const isAdmin = role === 'admin';
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    api.get('/authors/', { params: { limit: 100 } })
      .then((res) => setAuthors(res.data))
      .catch(() => setAuthors([]))
      .finally(() => setLoading(false));
  }, []);

  // ─── Admin CRUD (mock / local) ──────────────────────────
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormOpen(true); };

  const openEdit = (author, e) => {
    e?.stopPropagation();
    setEditing(author);
    setForm({
      full_name: author.full_name || '',
      birth_year: author.birth_year ?? '',
      death_year: author.death_year ?? '',
      description: author.description || '',
      image: author.image || '',
    });
    setFormOpen(true);
  };

  const handleDelete = (author, e) => {
    e?.stopPropagation();
    if (!window.confirm(`"${author.full_name}" muallifini o'chirmoqchimisiz?`)) return;
    setAuthors((prev) => prev.filter((a) => a.id !== author.id));
    if (selectedAuthor?.id === author.id) closeModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      full_name: form.full_name.trim(),
      birth_year: form.birth_year ? Number(form.birth_year) : null,
      death_year: form.death_year ? Number(form.death_year) : null,
      description: form.description.trim() || null,
      image: form.image.trim() || null,
    };
    if (editing) {
      setAuthors((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...payload } : a)));
    } else {
      setAuthors((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    }
    setFormOpen(false);
  };

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

        {isAdmin && (
          <div className="admin-bar">
            <button className="admin-add-btn" onClick={openCreate}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Yangi muallif qo'shish
            </button>
          </div>
        )}

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
                {isAdmin && (
                  <div className="admin-card-actions">
                    <button className="admin-icon-btn edit" title="Tahrirlash" onClick={(e) => openEdit(author, e)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button className="admin-icon-btn del" title="O'chirish" onClick={(e) => handleDelete(author, e)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                )}
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
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.4rem' }}>
                      <button className="book-modal__btn primary" onClick={() => { const a = selectedAuthor; closeModal(); openEdit(a); }}>Tahrirlash</button>
                      <button className="book-modal__btn danger" onClick={(e) => handleDelete(selectedAuthor, e)}>O'chirish</button>
                    </div>
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

      {/* ─── Admin author form ─────────────────────────── */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            className="admin-form-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFormOpen(false)}
          >
            <motion.div
              className="admin-form"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="admin-form__close" onClick={() => setFormOpen(false)} aria-label="Yopish">×</button>
              <h2 className="admin-form__title">{editing ? 'Muallifni tahrirlash' : 'Yangi muallif'}</h2>

              <form className="admin-form__grid" onSubmit={handleSubmit}>
                <div className="admin-field">
                  <label>To'liq ism *</label>
                  <input value={form.full_name} onChange={(e) => setField('full_name', e.target.value)} required placeholder="Masalan: Abdulla Qodiriy" />
                </div>

                <div className="admin-field--row">
                  <div className="admin-field">
                    <label>Tug'ilgan yili</label>
                    <input type="number" value={form.birth_year} onChange={(e) => setField('birth_year', e.target.value)} placeholder="1894" />
                  </div>
                  <div className="admin-field">
                    <label>Vafot etgan yili</label>
                    <input type="number" value={form.death_year} onChange={(e) => setField('death_year', e.target.value)} placeholder="1938" />
                  </div>
                </div>

                <div className="admin-field">
                  <label>Rasm havolasi (URL)</label>
                  <input value={form.image} onChange={(e) => setField('image', e.target.value)} placeholder="https://..." />
                </div>

                <div className="admin-field">
                  <label>Tavsif (biografiya)</label>
                  <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Muallif haqida..." />
                </div>

                <div className="admin-form__actions">
                  <button type="button" className="admin-btn ghost" onClick={() => setFormOpen(false)}>Bekor qilish</button>
                  <button type="submit" className="admin-btn primary">{editing ? 'Saqlash' : "Qo'shish"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
