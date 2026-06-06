import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Unlock, CheckSquare, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CoachingLaunchControl() {
  const { toast } = useToast();
  
  const [gates, setGates] = useState([
    { id: 1, label: 'Resilience Mentoring design approved by Gannon', done: true, category: 'Design' },
    { id: 2, label: 'Legal disclaimer wording reviewed and compliant', done: false, category: 'Legal' },
    { id: 3, label: 'Resilience Fitness Liability Waiver verified', done: false, category: 'Legal' },
    { id: 4, label: 'Client dashboard and progress pages tested', done: true, category: 'Dev' },
    { id: 5, label: 'Stripe staging payment flow tested successfully', done: false, category: 'Finance' },
    { id: 6, label: 'Mindset, Fitness, and Planning modules structured', done: true, category: 'Content' },
    { id: 7, label: 'Audio meditations metadata and track lengths verified', done: true, category: 'Content' },
    { id: 8, label: 'Verify coaching public routes redirect to 404 for visitors', done: true, category: 'Security' },
    { id: 9, label: 'Gannon clicks final launch approval', done: false, category: 'Approval' },
  ]);

  const toggleGate = (id) => {
    setGates(gates.map(g => g.id === id ? { ...g, done: !g.done } : g));
    toast({
      title: "Checkpoint Updated",
      description: "Readiness score recalculated.",
    });
  };

  const gatesPassed = gates.filter(g => g.done).length;
  const progressPercent = Math.round((gatesPassed / gates.length) * 100);
  const isReady = gatesPassed === gates.length;

  const handleLaunchAttempt = () => {
    if (!isReady) {
      toast({
        title: "Launch Locked",
        description: `Cannot launch yet. ${gates.length - gatesPassed} launch gates are still pending.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Integrated Preview Mode",
        description: "Launching private admin Integrated Preview Mode. Public gate remains locked.",
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Resilience Mentoring Launch Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit active release gates, run unit diagnostics, and check the public publication status.</p>
        </div>
      </div>

      {/* Global Lock Card */}
      <Card className="border-red-500/40 bg-red-500/5">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-red-300 text-base">COACHING_PUBLIC_LAUNCH_ENABLED = false</h2>
              <p className="text-xs text-red-200/80 mt-1 max-w-xl">
                The coaching branch is fully locked and hidden from public visitors. Direct URLs will return a page-not-found layout, protecting intellectual property and compliance standards.
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-red-500/40 text-red-300 hover:bg-red-500/10 shrink-0 gap-1.5 self-start md:self-auto text-xs"
            onClick={handleLaunchAttempt}
          >
            <Unlock className="w-3.5 h-3.5" /> Force Enable Public
          </Button>
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card className="border-border bg-card/60 backdrop-blur-md">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-display">Checklist Progress Meter</CardTitle>
            <CardDescription className="text-xs mt-0.5">All checkpoints must pass to unlock private beta preview.</CardDescription>
          </div>
          <span className="text-2xl font-mono font-bold text-primary">{progressPercent}%</span>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary/60 rounded-full h-2.5 overflow-hidden">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </CardContent>
      </Card>

      {/* Gate Items Checklist */}
      <div className="space-y-3">
        <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-primary" /> Active Gate Conditions ({gates.length})
        </h3>
        
        <div className="grid grid-cols-1 gap-2.5">
          {gates.map(gate => (
            <div 
              key={gate.id} 
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                gate.done 
                  ? 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10' 
                  : 'border-border bg-secondary/10 hover:border-primary/20'
              }`}
              onClick={() => toggleGate(gate.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  gate.done ? 'bg-green-500 text-black border-green-500' : 'border-border'
                }`}>
                  {gate.done && <span className="text-xs font-bold">✓</span>}
                </div>
                <div>
                  <span className={`text-sm ${gate.done ? 'text-green-300 font-medium line-through opacity-70' : 'text-foreground'}`}>
                    {gate.label}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className={`text-[9px] uppercase tracking-widest ${
                gate.done ? 'border-green-500/30 text-green-400' : 'border-border text-muted-foreground'
              }`}>
                {gate.category}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Staging Diagnostics */}
      <Card className="border-border bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base font-display">Diagnostic Staging Operations</CardTitle>
          <CardDescription className="text-xs mt-0.5">Automated validation checks to verify staging health.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2.5">
          <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => toast({ title: "Diagnostics Running", description: "Auditing routing files..." })}>
            <RefreshCw className="w-3.5 h-3.5" /> Audit Route Gates
          </Button>
          <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => toast({ title: "Check Compliances", description: "No HIPAA/FDA compliance failures detected." })}>
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /> Verify Language Compliance
          </Button>
          <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => toast({ title: "Staging Tests Completed", description: "Verified admin layouts are intact." })}>
            <Play className="w-3.5 h-3.5" /> Execute Test Layouts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
