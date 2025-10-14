import React from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

function Home() {
  const [query, setQuery] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [userIdInput, setUserIdInput] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const faqs = [
    { q: 'Account kaise banaye?', a: 'Signup page par jaakar details fill kijiye.' },
    { q: 'Password reset?', a: 'Forgot Password link par click karke email daaliye.' },
    { q: 'Support se kaise baat karein?', a: 'Contact page form submit kijiye.' },
  ];
  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(query.toLowerCase()));

  function handleWhatsAppClick(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const number = process.env.REACT_APP_WHATSAPP_NUMBER || '447380211716';
    const text = process.env.REACT_APP_WHATSAPP_TEXT || 'Test';
    const trackUrl = `${API_BASE_URL}/go/whatsapp?number=${number}&text=${encodeURIComponent(text)}`;
    
    fetch(trackUrl, { 
      method: 'GET',
      credentials: 'include',
      redirect: 'manual'
    })
      .then((res) => {
        if (res.type === 'opaqueredirect' || res.status === 0 || res.status === 302) {
          return res.headers.get('Location') || res.headers.get('location');
        }
        return res.json().then(data => data.url).catch(() => null);
      })
      .then((waUrl) => {
        if (waUrl) {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        } else {
          const fallbackUrl = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
          window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        }
      })
      .catch((err) => {
        // Silent error handling for production
        const fallbackUrl = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      })
      .finally(() => setSending(false));
  }

  async function handleSearchSubmit(e) {
    e.preventDefault();
    if (!userIdInput.trim()) {
      setSearchError('Please enter a user ID');
      return;
    }
    setSearchError('');
    setSearching(true);
    
    try {
      // Use /search endpoint (not /search/redirect) which returns JSON
      const url = `${API_BASE_URL}/search?userId=${encodeURIComponent(userIdInput.trim())}`;
      
      const response = await axios.get(url, {
        withCredentials: true,
        timeout: 10000 // 10 second timeout for production
      });
      
      if (response.data.success && response.data.data) {
        // Show modal with data
        setResult(response.data);
        setShowModal(true);
        setSearchError('');
      } else {
        setSearchError(response.data.message || 'User not found');
      }
    } catch (err) {
      // Enhanced error handling for production
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setSearchError('Request timed out. Please try again.');
      } else if (err.response && err.response.status === 404) {
        setSearchError('User not found');
      } else if (err.response && err.response.status === 500) {
        setSearchError('Server error. Please try again later.');
      } else if (err.response && err.response.data) {
        setSearchError(err.response.data.message || 'Something went wrong');
      } else if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        setSearchError('No internet connection. Please check your network.');
      } else {
        setSearchError('Unable to connect to server. Please try again later.');
      }
    } finally {
      setSearching(false);
    }
  }

  function handleOpenWhatsAppFromResult() {
    const waUrl = result?.data?.waLink;
    if (waUrl) {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div>
      <div className="hero">
        <div className="container">
          <div className="hero-title-wrap">
            <span className="hero-tagline">feel free to ask anything !!</span>
            <h1>Customer Care & Support</h1>
            <span className="hero-tagline">feel free to ask anything !!</span>
          </div>
          <p>WhatsApp, Email, or FAQs — get help instantly.</p>
          <div className="actions" style={{ gap: 8 }}>
            <button type="button" className="btn primary btn-whatsapp" onClick={handleWhatsAppClick} disabled={sending}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 32 32" fill="currentColor" style={{marginRight: 6}}>
                <path d="M19.11 17.26c-.31-.15-1.82-.9-2.1-1.01-.28-.1-.48-.15-.68.15-.2.31-.78 1.01-.96 1.22-.18.2-.36.23-.67.08-.31-.15-1.29-.48-2.46-1.53-.91-.81-1.52-1.82-1.7-2.13-.18-.31-.02-.48.13-.63.13-.13.31-.36.46-.54.15-.18.2-.31.31-.51.1-.2.05-.38-.03-.54-.08-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51-.18-.01-.38-.01-.58-.01-.2 0-.54.08-.83.38-.28.31-1.09 1.06-1.09 2.57 0 1.51 1.12 2.97 1.28 3.18.15.2 2.2 3.36 5.33 4.71.75.32 1.34.51 1.8.65.76.24 1.45.21 1.99.13.61-.09 1.82-.74 2.08-1.45.26-.71.26-1.32.18-1.45-.08-.13-.28-.2-.59-.35z"/>
                <path d="M26.76 5.25C23.86 2.35 20.04 1 16.01 1 7.66 1 1 7.66 1 16.01c0 2.63.69 5.2 2 7.45L1 31l7.73-1.97c2.19 1.2 4.66 1.83 7.28 1.83h.01c8.35 0 15.01-6.66 15.01-15.01 0-4.02-1.57-7.8-4.27-10.6zM16.01 28.9h-.01c-2.3 0-4.54-.62-6.5-1.79l-.47-.28-4.59 1.17 1.22-4.47-.3-.46C3.11 21 2.5 18.54 2.5 16.02 2.5 8.5 8.5 2.5 16.01 2.5c3.62 0 7.03 1.41 9.59 3.97 2.56 2.56 3.97 5.97 3.97 9.59 0 7.52-6 13.84-13.56 13.84z"/>
              </svg>
              {sending ? 'Processing…' : 'WhatsApp Support'}
            </button>
            
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Search User by ID</h2>
          <p>Enter your user ID to get WhatsApp support link.</p>
          <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gap: 10, justifyItems: 'center', marginTop: 12 }}>
            <input
              type="text"
              placeholder="Enter User ID (e.g., DD125)"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              className="input"
              disabled={searching}
              aria-label="User ID"
              style={{ minWidth: 260 }}
            />
            {searchError ? <div style={{ color: '#fda4af', fontSize: 12 }}>{searchError}</div> : null}
            <button type="submit" className="btn primary" disabled={searching}>
              {searching ? 'Searching…' : 'Search'}
            </button>
          </form>
          
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">✨ User Found</div>
              <button className="modal-close" aria-label="Close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {result?.success ? (
                <>
                  <div className="info-card">
                    <div className="info-row">
                      <span className="info-label">User ID</span>
                      <span className="info-value">{result?.data?.userId || '-'}</span>
                    </div>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
                    <div className="info-row">
                      <span className="info-label">Branch</span>
                      <span className="info-value">{result?.data?.branchName || '-'}</span>
                    </div>
                  </div>
                  <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Click below to get instant support on WhatsApp
                  </p>
                </>
              ) : (
                <div style={{ color: '#fca5a5', textAlign: 'center', padding: '16px' }}>{result?.message || 'No result found'}</div>
              )}
            </div>
            <div className="modal-footer">
              {result?.success && result?.data?.waLink ? (
                <button type="button" className="btn-whatsapp" onClick={handleOpenWhatsAppFromResult}>
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M19.11 17.26c-.31-.15-1.82-.9-2.1-1.01-.28-.1-.48-.15-.68.15-.2.31-.78 1.01-.96 1.22-.18.2-.36.23-.67.08-.31-.15-1.29-.48-2.46-1.53-.91-.81-1.52-1.82-1.7-2.13-.18-.31-.02-.48.13-.63.13-.13.31-.36.46-.54.15-.18.2-.31.31-.51.1-.2.05-.38-.03-.54-.08-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51-.18-.01-.38-.01-.58-.01-.2 0-.54.08-.83.38-.28.31-1.09 1.06-1.09 2.57 0 1.51 1.12 2.97 1.28 3.18.15.2 2.2 3.36 5.33 4.71.75.32 1.34.51 1.8.65.76.24 1.45.21 1.99.13.61-.09 1.82-.74 2.08-1.45.26-.71.26-1.32.18-1.45-.08-.13-.28-.2-.59-.35z"/>
                    <path d="M26.76 5.25C23.86 2.35 20.04 1 16.01 1 7.66 1 1 7.66 1 16.01c0 2.63.69 5.2 2 7.45L1 31l7.73-1.97c2.19 1.2 4.66 1.83 7.28 1.83h.01c8.35 0 15.01-6.66 15.01-15.01 0-4.02-1.57-7.8-4.27-10.6zM16.01 28.9h-.01c-2.3 0-4.54-.62-6.5-1.79l-.47-.28-4.59 1.17 1.22-4.47-.3-.46C3.11 21 2.5 18.54 2.5 16.02 2.5 8.5 8.5 2.5 16.01 2.5c3.62 0 7.03 1.41 9.59 3.97 2.56 2.56 3.97 5.97 3.97 9.59 0 7.52-6 13.84-13.56 13.84z"/>
                  </svg>
                  <span>Open WhatsApp Support</span>
                </button>
              ) : (
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Close</button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;


