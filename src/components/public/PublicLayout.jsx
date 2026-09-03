import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomTabs from './MobileBottomTabs';
import SocialProofTicker from './SocialProofTicker';

export default function PublicLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col pb-44 md:pb-0">
      <Navbar />
      <main className="flex-1 pt-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <MobileBottomTabs />
      <SocialProofTicker />
    </div>
  );
}