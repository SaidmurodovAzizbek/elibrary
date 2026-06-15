import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import api from '../api';
import './Publishers.css';

const GRADIENTS = [
  'linear-gradient(135deg, #1abc9c, #16a085)',
  'linear-gradient(135deg, #f39c12, #d35400)',
  'linear-gradient(135deg, #3498db, #2980b9)',
  'linear-gradient(135deg, #9b59b6, #8e44ad)',
  'linear-gradient(135deg, #e74c3c, #c0392b)',
  'linear-gradient(135deg, #8a2be2, #4a00e0)',
  'linear-gradient(135deg, #008080, #004d40)',
  'linear-gradient(135deg, #ff7f50, #ff4500)',
];

const EMPTY_FORM = { name: '', founded_year: '', description: '', image: '' };

export default function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  const role = useStore((state) => state.role);
  const isAdmin = role === 'admin';
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    api.get('/publishers/', { params: { limit: 100 } })
      .then((res) => setPublishers(res.data))
      .catch(() => setPublishers([]))
      .finally(() => setLoading(false));
  }, []);

  const closeModal = () => setSelectedPublisher(null);

  // ─── Admin CRUD (mock / local) ──────────────────────────
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormOpen(true); };

  const openEdit = (publisher, e) => {
    e?.stopPropagation();
    setEditing(publisher);
    setForm({
      name: publisher.name || '',
      founded_year: publisher.founded_year ?? '',
      description: publisher.description || '',
      image: publisher.image || '',
    });
    setFormOpen(true);
  };

  const handleDelete = async (publisher, e) => {
    e?.stopPropagation();
    if (!window.confirm(`"${publisher.name}" nashriyotini o'chirmoqchimisiz?`)) return;
    try {
      await api.delete(`/publishers/${publisher.id}`);
      setPublishers((prev) => prev.filter((p) => p.id !== publisher.id));
      if (selectedPublisher?.id === publisher.id) closeModal();
    } catch (err) {
      const status = err.response?.status;
      alert(status === 401 || status === 403
        ? 'Bu amal uchun admin huquqi kerak'
        : "Nashriyotni o'chirishda xatolik yuz berdi");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      founded_year: form.founded_year ? Number(form.founded_year) : null,
      description: form.description.trim() || null,
      image: form.image.trim() || null,
    };
    try {
      if (editing) {
        const res = await api.put(`/publishers/${editing.id}`, payload);
        setPublishers((prev) => prev.map((p) => (p.id === editing.id ? res.data : p)));
      } else {
        const res = await api.post('/publishers/', payload);
        setPublishers((prev) => [res.data, ...prev]);
      }
      setFormOpen(false);
    } catch (err) {
      const status = err.response?.status;
      alert(status === 401 || status === 403
        ? 'Bu amal uchun admin huquqi kerak'
        : (err.response?.data?.detail || 'Saqlashda xatolik yuz berdi'));
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="publishers-section">
        <div className="page-head">
          <span className="page-eyebrow">Hamkorlar</span>
          <h1 className="section-title">Yetakchi <span className="grad-text">nashriyotlar</span></h1>
          <p className="page-sub">Kitoblarni hayotga olib keluvchi nufuzli nashriyot uylari.</p>
        </div>

        {isAdmin && (
          <div className="admin-bar">
            <button className="admin-add-btn" onClick={openCreate}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Yangi nashriyot qo'shish
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">Yuklanmoqda...</div>
        ) : publishers.length === 0 ? (
          <div className="empty-state">
            <h2>Nashriyotlar topilmadi</h2>
            <p>Hozircha nashriyotlar mavjud emas. Admin sifatida kirib nashriyot qo'shing.</p>
          </div>
        ) : (
          <div className="publisher-grid">
            {publishers.map((publisher, index) => (
              <motion.div
                key={publisher.id}
                className="publisher-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPublisher(publisher)}
              >
                {isAdmin && (
                  <div className="admin-card-actions">
                    <button className="admin-icon-btn edit" title="Tahrirlash" onClick={(e) => openEdit(publisher, e)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button className="admin-icon-btn del" title="O'chirish" onClick={(e) => handleDelete(publisher, e)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                )}
                <div
                  className="publisher-card__logo"
                  style={{ background: publisher.image ? `url(${publisher.image}) center/cover` : GRADIENTS[index % GRADIENTS.length] }}
                >
                  <div className="publisher-card__overlay">
                    {!publisher.image && <span>{publisher.name.charAt(0)}</span>}
                  </div>
                </div>
                <div className="publisher-card__info">
                  <h3>{publisher.name}</h3>
                  {publisher.founded_year && (
                    <p>Tashkil etilgan yili: {publisher.founded_year}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedPublisher && (
          <motion.div
            className="publisher-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="publisher-modal"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="publisher-modal__close" onClick={closeModal} aria-label="Yopish">×</button>

              <div className="publisher-modal__header">
                <div
                  className="publisher-modal__logo-large"
                  style={{
                    background: selectedPublisher.image
                      ? `url(${selectedPublisher.image}) center/cover`
                      : GRADIENTS[publishers.indexOf(selectedPublisher) % GRADIENTS.length],
                  }}
                >
                  {!selectedPublisher.image && <span>{selectedPublisher.name.charAt(0)}</span>}
                </div>
                <div className="publisher-modal__meta">
                  <h2 className="publisher-modal__name">{selectedPublisher.name}</h2>
                  {selectedPublisher.founded_year && (
                    <span className="publisher-modal__established">
                      Tashkil etilgan yili: {selectedPublisher.founded_year}
                    </span>
                  )}
                  {selectedPublisher.description && (
                    <p className="publisher-modal__desc">{selectedPublisher.description}</p>
                  )}
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.4rem' }}>
                      <button className="book-modal__btn primary" onClick={() => { const p = selectedPublisher; closeModal(); openEdit(p); }}>Tahrirlash</button>
                      <button className="book-modal__btn danger" onClick={(e) => handleDelete(selectedPublisher, e)}>O'chirish</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Admin publisher form ──────────────────────── */}
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
              <h2 className="admin-form__title">{editing ? 'Nashriyotni tahrirlash' : 'Yangi nashriyot'}</h2>

              <form className="admin-form__grid" onSubmit={handleSubmit}>
                <div className="admin-field">
                  <label>Nomi *</label>
                  <input value={form.name} onChange={(e) => setField('name', e.target.value)} required placeholder="Masalan: Sharq nashriyoti" />
                </div>

                <div className="admin-field">
                  <label>Tashkil etilgan yili</label>
                  <input type="number" value={form.founded_year} onChange={(e) => setField('founded_year', e.target.value)} placeholder="1924" />
                </div>

                <div className="admin-field">
                  <label>Rasm / logo havolasi (URL)</label>
                  <input value={form.image} onChange={(e) => setField('image', e.target.value)} placeholder="https://..." />
                </div>

                <div className="admin-field">
                  <label>Tavsif</label>
                  <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Nashriyot haqida..." />
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
