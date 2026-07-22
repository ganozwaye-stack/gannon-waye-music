import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Music, Radio, Mic2, Calendar, DollarSign, Zap, RefreshCw,
  ExternalLink, Clock, Star, ChevronDown, ChevronUp, Award, Headphones, BookOpen, Send, CheckCircle2, Globe
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Globe },
  { id: 'grant', label: 'Grants', icon: Award },
  { id: 'playlist', label: 'Playlists', icon: Music },
  { id: 'radio', label: 'Radio', icon: Radio },
  { id: 'podcast', label: 'Podcasts', icon: Headphones },
  { id: 'gig', label: 'Gigs', icon: Mic2 },
  { id: 'sync', label: 'Sync', icon: Zap },
  { id: 'competition', label: 'Competitions', icon: Star },
  { id: 'event', label: 'Events', icon: Calendar },
  { id: 'development', label: 'Development', icon: BookOpen },
];

const EFFORT_COLORS = {
  low: 'bg-green-500/10 text-green-400',
  medium: 'bg-yellow-500/10 text-yellow-400',
  high: 'bg-red-500/10 text-red-400',
};

const STATUS_COLORS = {
  new: 'bg-blue-500/10 text-blue-400',
  reviewing: 'bg-yellow-500/10 text-yellow-400',
  applied: 'bg-purple-500/10 text-purple-400',
  approved: 'bg-green-500/10 text-green-400',
  rejected: 'bg-red-500/10 text-red-400',
  missed: 'bg-gray-500/10 text-gray-400',
};

// Static seed opportunities (agent would populate more)
const SEED_OPPORTUNITIES = [
  {
    id: 's1',
    title: 'APRA AMCOS Songsalive! Grant',
    category: 'grant',
    deadline: '2026-07-31',
    income_potential: '$2,000–$5,000',
    effort: 'medium',
    link: 'https://www.apraamcos.com.au',
    requirements: 'Australian songwriter, 1+ released track, artist statement',
    suggested_pitch: 'Highlight the emotional storytelling in Thankyou and community impact through the 1800RESPECT donation',
    gannon_action: true,
    agent_action: 'Research eligibility criteria and draft application',
    status: 'new',
  },
  {
    id: 's2',
    title: 'Spotify Editorial Playlist Submission — Fresh Finds',
    category: 'playlist',
    deadline: 'Rolling',
    income_potential: 'Streaming uplift +10k–100k streams',
    effort: 'low',
    link: 'https://artists.spotify.com',
    requirements: 'Submit via Spotify for Artists 7+ days before release',
    suggested_pitch: 'Frame Thankyou as a survivor anthem — emotional hook, social impact, real story',
    gannon_action: false,
    agent_action: 'Submit via Spotify for Artists dashboard with optimised pitch copy',
    status: 'new',
  },
  {
    id: 's3',
    title: 'Triple J Unearthed — Feature Submission',
    category: 'radio',
    deadline: 'Rolling',
    income_potential: 'National radio exposure',
    effort: 'low',
    link: 'https://www.unearthed.com.au',
    requirements: 'Upload track, complete artist bio, genre tag',
    suggested_pitch: 'Australian independent singer-songwriter with a social impact angle — DV awareness',
    gannon_action: false,
    agent_action: 'Upload track and write optimised submission',
    status: 'new',
  },
  {
    id: 's4',
    title: 'Nursing Home Performance — Melbourne East Network',
    category: 'gig',
    deadline: 'Ongoing',
    income_potential: '$150–$400 per show',
    effort: 'low',
    link: 'https://www.australiaage.com.au',
    requirements: 'Police check, public liability insurance, 45–60 min setlist',
    suggested_pitch: 'Acoustic set featuring classic ballads and originals, create connection through live music therapy',
    gannon_action: true,
    agent_action: 'Research local facilities and draft an outreach email template',
    status: 'new',
  },
  {
    id: 's5',
    title: 'Music Victoria — Amplify Program 2026',
    category: 'development',
    deadline: '2026-08-15',
    income_potential: 'Mentorship + $3,000 funding',
    effort: 'high',
    link: 'https://www.musicvictoria.com.au',
    requirements: 'Victorian artist, demonstrate financial need, growth plan',
    suggested_pitch: 'Independent artist building a sustainable model with merch, streaming and community support',
    gannon_action: true,
    agent_action: 'Draft full application and financial summary',
    status: 'new',
  },
  {
    id: 's6',
    title: 'Sync License — Indie Film / Short Film Call',
    category: 'sync',
    deadline: 'Rolling',
    income_potential: '$200–$2,000 per placement',
    effort: 'medium',
    link: 'https://www.musicbed.com',
    requirements: 'Master + publishing rights owned by artist',
    suggested_pitch: 'Emotional acoustic ballads suitable for drama, romance, survivor story films',
    gannon_action: false,
    agent_action: 'Register tracks on Musicbed, Artlist, and Epidemic Sound',
    status: 'new',
  },
  {
    id: 's7',
    title: 'The AU Review — Independent Artist Feature',
    category: 'podcast',
    deadline: 'Rolling',
    income_potential: 'Press coverage — brand value',
    effort: 'low',
    link: 'https://www.theaureview.com',
    requirements: 'Australian artist, recent release, press kit',
    suggested_pitch: 'Story of Thankyou — DV awareness, independent release, personal story',
    gannon_action: false,
    agent_action: 'Draft pitch email and compile press kit',
    status: 'new',
  },
  {
    id: 's8',
    title: 'Australian Songwriting Competition 2026',
    category: 'competition',
    deadline: '2026-09-01',
    income_potential: '$5,000 prize',
    effort: 'low',
    link: 'https://www.australiansongwritingawards.com',
    requirements: 'Original Australian composition, $40 entry fee',
    suggested_pitch: 'Enter Thankyou in the Pop / Acoustic category — emotional depth is a key judging criterion',
    gannon_action: true,
    agent_action: 'Prepare entry package and submission',
    status: 'new',
  },
];

function OpportunityCard({ opp, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const isDeadlineSoon = opp.deadline !== 'Rolling' && new Date(opp.deadline) < new Date(Date.now() + 14 * 86400000);

  return (
    <div className={`bg-card/50 border rounded-xl overflow-hidden transition-all ${isDeadlineSoon ? 'border-yellow-500/30' : 'border-border/30'}`}>
      <div
        className="p-4 cursor-pointer hover:bg-white/3 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge className={`text-[10px] ${STATUS_COLORS[opp.status] || STATUS_COLORS.new}`}>{opp.status}</Badge>
              <Badge variant="outline" className="text-[10px]">{opp.category}</Badge>
              {isDeadlineSoon && <Badge className="bg-yellow-500/10 text-yellow-400 text-[10px]">⏰ Soon</Badge>}
              {opp.gannon_action && <Badge className="bg-orange-500/10 text-orange-400 text-[10px]">Your Action</Badge>}
            </div>
            <h3 className="font-semibold text-sm text-foreground leading-tight">{opp.title}</h3>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{opp.deadline}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{opp.income_potential}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${EFFORT_COLORS[opp.effort]}`}>{opp.effort} effort</span>
            </div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/20 pt-3 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Requirements</p>
            <p className="text-xs text-foreground/70">{opp.requirements}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Suggested Pitch</p>
            <p className="text-xs text-foreground/70 italic">"{opp.suggested_pitch}"</p>
          </div>
          {opp.agent_action && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-blue-400/70 mb-1">Agent Can Do</p>
              <p className="text-xs text-blue-300/80">{opp.agent_action}</p>
            </div>
          )}
          <div className="flex gap-2 flex-wrap pt-1">
            {opp.link && (
              <a href={opp.link} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="text-xs h-7 border-border/40">
                  <ExternalLink className="w-3 h-3 mr-1" /> Visit
                </Button>
              </a>
            )}
            <Button size="sm" variant="outline" className="text-xs h-7 border-green-500/30 text-green-400 hover:bg-green-500/10" onClick={() => onStatusChange(opp.id, 'applied')}>
              <Send className="w-3 h-3 mr-1" /> Mark Applied
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7 border-border/30 text-muted-foreground" onClick={() => onStatusChange(opp.id, 'reviewing')}>
              <CheckCircle2 className="w-3 h-3 mr-1" /> Reviewing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MusicOpportunityBulletin() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [oppStatuses, setOppStatuses] = useState({});
  const [scanning, setScanning] = useState(false);

  const opportunities = SEED_OPPORTUNITIES.map(o => ({
    ...o,
    status: oppStatuses[o.id] || o.status,
  }));

  const filtered = activeCategory === 'all'
    ? opportunities
    : opportunities.filter(o => o.category === activeCategory);

  const handleStatusChange = (id, status) => {
    setOppStatuses(prev => ({ ...prev, [id]: status }));
    toast({ title: `Opportunity marked as: ${status}` });
  };

  const handleScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 1500));
    setScanning(false);
    toast({ title: 'Opportunity scan complete', description: `${SEED_OPPORTUNITIES.length} opportunities loaded. Agent scanning for new ones.` });
  };

  const urgentCount = opportunities.filter(o => o.deadline !== 'Rolling' && new Date(o.deadline) < new Date(Date.now() + 14 * 86400000)).length;
  const gannonCount = opportunities.filter(o => o.gannon_action).length;
  const newCount = opportunities.filter(o => (oppStatuses[o.id] || o.status) === 'new').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 block">← Dashboard</Link>
          <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-1">AI-Powered Scout</p>
          <h1 className="font-display text-3xl gradient-gold-text">Music Opportunity Bulletin</h1>
        </div>
        <Button onClick={handleScan} disabled={scanning} className="gradient-gold-button border-0 text-xs">
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Scan for Opportunities'}
        </Button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card/40 border border-border/30 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{opportunities.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Total Opportunities</p>
        </div>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{urgentCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Deadline Within 14 Days</p>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-400">{gannonCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Require Your Action</p>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{newCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Not Yet Reviewed</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${activeCategory === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/30 text-muted-foreground border-border/30 hover:border-primary/40 hover:text-foreground'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Opportunities list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No opportunities in this category yet. Click Scan to fetch more.
          </div>
        ) : (
          filtered.map(opp => (
            <OpportunityCard key={opp.id} opp={opp} onStatusChange={handleStatusChange} />
          ))
        )}
      </div>

      {/* Agent note */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-foreground">Agent Scanning</span>
        </div>
        <p className="text-xs text-muted-foreground">
          The Music Orchestrator agent continuously scans for grants, playlist opportunities, radio features, sync licensing calls, competitions, gigs, and artist development programs.
          New opportunities appear here automatically. Items marked "Your Action" require Gannon to personally apply or approve.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Link to="/admin/agent-registry">
            <Button size="sm" variant="outline" className="text-xs h-7 border-border/40">View Agent Registry</Button>
          </Link>
          <Link to="/admin/orchestrator-chat">
            <Button size="sm" variant="outline" className="text-xs h-7 border-blue-500/30 text-blue-400">Chat with Orchestrator</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}