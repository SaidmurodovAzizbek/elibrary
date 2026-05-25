import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Authors.css';

export default function Authors() {
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const authors = [
    {
      id: 1,
      name: 'Abdulla Qodiriy',
      years: '1894 - 1938',
      image: 'linear-gradient(135deg, #8a2be2, #4a00e0)',
      bio: "Abdulla Qodiriy (Julqunboy) - o'zbek milliy romanchiligining asoschisi, buyuk yozuvchi. U o'zbek adabiyotida yangi sahifa ochib, xalqimizning o'tmishi va ijtimoiy hayotini o'z asarlarida mahorat bilan yoritib bergan.",
      books: [
        { id: 101, title: "O'tkan kunlar", cover: 'linear-gradient(135deg, #8a2be2, #4a00e0)', year: 1926 },
        { id: 102, title: "Mehrobdan chayon", cover: 'linear-gradient(135deg, #ff7f50, #ff4500)', year: 1929 },
        { id: 103, title: "Obid ketmon", cover: 'linear-gradient(135deg, #008080, #004d40)', year: 1934 }
      ]
    },
    {
      id: 2,
      name: 'Pirimqul Qodirov',
      years: '1928 - 2010',
      image: 'linear-gradient(135deg, #008080, #004d40)',
      bio: "O'zbekiston xalq yozuvchisi, yirik tarixiy romanlar muallifi. Uning asarlari o'quvchini Boburiylar davlati davriga yetaklaydi hamda o'sha davrdagi hayotni o'z ko'zingiz bilan ko'rgandek his qilasiz.",
      books: [
        { id: 201, title: "Yulduzli tunlar", cover: 'linear-gradient(135deg, #008080, #004d40)', year: 1978 },
        { id: 202, title: "Avlodlar dovoni", cover: 'linear-gradient(135deg, #3498db, #2980b9)', year: 1988 },
        { id: 203, title: "Humoyun va Akbar", cover: 'linear-gradient(135deg, #e74c3c, #c0392b)', year: 1994 }
      ]
    },
    {
      id: 3,
      name: "O'tkir Hoshimov",
      years: '1941 - 2013',
      image: 'linear-gradient(135deg, #3498db, #2980b9)',
      bio: "Taniqli o'zbek adibi, publitsist va jamoat arbobi. Asarlarida o'zbek xalqining sodda va samimiy qalbi, urush davrining qiyinchiliklari va insoniy fojialar aks etgan.",
      books: [
        { id: 301, title: "Ikki eshik orasi", cover: 'linear-gradient(135deg, #3498db, #2980b9)', year: 1986 },
        { id: 302, title: "Dunyoning ishlari", cover: 'linear-gradient(135deg, #f1c40f, #f39c12)', year: 1982 },
        { id: 303, title: "Tushda kechgan umrlar", cover: 'linear-gradient(135deg, #e74c3c, #c0392b)', year: 1992 },
        { id: 304, title: "Nur borki, soya bor", cover: 'linear-gradient(135deg, #9b59b6, #8e44ad)', year: 1976 }
      ]
    },
    {
      id: 4,
      name: 'Tohir Malik',
      years: '1946 - 2019',
      image: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      bio: "O'zbek fantastika va detektiv adabiyotining yorqin vakili. Uning asarlarida doimo yovuzlik va ezgulik o'rtasidagi kurash f falsafasi ilgari suriladi.",
      books: [
        { id: 401, title: "Shaytanat", cover: 'linear-gradient(135deg, #e74c3c, #c0392b)', year: 1992 },
        { id: 402, title: "Alvido, bolalik", cover: 'linear-gradient(135deg, #ff7f50, #ff4500)', year: 1989 },
        { id: 403, title: "So'nggi o'q", cover: 'linear-gradient(135deg, #34495e, #2c3e50)', year: 1990 }
      ]
    }
  ];

  const closeModal = () => setSelectedAuthor(null);

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="authors-section">
        <h1 className="section-title">Mualliflar</h1>
        <div className="author-grid">
          {authors.map((author, index) => (
            <motion.div 
              key={author.id} 
              className="author-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAuthor(author)}
            >
              <div className="author-card__image" style={{ background: author.image }}>
                {/* Fallback pattern to make it look like a placeholder portrait */}
                <div className="author-card__overlay"></div>
              </div>
              <div className="author-card__info">
                <h3>{author.name}</h3>
                <p>{author.years}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Author Details Modal */}
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
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="author-modal__close" onClick={closeModal} aria-label="Yopish">×</button>
              
              <div className="author-modal__header">
                <div className="author-modal__portrait" style={{ background: selectedAuthor.image }}></div>
                <div className="author-modal__meta">
                  <h2 className="author-modal__name">{selectedAuthor.name}</h2>
                  <span className="author-modal__years">{selectedAuthor.years}</span>
                  <p className="author-modal__bio">{selectedAuthor.bio}</p>
                </div>
              </div>
              
              <div className="author-modal__books-section">
                <h3>Muallifning kitoblari</h3>
                <div className="author-books-scroll">
                  {selectedAuthor.books.map((book) => (
                    <div key={book.id} className="author-book-item">
                      <div className="author-book-cover" style={{ background: book.cover }}>
                         <div className="book-card__spine"></div>
                      </div>
                      <h4 className="author-book-title">{book.title}</h4>
                      <span className="author-book-year">{book.year}</span>
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
