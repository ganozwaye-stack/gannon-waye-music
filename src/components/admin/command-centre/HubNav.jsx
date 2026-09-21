import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Megaphone, ShieldCheck, Sparkles,
  Palette, Crosshair, Rocket, FileText, Users, Globe, Star,
} from 'lucide-react';

// Grouped navigation to every hub and owner tool, so the Command Centre is
// genuinely the one place you manage everything from.
const GROUPS = [
  {
    category: 'Owner release machine',
    items: [
      { label: 'New Release Studio', path: '/admin/new-release-studio', icon: Sparkles, desc: 'Create a private release draft' },
      { label: 'One Press Launch Packet', path: '/admin/launch-packet-studio', icon: Rocket, desc: 'Draft the whole packet in one press' },
      { label: 'Hero Design Studio', path: '/admin/hero-design-studio', icon: Palette, desc: 'Design the home hero' },
      { label: 'Store Hotspot Editor', path: '/admin/merch-visual-lab', icon: Crosshair, desc: 'Zone the locked boutique photo' },
    ],
  },
  {
    category: 'Business hubs',
    items: [
      { label: 'Systems and QA', path: '/admin/systems-qa', icon: Star, desc: 'Quality and site health' },
    ],
  },
  {
    category: 'Command dashboards',
    items: [
      { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: ShieldCheck, desc: 'Financial and legal flags' },
      { label: 'Marketing Centre', path: '/admin/marketing-centre', icon: Megaphone, desc: 'Campaigns and growth' },
      { label: 'Social Command', path: '/admin/social-schedule-queue', icon: Users, desc: 'All social channels' },
      { label: 'Website Ops', path: '/admin/website-ops', icon: Globe, desc: 'Site automation' },
      { label: 'Audit Log', path: '/admin/audit-log', icon: FileText, desc: 'Change history' },
    ],
  },
];

export default function HubNav() {
  return (
    <div className="space-y-6">
      {GROUPS.map((group) => (
        <div key={group.category}>
          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-3">{group.category}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {group.items.map((item) => (
              <Link key={item.path + item.label} to={item.path}>
                <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                  <CardContent className="p-4">
                    <item.icon className="w-6 h-6 text-primary mb-2" />
                    <p className="font-medium text-sm text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}