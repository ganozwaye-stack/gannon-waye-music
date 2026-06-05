import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, Layout, ShoppingCart, Calendar, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, RefreshCw, Send, Star, Zap
} from 'lucide-react';

export default function SystemsManagerOffer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    business_type: 'creator',
    problem: '',
    budget_range: '$1k - $3k',
    urgency: 'medium',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.problem) {
      toast({ title: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await base44.entities.SystemsManagerLead.create({
        ...form,
        proposal_status: 'received',
      });
      toast({ title: 'Request Submitted!', description: "Gannon will review your systems request and get back to you shortly." });
      setForm({
        name: '',
        email: '',
        business_type: 'creator',
        problem: '',
        budget_range: '$1k - $3k',
        urgency: 'medium',
      });
    } catch (e) {
      toast({ title: 'Submission failed', description: 'Could not connect to database. Please check connection.', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary"
        >
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Systems Manager
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-white"
        >
          AI-Powered Systems for <span className="gradient-gold-text">Creators, Artists, & Small Businesses</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto font-body"
        >
          I build cinematic web designs, automated social post workflows, dropshipping inventories, and central dashboard control panels so you can scale operations with ease.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3 pt-4"
        >
          <a href="#build-form">
            <Button className="gradient-gold-button border-0 px-6 py-5 text-sm font-semibold rounded-full gap-2">
              Book a Systems Audit <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </motion.div>
      </div>

      {/* What I Build */}
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">What I Build & Automate</h2>
          <p className="text-sm text-muted-foreground font-body">Custom developer services tailored exactly to your operation specs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Cinematic Websites', desc: 'Premium responsive frontends matching clean visual guidelines, parallax, and particles.', icon: Layout },
            { title: 'E-commerce & Merch Stores', desc: 'Stripe integrations, shopping carts, promo structures, and inventory tracking panels.', icon: ShoppingCart },
            { title: 'Approval Workflows', desc: 'Content validator filters matching brand guidelines, spell checks, and social queue scheduling.', icon: ShieldCheck }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-border/40 bg-secondary/15">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-base text-white">{item.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1 font-body">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Build Packages */}
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Predefined Build Packages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Creator Launch System', price: '$1,500', desc: 'Premium cinematic landing page, newsletter integration, and custom CRM dashboard.' },
            { title: 'E-commerce Setup', price: '$2,900', desc: 'Merchandise store, landed margin calculators, and Stripe API configurations.' },
            { title: 'Systems Manager Retainer', price: '$800/mo', desc: 'Ongoing diagnostic audit, Playwright script checks, and code maintenance.' }
          ].map(pack => (
            <Card key={pack.title} className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent flex flex-col justify-between">
              <CardHeader>
                <Badge className="bg-primary/20 text-primary self-start border border-primary/30 text-[10px] mb-2">Package</Badge>
                <CardTitle className="text-base text-white">{pack.title}</CardTitle>
                <CardDescription className="text-2xl font-bold text-primary mt-2">{pack.price} AUD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground font-body">{pack.desc}</p>
                <a href="#build-form" className="block">
                  <Button variant="outline" className="w-full text-xs border-border/40 hover:border-primary/40">Request Build</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Case Study Proof Vault */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Proof of Architecture</h2>
          <p className="text-sm text-muted-foreground font-body">Recent production systems built and managed by me.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="border-border/40 bg-secondary/15">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                Gannon Waye Music OS <Star className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-body">A complete artist platform handling releases, mailing list campaigns, fan CRM profiles, and Stripe support tipping checkouts.</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-secondary/15">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                GanozMix Direct dropshipping <Zap className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-body">Automated sourcing bridge combining eBay developer credentials, AliExpress supply lines, and profit margin calculators.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lead Form */}
      <div id="build-form" className="max-w-xl mx-auto">
        <Card className="border-primary/30 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl text-white">Book a Systems Audit</CardTitle>
            <CardDescription className="text-xs">Describe your current business bottlenecks and I will model a custom automation script.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-white">Your Name *</Label>
                <Input 
                  id="name" 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="John Doe" 
                  className="bg-secondary/40 text-xs border-border/40" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-white">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={form.email} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                  placeholder="john@example.com" 
                  className="bg-secondary/40 text-xs border-border/40" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="business_type" className="text-xs text-white">Business Type</Label>
                <Select value={form.business_type} onValueChange={v => setForm(f => ({ ...f, business_type: v }))}>
                  <SelectTrigger className="bg-secondary/40 border-border/40 text-xs text-left"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creator">Content Creator / Artist</SelectItem>
                    <SelectItem value="ecommerce">E-commerce / Merch Seller</SelectItem>
                    <SelectItem value="agency">Service Agency / Consulting</SelectItem>
                    <SelectItem value="other">Other Small Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="budget" className="text-xs text-white">Project Budget AUD</Label>
                <Select value={form.budget_range} onValueChange={v => setForm(f => ({ ...f, budget_range: v }))}>
                  <SelectTrigger className="bg-secondary/40 border-border/40 text-xs text-left"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_1k">Under $1k</SelectItem>
                    <SelectItem value="$1k - $3k">$1k - $3k</SelectItem>
                    <SelectItem value="$3k - $5k">$3k - $5k</SelectItem>
                    <SelectItem value="above_5k">$5k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="urgency" className="text-xs text-white">Urgency Level</Label>
                <Select value={form.urgency} onValueChange={v => setForm(f => ({ ...f, urgency: v }))}>
                  <SelectTrigger className="bg-secondary/40 border-border/40 text-xs text-left"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Flexible Timing</SelectItem>
                    <SelectItem value="medium">Next 2-4 Weeks</SelectItem>
                    <SelectItem value="high">Urgent Build Need</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="problem" className="text-xs text-white">What is your current operational bottleneck? *</Label>
                <Textarea 
                  id="problem" 
                  value={form.problem} 
                  onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} 
                  placeholder="e.g. Sourcing products takes 3 hours a day, or I have no central database to approve video scripts..." 
                  rows={4}
                  className="bg-secondary/40 text-xs border-border/40" 
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full gradient-gold-button border-0 text-xs gap-1.5 py-5 font-semibold">
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Book Systems Audit</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}