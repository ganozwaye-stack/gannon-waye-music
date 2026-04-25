import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomTabs from './MobileBottomTabs';

const ROOT_ROUTES = ['/', '/music', '/store', '/community'];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isRootRoute = ROOT_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1 pt-16">
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      {isRootRoute && <MobileBottomTabs />}
    </div>
  );
}