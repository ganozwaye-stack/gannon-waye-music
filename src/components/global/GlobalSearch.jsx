import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Users, ShoppingBag, DollarSign, Heart, Package, Tag, Mail, TrendingUp, Gift, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SEARCH_TYPES = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'supporters', label: 'Supporters', icon: Users },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'contributions', label: 'Donations', icon: DollarSign },
  { id: 'gift_claims', label: 'Gift Claims', icon: Gift },
  { id: 'promo_codes', label: 'Promo Codes', icon: Tag },
  { id: 'subscribers', label: 'Subscribers', icon: Mail },
  { id: 'charity', label: 'Charity', icon: Heart },
];

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query, selectedType);
        saveToRecent(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedType]);

  const performSearch = async (searchQuery, type) => {
    setLoading(true);
    try {
      const searchPromises = [];
      
      if (type === 'all' || type === 'orders') {
        searchPromises.push(
          base44.entities.MerchOrder.filter({}).then(orders => 
            orders.filter(o => 
              o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              o.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              o.id?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(o => ({ type: 'order', data: o }))
          )
        );
      }
      
      if (type === 'all' || type === 'supporters' || type === 'subscribers') {
        searchPromises.push(
          base44.entities.EmailSubscriber.filter({}).then(subs =>
            subs.filter(s => 
              s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.email?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(s => ({ type: 'subscriber', data: s }))
          )
        );
      }
      
      if (type === 'all' || type === 'products') {
        searchPromises.push(
          base44.entities.MerchProduct.filter({}).then(products =>
            products.filter(p => 
              p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(p => ({ type: 'product', data: p }))
          )
        );
      }
      
      if (type === 'all' || type === 'contributions') {
        searchPromises.push(
          base44.entities.SupportContribution.filter({}).then(contribs =>
            contribs.filter(c => 
              c.supporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.supporter_email?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(c => ({ type: 'contribution', data: c }))
          )
        );
      }
      
      if (type === 'all' || type === 'gift_claims') {
        searchPromises.push(
          base44.entities.GiftRequirementTracker.filter({}).then(trackers =>
            trackers.filter(t => 
              t.subscriber_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.subscriber_email?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(t => ({ type: 'gift_claim', data: t }))
          )
        );
      }
      
      if (type === 'all' || type === 'promo_codes') {
        searchPromises.push(
          base44.entities.PromoCode.filter({}).then(codes =>
            codes.filter(c => 
              c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.description?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(c => ({ type: 'promo_code', data: c }))
          )
        );
      }

      const allResults = await Promise.all(searchPromises);
      const flattened = allResults.flat().slice(0, 50); // Limit results
      setResults(flattened);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
    setLoading(false);
  };

  const saveToRecent = (searchQuery) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 5);
    });
  };

  const handleResultClick = (result) => {
    const routes = {
      order: `/admin/orders`,
      subscriber: `/admin/subscribers`,
      product: `/admin/merch`,
      contribution: `/admin/supporters`,
      gift_claim: `/admin/gift-verification`,
      promo_code: `/admin/promo-codes`,
    };
    
    navigate(routes[result.type] || '/admin');
    if (onClose) onClose();
  };

  const getTypeIcon = (type) => {
    const icons = {
      order: Package,
      subscriber: Users,
      product: ShoppingBag,
      contribution: DollarSign,
      gift_claim: Gift,
      promo_code: Tag,
    };
    const Icon = icons[type] || Search;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      order: 'bg-blue-500/20 text-blue-500',
      subscriber: 'bg-green-500/20 text-green-500',
      product: 'bg-purple-500/20 text-purple-500',
      contribution: 'bg-yellow-500/20 text-yellow-500',
      gift_claim: 'bg-pink-500/20 text-pink-500',
      promo_code: 'bg-orange-500/20 text-orange-500',
    };
    return colors[type] || 'bg-gray-500/20 text-gray-500';
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search orders, supporters, products, donations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 py-6 text-lg bg-card border-primary/30 shadow-lg"
        />
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {SEARCH_TYPES.map(type => {
          const Icon = type.icon;
          return (
            <Button
              key={type.id}
              size="sm"
              variant={selectedType === type.id ? 'default' : 'outline'}
              onClick={() => setSelectedType(type.id)}
              className="gap-1 flex-shrink-0"
            >
              <Icon className="w-3 h-3" />
              {type.label}
            </Button>
          );
        })}
      </div>

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div className="mb-4">
          <p className="font-body text-xs text-muted-foreground mb-2">Recent searches</p>
          <div className="flex gap-2 flex-wrap">
            {recentSearches.map(search => (
              <Badge
                key={search}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setQuery(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="font-body text-sm text-muted-foreground">Searching...</p>
          </motion.div>
        )}

        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2 max-h-[60vh] overflow-y-auto"
          >
            {results.map((result, i) => (
              <button
                key={`${result.type}-${result.data.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full text-left p-4 bg-card border border-border/40 rounded-xl hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm text-foreground group-hover:text-primary transition-colors">
                      {result.data.name || result.data.customer_name || result.data.code || result.data.email}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {result.type === 'order' && `Order #${result.data.id.slice(-6)}`}
                      {result.type === 'subscriber' && result.data.email}
                      {result.type === 'product' && `$${result.data.sale_price?.toFixed(2)}`}
                      {result.type === 'contribution' && `$${result.data.amount?.toFixed(2)}`}
                      {result.type === 'gift_claim' && result.data.status}
                      {result.type === 'promo_code' && `${result.data.discount_percent}% off`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {result.type.replace('_', ' ')}
                  </Badge>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {!loading && query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="font-body text-sm text-muted-foreground">No results found for "{query}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}