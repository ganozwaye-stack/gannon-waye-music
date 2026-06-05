/**
 * Global Booking CTA Component
 * Adds "Book Gannon" buttons across the site
 */

import React from 'react';
import { Heart, Music, Calendar } from 'lucide-react';

export default function BookingCTA({ variant = 'default', className = '' }) {
  const variants = {
    default: 'gradient-gold-button rounded-full px-6 py-3 font-body text-sm tracking-wider uppercase',
    small: 'gradient-gold-button rounded-full px-4 py-2 font-body text-xs tracking-wider',
    large: 'gradient-gold-button rounded-full px-10 py-5 font-body text-base tracking-wider uppercase',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 rounded-full px-6 py-3 font-body text-sm tracking-wider uppercase',
  };

  const icons = {
    default: <Music className="w-4 h-4 mr-2" />,
    small: <Music className="w-3 h-3 mr-1" />,
    large: <Heart className="w-5 h-5 mr-2" />,
    outline: <Calendar className="w-4 h-4 mr-2" />,
  };

  return (
    <a href="/bookings" className={`${variants[variant]} ${className} inline-flex items-center transition-all hover:scale-105`}>
      {icons[variant]}
      Book Gannon
    </a>
  );
}