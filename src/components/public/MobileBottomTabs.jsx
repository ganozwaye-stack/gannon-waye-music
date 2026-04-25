import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Music, ShoppingBag, Users } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/music', label: 'Music', icon: Music },
  { path: '/store', label: 'Store', icon: ShoppingBag },
  { path: '/community', label: 'Community', icon: Users },
];

export default function MobileBottomTabs() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border/40 z-40 safe-area-inset-bottom">
      <div className="flex justify-around">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-wider uppercase mt-1 font-body">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}