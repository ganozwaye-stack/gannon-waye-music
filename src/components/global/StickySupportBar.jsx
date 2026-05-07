import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StickySupportBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/40 px-4 py-3 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-primary" />
          <div>
            <p className="font-body text-xs text-foreground font-medium">Support the "Thank You" Project</p>
            <p className="font-body text-[10px] text-muted-foreground">10% → 1800RESPECT</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/impact">
            <Button variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/10 font-body text-xs tracking-wider uppercase px-4 hidden sm:inline-flex">
              Impact
            </Button>
          </Link>
          <Link to="/back-this">
            <Button className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-6">
              Support Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}