import React, { useState, useEffect, useCallback } from 'react';
import '../styles/slider.css';

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { url: '/Items/slider images/slider image - 01.png', alt: 'Fresh Ingredients' },
    { url: '/Items/slider images/slider image - 02.png', alt: 'Authentic Taste' },
    { url: '/Items/slider images/slider image - 03.png', alt: 'Premium Quality' },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="slider-container">
      <div 
        className="slider-image-container" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <img src={slide.url} alt={slide.alt} />
          </div>
        ))}
      </div>

      <div className="slider-overlay"></div>

      {/* Navigation Arrows */}
      <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous slide">
        <svg viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button className="slider-arrow next" onClick={nextSlide} aria-label="Next slide">
        <svg viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Indicators */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
