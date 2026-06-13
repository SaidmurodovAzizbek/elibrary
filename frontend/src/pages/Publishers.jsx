import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  useEffect(() => {
    api.get('/publishers/', { params: { limit: 100 } })
      .then((res) => setPublishers(res.data))
      .catch(() => setPublishers([]))
      .finally(() => setLoading(false));
  }, []);

  const closeModal = () => setSelectedPublisher(null);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="publishers-section">
        <h1 className="section-title">Nashriyotlar</h1>

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
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
