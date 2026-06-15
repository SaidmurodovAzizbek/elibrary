import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import './AddBookModal.css';

const EMPTY = {
  title: '',
  author_id: '',
  publisher_id: '',
  published_year: '',
  pages: '',
  price: '',
  rating: '',
  image: '',
  description: '',
};

export default function AddBookModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Inline quick-create
  const [newAuthor, setNewAuthor] = useState('');
  const [newPublisher, setNewPublisher] = useState('');
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [showNewPublisher, setShowNewPublisher] = useState(false);

  useEffect(() => {
    api.get('/authors/', { params: { limit: 100 } })
      .then((res) => setAuthors(res.data)).catch(() => setAuthors([]));
    api.get('/publishers/', { params: { limit: 100 } })
      .then((res) => setPublishers(res.data)).catch(() => setPublishers([]));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addAuthor = async () => {
    if (!newAuthor.trim()) return;
    try {
      const res = await api.post('/authors/', { full_name: newAuthor.trim() });
      setAuthors((a) => [...a, res.data]);
      setForm((f) => ({ ...f, author_id: String(res.data.id) }));
      setNewAuthor('');
      setShowNewAuthor(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Muallif qo‘shilmadi');
    }
  };

  const addPublisher = async () => {
    if (!newPublisher.trim()) return;
    try {
      const res = await api.post('/publishers/', { name: newPublisher.trim() });
      setPublishers((p) => [...p, res.data]);
      setForm((f) => ({ ...f, publisher_id: String(res.data.id) }));
      setNewPublisher('');
      setShowNewPublisher(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Nashriyot qo‘shilmadi');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.author_id) {
      setError('Avval muallif tanlang yoki qo‘shing');
      return;
    }
    setSaving(true);
    const num = (v) => (v === '' ? null : Number(v));
    const payload = {
      title: form.title.trim(),
      author_id: Number(form.author_id),
      publisher_id: form.publisher_id ? Number(form.publisher_id) : null,
      published_year: num(form.published_year),
      pages: num(form.pages),
      price: form.price === '' ? 0 : Number(form.price),
      rating: form.rating === '' ? 0 : Number(form.rating),
      image: form.image.trim() || null,
      description: form.description.trim() || null,
    };
    try {
      await api.post('/books/', payload);
      onCreated?.();
      onClose();
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Bu amal uchun admin huquqi kerak');
      } else {
        setError(err.response?.data?.detail || 'Kitob qo‘shilmadi');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="abm-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="abm-modal"
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 30 }}
        transition={{ type: 'spring', bounce: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="abm-close" onClick={onClose} aria-label="Yopish">×</button>
        <h2 className="abm-title">Yangi kitob qo‘shish</h2>

        <form className="abm-form" onSubmit={handleSubmit}>
          <div className="abm-field abm-col-2">
            <label>Kitob nomi *</label>
            <input value={form.title} onChange={set('title')} placeholder="Masalan: O‘tkan kunlar" required />
          </div>

          {/* Author — majburiy */}
          <div className="abm-field">
            <label>Muallif *</label>
            <div className="abm-select-row">
              <select value={form.author_id} onChange={set('author_id')} required>
                <option value="">— tanlang —</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.full_name}</option>
                ))}
              </select>
              <button type="button" className="abm-mini-btn" onClick={() => setShowNewAuthor((s) => !s)}>
                + Yangi
              </button>
            </div>
            {showNewAuthor && (
              <div className="abm-inline-add">
                <input
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Yangi muallif ismi"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAuthor(); } }}
                />
                <button type="button" className="abm-mini-btn solid" onClick={addAuthor}>Qo‘shish</button>
              </div>
            )}
          </div>

          {/* Publisher — ixtiyoriy */}
          <div className="abm-field">
            <label>Nashriyot</label>
            <div className="abm-select-row">
              <select value={form.publisher_id} onChange={set('publisher_id')}>
                <option value="">— ixtiyoriy —</option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button type="button" className="abm-mini-btn" onClick={() => setShowNewPublisher((s) => !s)}>
                + Yangi
              </button>
            </div>
            {showNewPublisher && (
              <div className="abm-inline-add">
                <input
                  value={newPublisher}
                  onChange={(e) => setNewPublisher(e.target.value)}
                  placeholder="Yangi nashriyot nomi"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPublisher(); } }}
                />
                <button type="button" className="abm-mini-btn solid" onClick={addPublisher}>Qo‘shish</button>
              </div>
            )}
          </div>

          <div className="abm-field">
            <label>Nashr yili</label>
            <input type="number" value={form.published_year} onChange={set('published_year')} placeholder="2020" min="1000" max="2100" />
          </div>
          <div className="abm-field">
            <label>Betlar soni</label>
            <input type="number" value={form.pages} onChange={set('pages')} placeholder="320" min="1" />
          </div>
          <div className="abm-field">
            <label>Narx (so‘m)</label>
            <input type="number" value={form.price} onChange={set('price')} placeholder="50000" min="0" />
          </div>
          <div className="abm-field">
            <label>Reyting (0–5)</label>
            <input type="number" value={form.rating} onChange={set('rating')} placeholder="4.5" min="0" max="5" step="0.1" />
          </div>

          <div className="abm-field abm-col-2">
            <label>Muqova rasmi (URL)</label>
            <input value={form.image} onChange={set('image')} placeholder="https://..." />
          </div>

          <div className="abm-field abm-col-2">
            <label>Tavsif</label>
            <textarea value={form.description} onChange={set('description')} rows="3" placeholder="Kitob haqida qisqacha..." />
          </div>

          {error && <p className="abm-error abm-col-2">{error}</p>}

          <div className="abm-actions abm-col-2">
            <button type="button" className="abm-btn ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="abm-btn solid" disabled={saving}>
              {saving ? 'Saqlanmoqda...' : 'Kitob qo‘shish'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
