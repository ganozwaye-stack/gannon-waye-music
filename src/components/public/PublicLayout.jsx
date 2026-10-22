import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomTabs from './MobileBottomTabs';
import GlobalPlayerDock from './GlobalPlayerDock';
import AmbientReleasePlayer from './AmbientReleasePlayer';
import ReleaseUpdatesPopup from './ReleaseUpdatesPopup';
import FanChatWidget from './FanChatWidget';
import MarqueeBar from './MarqueeBar';

export default function PublicLayout() {
  const { pathname } = useLocation();

  return (
    <div className="public-site min-h-screen flex flex-col pb-44 md:pb-12" style={{ '--font-display': "'Poppins', sans-serif", '--font-serif': "'Poppins', sans-serif", fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <main className="flex-1 pt-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <MobileBottomTabs />
      <MarqueeBar />
      <GlobalPlayerDock />
      <AmbientReleasePlayer />
      <ReleaseUpdatesPopup />
      <FanChatWidget />
    </div>
  );
}