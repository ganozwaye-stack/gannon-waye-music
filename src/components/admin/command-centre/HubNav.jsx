import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Megaphone, Music, Package, Bot, ShieldCheck, Briefcase, Sparkles,
  Palette, Crosshair, Rocket, Settings, FileText, Users, Globe, Star,
} from 'lucide-react';

// Grouped navigation to every hub and owner tool, so the Command Centre is
// genuinely the one place you manage everything from.
const GROUPS = [
  {
    category: 'Owner release machine',
    items: [
      { label: 'New Release Studio', path: '/admin/new-release-studio', icon: Sparkles, desc: 'Create a private release draft' },
      { label: 'One Press Launch Packet', path: '/admin/launch-packet-studio', icon: Rocket, desc: 'Draft the whole packet in one press' },
      { label: 'Release Control Desk', path: '/admin/release-control', icon: ShieldCheck, desc: 'Save changes, approve, Go Live' },
      { label: 'Hero Design Studio', path: '/admin/hero-design-studio', icon: Palette, desc: 'Design the home hero' },
      { label: 'Store Hotspot Editor', path: '/admin/store-hotspots', icon: Crosshair, desc: 'Zone the locked boutique photo' },
    ],
  },
  {
    category: 'Business hubs',
    items: [
      { label: 'Launch and Content', path: '/admin/launch-content', icon: Megaphone, desc: 'Campaigns and content' },
      { label: 'Music and Fans', path: '/admin/music-fan', icon: Music, desc: 'Catalogue and fan base' },
      { label: 'Orders and Store', path: '/admin/orders', icon: Package, desc: 'Orders, fulfilment, stock' },
      { label: 'Automation and Agents', path: '/admin/automation-agents', icon: Bot, desc: 'Agents and automations' },
      { label: 'Systems and QA', path: '/admin/systems-qa', icon: Star, desc: 'Quality and site health' },
      { label: 'Owner Business', path: '/admin/owner-business', icon: Briefcase, desc: 'Leads, money, business ops' },
    ],
  },
  {
    category: 'Command dashboards',
    items: [
      { label: 'Approval Queue', path: '/admin/approval-queue', icon: ShieldCheck, desc: 'Pending decisions' },
      { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: ShieldCheck, desc: 'Financial and legal flags' },
      { label: 'Agent Registry', path: '/admin/agent-registry', icon: Bot, desc: 'Specialist agents' },
      { label: 'Marketing Centre', path: '/admin/marketing-centre', icon: Megaphone, desc: 'Campaigns and growth' },
      { label: 'Social Command', path: '/admin/social-command', icon: Users, desc: 'All social channels' },
      { label: 'Website Ops', path: '/admin/website-ops', icon: Globe, desc: 'Site automation' },
      { label: 'Settings', path: '/admin/settings', icon: Settings, desc: 'Site settings' },
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