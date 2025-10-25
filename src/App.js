import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SimpleCarousel from './components/SimpleCarousel';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
// import Contact from './pages/Contact';

function App() {
  const shouldShowCarousel = true;
  
  // Fix iOS viewport height issue
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  return (
    <ErrorBoundary>
      <div>
        <div className="top-logo">
          <div className="logo-wrap">
            <img src="/logo.png" alt="Logo" />
            <div className="brand-text">
              <div className="brand-title">mydiamond99 support</div>
              <div className="brand-sub">Fast help on WhatsApp, Email & FAQs</div>
            </div>
          </div>
        </div>
        {shouldShowCarousel && <SimpleCarousel />}
        <Routes>
          <Route path="/" element={<Home />} />
          { /* Contact route removed */ }
        </Routes>
        <footer style={{ marginTop: 32, padding: 16, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          © {new Date().getFullYear()} Customer Support
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
