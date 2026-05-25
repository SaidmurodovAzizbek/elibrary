import React from 'react';
import { motion } from 'framer-motion';

export default function Favorites() {
  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="section-title" style={{ color: 'var(--text-color)' }}>Sevimlilar</h1>
      <p style={{ color: 'var(--text-color)', opacity: 0.8, marginTop: '1rem' }}>Sevimli kitoblaringiz bu yerda ko'rinadi...</p>
    </motion.div>
  );
}
