import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// Ilova ochilishidan oldin mavzuni o'rnatamiz (standart — dark)
document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('theme') || 'dark',
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
