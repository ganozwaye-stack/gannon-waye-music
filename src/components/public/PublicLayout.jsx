import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomTabs from './MobileBottomTabs';
import SocialProofTicker from './SocialProofTicker';
import CartButton from '@/components/store/CartButton';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isMumGardenRoute = pathname === '/mum/garden';

  return (
    <div className={`min-h-screen flex flex-col ${isMumGardenRoute ? '' : 'pb-14'}`}>
      {!isMumGardenRoute && <Navbar />}
      {!isMumGardenRoute && <CartButton />}
      <main className={`flex-1 ${isMumGardenRoute ? '' : 'pt-16'}`}>
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </main>
      {!isMumGardenRoute && <Footer />}
      {!isMumGardenRoute && <MobileBottomTabs />}
      {!isMumGardenRoute && <SocialProofTicker />}
    </div>
  );
}
