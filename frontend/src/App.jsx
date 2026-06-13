import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Landing from './pages/Landing';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Authors from './pages/Authors';
import Publishers from './pages/Publishers';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';

gsap.registerPlugin(ScrollTrigger);

function App() {
  /* Initialize Lenis smooth scrolling and sync with GSAP ScrollTrigger */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
