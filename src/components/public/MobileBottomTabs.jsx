import { Link, useLocation } from 'react-router-dom';
import { Home, Music, ShoppingBag, FileText, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/music', label: 'Music', icon: Music },
  { path: '/store', label: 'Store', icon: ShoppingBag },
  { path: '/lyrics', label: 'Lyrics', icon: FileText },
  { path: '/contact', label: 'Contact', icon: Mail },
];

export default function MobileBottomTabs() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/40 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center py-2.5 px-1 transition-colors relative"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={`flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]' : ''}`} />
                <span className="text-[9px] tracking-wider uppercase mt-1 font-body">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}