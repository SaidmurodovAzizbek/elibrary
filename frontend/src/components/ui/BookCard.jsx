import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { generateStars, truncateText } from '../../utils/constants';
import GlassCard from './GlassCard';
import './BookCard.css';

/**
 * 3D-tilt book card with hover effects
 * Shows book cover, title, author, rating, and category
 */
export default function BookCard({ book, index = 0, onClick }) {
  const { title, author, category, rating, reviews, cover, description } = book;
  const stars = generateStars(rating);

  return (
    <motion.div
      className="book-card-wrapper"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <GlassCard className="book-card" glowColor="var(--clr-primary)" onClick={onClick}>
        {/* Book Cover */}
        <div className="book-card__cover-wrapper">
          <div className="book-card__cover">
            <img src={cover} alt={title} loading="lazy" />
            <div className="book-card__cover-overlay">
              <span className="book-card__read-btn">📖 O'qish</span>
            </div>
          </div>
          
          {/* Category badge */}
          <span className="book-card__category">{category}</span>
        </div>

        {/* Book Info */}
        <div className="book-card__info">
          <h3 className="book-card__title">{title}</h3>
          <p className="book-card__author">{author}</p>
          
          {/* Rating */}
          <div className="book-card__rating">
            <div className="book-card__stars">
              {Array.from({ length: stars.full }, (_, i) => (
                <span key={`full-${i}`} className="star star--full">★</span>
              ))}
              {stars.half > 0 && <span className="star star--half">★</span>}
              {Array.from({ length: stars.empty }, (_, i) => (
                <span key={`empty-${i}`} className="star star--empty">★</span>
              ))}
            </div>
            <span className="book-card__rating-text">
              {rating} ({reviews?.toLocaleString()})
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="book-card__desc">
              {truncateText(description, 80)}
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
