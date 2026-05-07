import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, DollarSign, Package, Users, Heart, Gift, Tag, Mail, TrendingUp, FileText, ExternalLink, Command, ShoppingBag, Briefcase, Camera, Activity, BarChart3, RefreshCw, Download, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const COMMANDS = [
  // Navigation
  { id: 'nav_dashboard', label: 'Go to Dashboard', shortcut: 'G D', icon: TrendingUp, action: '/admin' },
  { id: 'nav_orders', label: 'View Orders', shortcut: 'G O', icon: Package, action: '/admin/orders' },
  { id: 'nav_products', label: 'View Products', shortcut: 'G P', icon: ShoppingBag, action: '/admin/merch' },
  { id: 'nav_subscribers', label: 'View Subscribers', shortcut: 'G S', icon: Users, action: '/admin/subscribers' },
  { id: 'nav_financials', label: 'View Financials', shortcut: 'G F', icon: DollarSign, action: '/admin/financials' },
  { id: 'nav_charity', label: 'View Charity Tracking', shortcut: 'G C', icon: Heart, action: '/admin/charity-tracking' },
  { id: 'nav_gifts', label: 'View Gift Claims', shortcut: 'G G', icon: Gift, action: '/admin/gift-verification' },
  { id: 'nav_promos', label: 'View Promo Codes', shortcut: 'G K', icon: Tag, action: '/admin/promo-codes' },
  { id: 'nav_bookings', label: 'View Bookings', shortcut: 'G B', icon: Briefcase, action: '/admin' },
  { id: 'nav_media', label: 'View Fan Media', shortcut: 'G M', icon: Camera, action: '/admin/fan-media' },
  { id: 'nav_audit', label: 'View Audit Logs', shortcut: 'G A', icon: Activity, action: '/admin/audit-log' },
  { id: 'nav_newsletter', label: 'Send Newsletter', shortcut: 'G N', icon: Mail, action: '/admin/newsletter' },
  { id: 'nav_training', label: 'Open Training Hub', shortcut: 'G T', icon: FileText, action: '/admin/training' },
  { id: 'nav_health', label: 'Site Health', shortcut: 'G H', icon: Activity, action: '/admin/site-health' },
  { id: 'nav_site', label: 'View Public Site', shortcut: 'G V', icon: ExternalLink, action: '/' },
  
  // Create Actions
  { id: 'create_product', label: 'Create New Product', shortcut: 'C P', icon: Plus, action: '/admin/merch?action=new' },
  { id: 'create_promo', label: 'Create Promo Code', shortcut: 'C K', icon: Plus, action: '/admin/promo-codes?action=new' },
  { id: 'create_release', label: 'Create New Release', shortcut: 'C R', icon: Plus, action: '/admin/releases?action=new' },
  { id: 'create_subscriber', label: 'Add Subscriber', shortcut: 'C S', icon: Plus, action: '/admin/subscribers?action=new' },
  
  // Quick Actions
  { id: 'run_health', label: 'Run Site Health Check', shortcut: 'R H', icon: Search, action: '/admin/site-health?action=check' },
  { id: 'run_charity', label: 'Run Charity Tracking', shortcut: 'R C', icon: Heart, action: '/admin/charity-tracking?action=track' },
  { id: 'run_birthday', label: 'Run Birthday Process', shortcut: 'R B', icon: Gift, action: '/admin/birthdays?action=run' },
  { id: 'export_orders', label: 'Export Orders', shortcut: 'E O', icon: Download, action: '/admin/orders?export=true' },
  { id: 'export_supporters', label: 'Export Supporters', shortcut: 'E S', icon: Download, action: '/admin/subscribers?export=true' },
  { id: 'refresh_data', label: 'Refresh All Data', shortcut: 'F5', icon: RefreshCw, action: '?refresh=all' },
  
  // Analytics
  { id: 'analytics_revenue', label: 'Revenue Analytics', shortcut: 'A R', icon: BarChart3, action: '/admin/financials' },
  { id: 'analytics_products', label: 'Product Performance', shortcut: 'A P', icon: BarChart3, action: '/admin/merch-financials' },
  { id: 'analytics_supporters', label: 'Supporter Analytics', shortcut: 'A S', icon: BarChart3, action: '/admin/subscribers' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (command) => {
    if (command.action) {
      navigate(command.action);
      if (onClose) onClose();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open command palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle handled by parent
        return;
      }
      
      // Navigate results
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
  }, [query, selectedIndex, filteredCommands, onClose, executeCommand]);

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
              <Command className="w-5 h-5 text-primary" />
              <Input
                autoFocus
                placeholder="Type a command or search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 text-lg"
              />
              <Badge variant="outline" className="text-[10px]">⌘K</Badge>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="font-body text-sm text-muted-foreground">No commands found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCommands.map((command, i) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.id}
                      onClick={() => executeCommand(command)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                        i === selectedIndex
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-secondary/50 text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-display text-sm flex-1">{command.label}</span>
                      <Badge variant="outline" className="text-[10px] opacity-50">
                        {command.shortcut}
                      </Badge>
                    </button>
                  );
                })}
              </div>
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