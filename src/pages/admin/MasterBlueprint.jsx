import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2, AlertTriangle, XCircle, Circle, RefreshCw,
  ExternalLink, ChevronDown, ChevronRight, Zap, Shield, ShoppingCart,
  Music, Settings, Activity, Globe, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const S = {
  ok:      { label: 'Live',          icon: CheckCircle2, cls: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30' },
  review:  { label: 'Needs Review',  icon: AlertTriangle,cls: 'text-primary',    bg: 'bg-primary/10 border-primary/30' },
