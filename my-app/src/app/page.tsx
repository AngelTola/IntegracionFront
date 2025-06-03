'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Carousel from '@/app/components/carousel/Carrusel';

export default function HomePage() {
  const searchParams = useSearchParams();
  const showCarousel = searchParams.get('mostrarCarrusel') === 'true';
  
  useEffect(() => {
    if (showCarousel) {
      // Small delay to ensure carousel is mounted
      setTimeout(() => {
        document.getElementById('carousel')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [showCarousel]);

  return (
    <div>
      {/* Your existing page content */}
      
      {showCarousel && <Carousel />}
      
      {/* More page content */}
    </div>
  );
}