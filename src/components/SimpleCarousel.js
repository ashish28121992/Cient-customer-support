import React from 'react';

const images = [
  // Dark neon controller (Unsplash)
  'https://images.unsplash.com/photo-1580237072617-7785c80f0a99?w=1600&q=80&auto=format&fit=crop',
  // Dark RGB gaming rig (Unsplash)
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1600&q=80&auto=format&fit=crop',
  // Esports / dark arena lights (Unsplash)
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80&auto=format&fit=crop',
];

function SimpleCarousel() {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, []);

  function prev() { setIndex((i) => (i - 1 + images.length) % images.length); }
  function next() { setIndex((i) => (i + 1) % images.length); }

  function handleImageError(e) {
    e.currentTarget.src = 'https://picsum.photos/seed/fallback/1600/900';
  }

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-inner">
        {images.map((src, i) => (
          <div className={`hero-slide${i === index ? ' active' : ''}`} key={i}>
            <img src={src} alt="slide" onError={handleImageError} />
          </div>
        ))}
        <button className="nav prev" onClick={prev} aria-label="Previous">‹</button>
        <button className="nav next" onClick={next} aria-label="Next">›</button>
      </div>
      <div className="dots">
        {images.map((_, i) => (
          <button key={i} className={`dot${i === index ? ' active' : ''}`} onClick={() => setIndex(i)} aria-label={`Go to slide ${i+1}`} />
        ))}
      </div>
    </div>
  );
}

export default SimpleCarousel;


