import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SimpleCarousel from './components/SimpleCarousel';
import Home from './pages/Home';
// import Contact from './pages/Contact';

function App() {
  const shouldShowCarousel = true;
  return (
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
  );
}

export default App;
