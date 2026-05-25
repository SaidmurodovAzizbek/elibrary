import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Publishers.css';

export default function Publishers() {
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  const publishers = [
    {
      id: 1,
      name: "Sharq nashriyoti",
      established: 'Tashkil etilgan yili: 1924',
      logo: 'linear-gradient(135deg, #1abc9c, #16a085)',
      description: "O'zbekistondagi eng yirik va qadimiy nashriyotlardan biri. O'quv adabiyotlari, badiiy asarlar, ijtimoiy-siyosiy va ilmiy kitoblar chop etishga ixtisoslashgan yirik matbaa uyi.",
      books: [
        { id: 101, title: "O'tkan kunlar", cover: 'linear-gradient(135deg, #8a2be2, #4a00e0)', year: 2021 },
        { id: 102, title: "Chol va dengiz", cover: 'linear-gradient(135deg, #2980b9, #2c3e50)', year: 2019 },
        { id: 103, title: "Asrga tatigulik kun", cover: 'linear-gradient(135deg, #e74c3c, #c0392b)', year: 2020 }
      ]
    },
    {
      id: 2,
      name: "Yangi asr avlodi",
      established: 'Tashkil etilgan yili: 2001',
      logo: 'linear-gradient(135deg, #f39c12, #d35400)',
      description: "Asosan yoshlar, o'smirlar va bolalar uchun badiiy adabiyotlar, jahon adabiyoti durdonalarini o'zbek tilida sifatli tarjima qilib nashr etuvchi zamonaviy nashriyot.",
      books: [
        { id: 201, title: "Yulduzli tunlar", cover: 'linear-gradient(135deg, #008080, #004d40)', year: 2020 },
        { id: 202, title: "Garri Potter", cover: 'linear-gradient(135deg, #8e44ad, #2c3e50)', year: 2022 },
        { id: 203, title: "G'urur va andisha", cover: 'linear-gradient(135deg, #c0392b, #8e44ad)', year: 2018 }
      ]
    },
    {
      id: 3,
      name: "G'afur G'ulom",
      established: 'Tashkil etilgan yili: 1957',
      logo: 'linear-gradient(135deg, #3498db, #2980b9)',
      description: "Badiiy adabiyot va san'at sohasi bo'yicha yetakchi nashriyot-matbaa ijodiy uyi. Klassik va zamonaviy o'zbek adabiyoti asarlarini muntazam chop etib keladi.",
      books: [
        { id: 301, title: "Ikki eshik orasi", cover: 'linear-gradient(135deg, #3498db, #2980b9)', year: 2015 },
        { id: 302, title: "Alisher Navoiy xamsasi", cover: 'linear-gradient(135deg, #27ae60, #2ecc71)', year: 2010 },
        { id: 303, title: "Boburnoma", cover: 'linear-gradient(135deg, #f1c40f, #e67e22)', year: 2017 }
      ]
    },
    {
      id: 4,
      name: "Hilol nashr",
      established: 'Tashkil etilgan yili: 2011',
      logo: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      description: "Diniy-ma'rifiy, axloqiy va tarixiy kitoblarni nashr qilishga yo'naltirilgan yetakchi matbaa uyi. Shayx Muhammad Sodiq Muhammad Yusuf asarlari asosiy nashrlardan sanaladi.",
      books: [
        { id: 401, title: "Tafsiri Hilol", cover: 'linear-gradient(135deg, #f1c40f, #e67e22)', year: 2018 },
        { id: 402, title: "Hadis va Hayot", cover: 'linear-gradient(135deg, #2ecc71, #27ae60)', year: 2019 },
        { id: 403, title: "Ruhiy tarbiya", cover: 'linear-gradient(135deg, #e74c3c, #c0392b)', year: 2020 },
        { id: 404, title: "Iymon", cover: 'linear-gradient(135deg, #34495e, #2c3e50)', year: 2021 }
      ]
    }
  ];

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
              <div className="publisher-card__logo" style={{ background: publisher.logo }}>
                {/* Fallback pattern */}
                <div className="publisher-card__overlay">
                   <span>{publisher.name.charAt(0)}</span>
                </div>
              </div>
              <div className="publisher-card__info">
                <h3>{publisher.name}</h3>
                <p>{publisher.established}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Publisher Details Modal */}
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
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="publisher-modal__close" onClick={closeModal} aria-label="Yopish">×</button>
              
              <div className="publisher-modal__header">
                <div className="publisher-modal__logo-large" style={{ background: selectedPublisher.logo }}>
                   <span>{selectedPublisher.name.charAt(0)}</span>
                </div>
                <div className="publisher-modal__meta">
                  <h2 className="publisher-modal__name">{selectedPublisher.name}</h2>
                  <span className="publisher-modal__established">{selectedPublisher.established}</span>
                  <p className="publisher-modal__desc">{selectedPublisher.description}</p>
                </div>
              </div>
              
              <div className="publisher-modal__books-section">
                <h3>Nashriyot kitoblari</h3>
                <div className="publisher-books-scroll">
                  {selectedPublisher.books.map((book) => (
                    <div key={book.id} className="publisher-book-item">
                      <div className="publisher-book-cover" style={{ background: book.cover }}>
                         <div className="book-card__spine"></div>
                      </div>
                      <h4 className="publisher-book-title">{book.title}</h4>
                      <span className="publisher-book-year">{book.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
