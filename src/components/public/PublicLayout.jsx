import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomTabs from './MobileBottomTabs';
import CartButton from '@/components/store/CartButton';
const ROOT_ROUTES = ['/', '/music', '/store', '/community'];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isRootRoute = ROOT_ROUTES.includes(pathname);
  const isStoreLanding = pathname === '/store';
  const isImmersiveMemorial = pathname === '/mum' || pathname === '/mum/garden' || pathname === '/mum-garden' || pathname === '/mum-garden-preview';

  return (
      <div className="min-h-screen flex flex-col pb-14">
      <Navbar />
      {!isImmersiveMemorial && <CartButton />}
      <main className={`flex-1 ${isStoreLanding || isImmersiveMemorial ? 'pt-0' : 'pt-16'}`}>
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </main>
      {!isImmersiveMemorial && <Footer />}
      {isRootRoute && <MobileBottomTabs />}
    </div>
  );
}
