'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Home from './Home';

export default function HomePage() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('scroll') === 'carousel') {
      document.getElementById('carousel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [searchParams]);

  return <Home />;
}