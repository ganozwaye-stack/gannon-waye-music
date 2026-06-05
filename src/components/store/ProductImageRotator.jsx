import React, { useState, useEffect } from 'react';

export default function ProductImageRotator({ images, alt, aspectClass = 'aspect-square' }) {
  const [current, setCurrent] = useState(0);

  // Auto-rotate every 2.8 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % images.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className={`${aspectClass} relative overflow-hidden bg-gradient-to-br from-secondary/20 to-secondary/60`}>
      {images.map((src, i) => (
        <img
          key={src}
          data-testid="product-image"
          src={src}
          alt={`${alt} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      ))}
      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-primary w-4 h-1.5'
                  : 'bg-white/50 w-1.5 h-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}