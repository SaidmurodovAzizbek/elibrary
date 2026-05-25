import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';

export default function Home() {
  const [selectedBook, setSelectedBook] = useState(null);

  // Mock data for featured books with additional details
  const books = [
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
      id: 2, 
      title: 'Yulduzli tunlar', 
      author: 'Pirimqul Qodirov', 
      cover: 'linear-gradient(135deg, #008080, #004d40)', 
      rating: 4.8,
      publisher: 'Yangi asr avlodi',
      year: 1978,
      pages: 520,
      description: 'Zahiriddin Muhammad Bobur hayoti va uning davlat arbobi, sarkarda hamda shoir sifatidagi murakkab taqdiri haqida tarixiy roman.'
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
      id: 4, 
      title: 'Ikki eshik orasi', 
      author: 'O\'tkir Hoshimov', 
      cover: 'linear-gradient(135deg, #3498db, #2980b9)', 
      rating: 4.9,
      publisher: 'Gafur G\'ulom',
      year: 1986,
      pages: 480,
      description: 'Urush va undan keyingi davr o\'zbek xalqi hayoti, qahramonlarning murakkab taqdiri orqali insoniylik va sadoqat tarannum etiladi.'
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
    },
    { 
      id: 6, 
      title: 'Ufq', 
      author: 'Said Ahmad', 
      cover: 'linear-gradient(135deg, #e74c3c, #c0392b)', 
      rating: 4.8,
      publisher: 'Adabiyot va san\'at',
      year: 1974,
      pages: 650,
      description: 'Ikkinchi jahon urushi davrida front ortidagi o\'zbek xalqining matonati, fidoyiligi qalamga olingan trilogiya.'
    },
  ];

  const closeModal = () => setSelectedBook(null);

  return (
    <motion.div 
      className="page-container home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="books-section">
        <h1 className="section-title">Kitoblar</h1>
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
              <div className="book-card__cover" style={{ background: book.cover }}>
                <div className="book-card__spine"></div>
              </div>
              <div className="book-card__info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <div className="book-card__rating">⭐ {book.rating}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Book Details Modal */}
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
                    <button className="book-modal__btn secondary">Sevimlilarga qo'shish</button>
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
