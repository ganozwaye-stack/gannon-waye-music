import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, DollarSign, Package, Users, TrendingUp, ExternalLink, Command, ShoppingBag, Briefcase, Camera, Activity, Megaphone, Palette, Music, Brain, Lock, Zap, BookOpen, Terminal, Shield, Film, Star, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const STATIC_COMMANDS = [
  // Pinned daily operating (first)
  { id: 'nav_daily_dashboard', label: 'Go to Daily Dashboard', shortcut: 'G D', icon: TrendingUp, action: '/admin/dashboard' },
  { id: 'nav_command_center', label: 'Open Command Center', shortcut: 'G C', icon: Terminal, action: '/admin/command-centre' },
  { id: 'nav_approval_queue', label: 'Open Approval Queue', shortcut: 'G A', icon: Shield, action: '/admin/approval-queue' },
  { id: 'nav_website_overhaul', label: 'Open Website Overhaul', shortcut: 'G W', icon: Globe, action: '/admin/site-upgrade-audit' },
  { id: 'nav_content_studio', label: 'Open Content Studio', shortcut: 'G S', icon: Film, action: '/admin/content-studio' },
  { id: 'nav_release_prep', label: 'Open Release Prep', shortcut: 'G R', icon: Star, action: '/admin/release-sprint' },

  // Remaining commands alphabetical
  { id: 'create_product', label: 'Create New Product', shortcut: 'C P', icon: Plus, action: '/admin/merch?action=new' },
  { id: 'create_promo', label: 'Create Promo Code', shortcut: 'C K', icon: Plus, action: '/admin/promo-codes?action=new' },
  { id: 'hub_automation', label: 'Hub: Automation & Agents Hub', shortcut: 'H A', icon: Brain, action: '/admin/automation-agents' },
  { id: 'hub_creative', label: 'Hub: Creative Studio Hub', shortcut: 'H C', icon: Palette, action: '/admin/creative-studio' },
  { id: 'hub_launch', label: 'Hub: Launch & Content Hub', shortcut: 'H L', icon: Megaphone, action: '/admin/launch-content' },
  { id: 'hub_music', label: 'Hub: Music & Fan Hub', shortcut: 'H M', icon: Music, action: '/admin/music-fan' },
  { id: 'hub_owner', label: 'Hub: Owner Business Hub (Gannon Only)', shortcut: 'H B', icon: Lock, action: '/admin/owner-business' },
  { id: 'hub_store', label: 'Hub: Store & Orders Hub', shortcut: 'H S', icon: ShoppingBag, action: '/admin/store-orders' },
  { id: 'hub_systems', label: 'Hub: Systems & QA Hub', shortcut: 'H Q', icon: Activity, action: '/admin/systems-qa' },
  { id: 'nav_dashboard', label: 'Go to Admin Dashboard', shortcut: 'G A', icon: TrendingUp, action: '/admin' },
  { id: 'nav_orders', label: 'View Orders List', shortcut: 'G O', icon: Package, action: '/admin/orders' },
  { id: 'nav_products', label: 'View Products List', shortcut: 'G P', icon: ShoppingBag, action: '/admin/merch' },
  { id: 'nav_subscribers', label: 'View Supporter CRM', shortcut: 'G R', icon: Users, action: '/admin/subscribers' },
  { id: 'nav_financials', label: 'View Financials', shortcut: 'G F', icon: DollarSign, action: '/admin/financials' },
  { id: 'nav_health', label: 'Site Health Check', shortcut: 'G H', icon: Activity, action: '/admin/site-health' },
  { id: 'nav_site', label: 'View Public Site Home', shortcut: 'G V', icon: ExternalLink, action: '/' },
  { id: 'action_leads', label: 'View Systems Manager Leads', shortcut: 'A L', icon: Briefcase, action: '/admin/owner-business?tab=leads' },
  { id: 'action_war_room', label: 'Open Launch War Room', shortcut: 'A W', icon: Zap, action: '/admin/launch-content?tab=war-room' },
  { id: 'action_story', label: 'Open Story Vault', shortcut: 'A V', icon: BookOpen, iconName: 'book', action: '/admin/music-fan?tab=story-vault' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Queries for live/search matching
  const { data: merchOrders = [] } = useQuery({
    queryKey: ['merchOrders-palette'],
    queryFn: () => base44.entities.MerchOrder.list(),
    enabled: isOpen,
  });

  const { data: supporters = [] } = useQuery({
    queryKey: ['supporters-palette'],
    queryFn: () => base44.entities.EmailSubscriber.list(),
    enabled: isOpen,
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['social-assets-palette'],
    queryFn: () => base44.entities.SocialAsset.list(),
    enabled: isOpen,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['merchProducts-palette'],
    queryFn: () => base44.entities.MerchProduct.list(),
    enabled: isOpen,
  });

  const filteredCommands = useMemo(() => {
    const staticFiltered = STATIC_COMMANDS.filter(cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    const dynamicResults = [];
    if (query.trim().length > 1) {
      const q = query.toLowerCase();

      // Search merch products
      products.forEach(p => {
        if (p.name?.toLowerCase().includes(q)) {
          dynamicResults.push({
            id: `product_${p.id}`,
            label: `Merch: ${p.name} ($${p.price})`,
            icon: ShoppingBag,
            shortcut: 'PROD',
            action: `/admin/merch?id=${p.id}`
          });
        }
      });

      // Search orders
      merchOrders.forEach(o => {
        if (o.customer_name?.toLowerCase().includes(q) || o.customer_email?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q)) {
          dynamicResults.push({
            id: `order_${o.id}`,
            label: `Order #${o.id?.slice(-6)} - ${o.customer_name} (${o.status})`,
            icon: Package,
            shortcut: 'ORDER',
            action: `/admin/orders?id=${o.id}`
          });
        }
      });

      // Search supporters
      supporters.forEach(s => {
        if (s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)) {
          dynamicResults.push({
            id: `supporter_${s.id}`,
            label: `Supporter: ${s.name} (${s.email})`,
            icon: Users,
            shortcut: 'SUPP',
            action: `/admin/subscribers?email=${s.email}`
          });
        }
      });

      // Search assets
      assets.forEach(a => {
        if (a.name?.toLowerCase().includes(q) || a.notes?.toLowerCase().includes(q)) {
          dynamicResults.push({
            id: `asset_${a.id}`,
            label: `Asset: ${a.name} (${a.asset_type})`,
            icon: Camera,
            shortcut: 'ASSET',
            action: `/admin/social-asset-library?id=${a.id}`
          });
        }
      });
    }

    return [...staticFiltered, ...dynamicResults];
  }, [query, products, merchOrders, supporters, assets]);

  const executeCommand = (command) => {
    if (command.action) {
      navigate(command.action);
      if (onClose) onClose();
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    setSelectedIndex(0);
  }, [isOpen, query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Toggle handled by parent keydown handler with input exclusion
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="bg-card border border-border/40 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <Command className="w-5 h-5 text-primary animate-pulse" />
              <Input
                autoFocus
                placeholder="Search tools, settings, orders, assets, supporters, or GanozMix..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 text-lg bg-transparent text-foreground placeholder:text-muted-foreground"
              />
              <Badge variant="outline" className="text-[10px]">ESC to close</Badge>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="font-body text-sm text-muted-foreground">No matches found. Try searching orders, supporters, or assets.</p>
              </div>
            ) : (
              filteredCommands.map((command, i) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      i === selectedIndex
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'border border-transparent hover:bg-secondary/50 text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <span className="font-display text-sm flex-1 truncate">{command.label}</span>
                    <Badge variant="outline" className="text-[9px] opacity-75 font-mono">
                      {command.shortcut}
                    </Badge>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border/40 bg-secondary/30">
            <div className="flex gap-4 text-[10px] text-muted-foreground">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to close</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}