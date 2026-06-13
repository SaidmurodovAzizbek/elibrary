import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroScene from '../components/landing2/HeroScene';
import CustomCursor from '../components/landing2/CustomCursor';
import TiltCard from '../components/landing2/TiltCard';
import Counter from '../components/landing2/Counter';
import './Landing.css';

/* ─── Animation presets ──────────────────────────────── */
const easeOut = [0.16, 1, 0.3, 1];

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const wordItem = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: easeOut } },
};
const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: easeOut } },
};

/* Split a string into masked, staggered words. */
function AnimatedWords({ text, className = '' }) {
  return (
    <motion.span className={className} variants={wordContainer} initial="hidden" animate="show">
      {text.split(' ').map((word, i) => (
        <span className="l2-word-mask" key={i}>
          <motion.span className="l2-word" variants={wordItem}>{word}&nbsp;</motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ─── Static content ─────────────────────────────────── */
const CATEGORIES = ['Adabiyot', 'Ilm-fan', 'Tarix', 'She\'riyat', 'Bolalar', 'Detektiv', 'Falsafa', 'Biznes', 'San\'at', 'Diniy', 'Fantastika', 'Biografiya'];

const STATS = [
  { to: 12500, suffix: '+', label: 'Kitoblar' },
  { to: 850, suffix: '+', label: 'Mualliflar' },
  { to: 320, suffix: '+', label: 'Nashriyotlar' },
  { to: 45000, suffix: '+', label: "O'quvchilar" },
];

const FEATURES = [
  { icon: '📚', title: 'Boy kolleksiya', text: '12 mingdan ortiq kitob — doimiy yangilanib boruvchi keng katalog.', accent: '#6C63FF' },
  { icon: '✨', title: '3D interaktiv tajriba', text: 'Har bir sahifa jonli animatsiya va 3D effektlar bilan bezatilgan.', accent: '#00D9FF' },
  { icon: '⚡', title: 'Tezkor qidiruv', text: 'Kitob, muallif yoki nashriyotni soniyalar ichida toping.', accent: '#FF6B9D' },
  { icon: '❤️', title: 'Shaxsiy kutubxona', text: 'Sevimli asarlaringizni saqlang va istalgan qurilmadan kiring.', accent: '#00E676' },
];

const STEPS = [
  { n: '01', title: "Ro'yxatdan o'ting", text: 'Telefon raqamingiz orqali bir daqiqada hisob yarating.' },
  { n: '02', title: 'Asar tanlang', text: 'Minglab kitoblar orasidan o\'zingizga mosini toping.' },
  { n: '03', title: "O'qishni boshlang", text: 'Sevimlilarga qo\'shing va istalgan vaqtda o\'qing.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const magnetic = (e) => {
    const b = e.currentTarget;
    const r = b.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    b.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
  };
  const resetMag = (e) => { e.currentTarget.style.transform = 'translate(0, 0)'; };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="l2-page">
      <CustomCursor />

      {/* Scroll progress bar */}
      <motion.div className="l2-progress" style={{ scaleX: progressScale }} />

      {/* Backgrounds */}
      <div className="l2-bg-mesh" />
      <div className="l2-bg-grain" />

      {/* ─── Nav ─────────────────────────────────────── */}
      <motion.nav
        className="l2-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div className="l2-nav__logo" onClick={() => scrollTo('l2-top')}>
          <span className="l2-logo-mark">e</span>Library
        </div>
        <div className="l2-nav__links">
          <Link to="/home">Kolleksiya</Link>
          <Link to="/authors">Mualliflar</Link>
          <Link to="/publishers">Nashriyotlar</Link>
        </div>
        <button className="l2-nav__cta" data-cursor onClick={() => navigate('/home')}>
          Kirish
        </button>
      </motion.nav>

      {/* ─── Hero ────────────────────────────────────── */}
      <section className="l2-hero" id="l2-top">
        <HeroScene />
        <div className="l2-hero__veil" />

        <motion.div className="l2-hero__content" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div
            className="l2-badge"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: easeOut }}
          >
            <span className="l2-badge__dot" /> Yangi avlod raqamli kutubxonasi
          </motion.div>

          <h1 className="l2-hero__title">
            <AnimatedWords text="Kitoblar olami" />
            <span className="l2-hero__title-grad">
              <AnimatedWords text="endi bir joyda" />
            </span>
          </h1>

          <motion.p
            className="l2-hero__subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.9 }}
          >
            Minglab asarlar, taniqli mualliflar va nashriyotlar — immersiv 3D tajriba
            bilan boyitilgan zamonaviy raqamli platformada.
          </motion.p>

          <motion.div
            className="l2-hero__actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: easeOut }}
          >
            <button
              className="l2-btn l2-btn--primary"
              data-cursor
              onMouseMove={magnetic}
              onMouseLeave={resetMag}
              onClick={() => navigate('/home')}
            >
              Kolleksiyani ochish
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              className="l2-btn l2-btn--ghost"
              data-cursor
              onMouseMove={magnetic}
              onMouseLeave={resetMag}
              onClick={() => scrollTo('l2-how')}
            >
              Qanday ishlaydi
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="l2-scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <span>Pastga suring</span>
          <div className="l2-scroll-cue__line"><div className="l2-scroll-cue__dot" /></div>
        </motion.div>
      </section>

      {/* ─── Marquee ─────────────────────────────────── */}
      <div className="l2-marquee">
        <div className="l2-marquee__track">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span className="l2-marquee__item" key={i}>
              {c} <span className="l2-marquee__star">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── Stats ───────────────────────────────────── */}
      <section className="l2-stats">
        {STATS.map((s, i) => (
          <motion.div
            className="l2-stat"
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="l2-stat__num"><Counter to={s.to} suffix={s.suffix} /></div>
            <div className="l2-stat__label">{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* ─── Features ────────────────────────────────── */}
      <section className="l2-section" id="l2-features">
        <motion.div
          className="l2-section__head"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          <span className="l2-eyebrow">Imkoniyatlar</span>
          <h2 className="l2-section__title">Nega aynan <span className="l2-grad-text">eLibrary</span>?</h2>
          <p className="l2-section__sub">Sizning o'qish tajribangizni yangi bosqichga olib chiqadigan xususiyatlar.</p>
        </motion.div>

        <div className="l2-features">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08 }}
            >
              <TiltCard className="l2-feature">
                <div className="l2-feature__icon" style={{ '--accent': f.accent }}>{f.icon}</div>
                <h3 className="l2-feature__title">{f.title}</h3>
                <p className="l2-feature__text">{f.text}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── How it works ────────────────────────────── */}
      <section className="l2-section l2-how" id="l2-how">
        <motion.div
          className="l2-section__head"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          <span className="l2-eyebrow">Boshlash oson</span>
          <h2 className="l2-section__title">Uch oddiy <span className="l2-grad-text">qadam</span></h2>
        </motion.div>

        <div className="l2-steps">
          {STEPS.map((s, i) => (
            <motion.div
              className="l2-step"
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="l2-step__num">{s.n}</div>
              <h3 className="l2-step__title">{s.title}</h3>
              <p className="l2-step__text">{s.text}</p>
              {i < STEPS.length - 1 && <div className="l2-step__connector" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────── */}
      <section className="l2-cta">
        <div className="l2-cta__glow" />
        <motion.div
          className="l2-cta__inner"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="l2-cta__title">Bilim olamiga<br /><span className="l2-grad-text">sayohatni boshlang</span></h2>
          <p className="l2-cta__sub">Bepul ro'yxatdan o'ting va minglab kitoblardan bahramand bo'ling.</p>
          <button
            className="l2-btn l2-btn--primary l2-btn--lg"
            data-cursor
            onMouseMove={magnetic}
            onMouseLeave={resetMag}
            onClick={() => navigate('/home')}
          >
            Hoziroq boshlash
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </motion.div>
      </section>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="l2-footer">
        <div className="l2-footer__top">
          <div className="l2-footer__brand">
            <div className="l2-nav__logo"><span className="l2-logo-mark">e</span>Library</div>
            <p>Zamonaviy raqamli kutubxona platformasi.</p>
          </div>
          <div className="l2-footer__col">
            <h4>Sahifalar</h4>
            <Link to="/home">Kitoblar</Link>
            <Link to="/authors">Mualliflar</Link>
            <Link to="/publishers">Nashriyotlar</Link>
          </div>
          <div className="l2-footer__col">
            <h4>Hisob</h4>
            <Link to="/favorites">Sevimlilar</Link>
            <Link to="/cart">Savat</Link>
          </div>
        </div>
        <div className="l2-footer__bottom">
          <p>© 2026 eLibrary — Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}
