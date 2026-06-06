import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Heart, Dumbbell, DollarSign, Sparkles, UserCheck, 
  Plus, Edit, Eye, Trash2, CheckCircle2, Play, BookOpen, Scale
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CoachingPrograms() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('mindset');

  const [modules, setModules] = useState({
    'mindset': {
      title: 'Resilience Mindset Mentor',
      icon: Heart,
      badge: 'Mind & Soul Alignment',
      description: 'Coaching modules focusing on emotional resilience, mental clarity, self-leadership, and somatic grounding.',
      activities: [
        { id: 1, title: 'Daily Mindset Calibration Audit', duration: '15 mins', desc: 'A structured morning scan to check current emotional, mental, and physical states, setting the foundation for daily resilience.' },
        { id: 2, title: 'Somatic Release Breathwork', duration: '20 mins', desc: 'Dynamic breathing exercise designed to release stored emotional blocks and nervous system tension.' },
        { id: 3, title: 'The Soul Alignment Matrix', duration: '30 mins', desc: 'Reflective framework mapping alignment between daily actions and core spiritual values.' }
      ],
      tasks: [
        { id: 1, title: 'Grief Mapping & Release', desc: 'Write down sources of grief, trace where they reside physically in the body, and complete a symbolic release ritual.' },
        { id: 2, title: 'Forgiveness and Integration Ritual', desc: 'Self-forgiveness writing prompt focused on integrating past version lessons.' }
      ]
    },
    'fitness': {
      title: 'Resilience Fitness',
      icon: Dumbbell,
      badge: 'Physical Vitality & PT',
      description: 'Gannon\'s core physical training brand. Structured physical optimization, kinetic movement flows, and nutritional healing.',
      activities: [
        { id: 4, title: 'Circadian Rhythm Sync', duration: '10 mins', desc: 'Protocol for immediate morning sunlight exposure and evening blue-light blockades to reset energy.' },
        { id: 5, title: 'Resilience Kinetic Flow', duration: '30 mins', desc: 'Non-rigid movement and mobility practice tuned directly to current physical energy levels.' },
        { id: 6, title: 'Anti-Inflammatory Vitality Plan', duration: 'Ongoing', desc: 'Whole-food guidelines aimed at gut health, energy restoration, and metabolic recovery.' }
      ],
      tasks: [
        { id: 3, title: 'The Body Appreciation Scan', desc: 'Mindfulness meditation scanning the body, expressing gratitude for its physical survival, strength, and resilience.' },
        { id: 4, title: 'Sleep Environment Overhaul', desc: 'Set up bedroom environment for optimal deep sleep cycles (temperature, dark, silence).' }
      ]
    },
    'planning': {
      title: 'Resilience Planning',
      icon: DollarSign,
      badge: 'Wealth & Abundance Flow',
      description: 'Shifting the relationship with money from scarcity to flow while implementing solid financial and cashflow frameworks.',
      activities: [
        { id: 7, title: 'The Scarcity Narrative Audit', duration: '45 mins', desc: 'Pinpoint inherited scarcity narratives and write down replacement abundance beliefs.' },
        { id: 8, title: 'Value-Aligned Outflow Map', duration: '30 mins', desc: 'Audit expenses to ensure outgoing funds align with true lifestyle values, cutting out vanity drains.' },
        { id: 9, title: 'Automated Wealth Architecture', duration: '60 mins', desc: 'Create friction-free automated savings and investment allocations.' }
      ],
      tasks: [
        { id: 5, title: 'The Scarcity Reframe Journal', desc: 'Reframing "I cannot afford this" into "How can I build the value and capacity to support this?"' },
        { id: 6, title: 'Debt Repayment Integration', desc: 'Reframe debt payments as thank you notes for value already received in the past.' }
      ]
    },
    'intuition': {
      title: 'Resilience Intuitive Guidance',
      icon: Sparkles,
      badge: 'Higher Consciousness',
      description: 'Using oracle tools, intuitive card readings, and energy work to gain clarity and guide decisions.',
      activities: [
        { id: 10, title: '3-Card Intuitive Alignment Spread', duration: '20 mins', desc: 'A standard daily card layout investigating: Past Foundation, Present Reality, Future Alignment.' },
        { id: 11, title: 'Aura & Environment Clearing', duration: '15 mins', desc: 'Using sound frequencies, breath, or sage to clear energy before journaling.' }
      ],
      tasks: [
        { id: 7, title: 'Card Reflection Journaling', desc: 'Draw a single guidance card, sit with the imagery for 5 minutes, and write down immediate intuitive thoughts.' },
        { id: 8, title: 'Trusting the Inner Whisper', desc: 'Keep a daily log of intuitive gut feelings and record the outcome of when they were followed.' }
      ]
    },
    'lived-experience': {
      title: 'Resilience Lived Experience',
      icon: UserCheck,
      badge: 'Authentic Survival',
      description: 'Peer mentorship leveraging Gannon\'s personal journey of overcoming adversity, survival, and authentic rebuilding.',
      activities: [
        { id: 12, title: 'The Adversity Timeline Mapping', duration: '40 mins', desc: 'Map significant life challenges and list the exact character strengths forged through them.' },
        { id: 13, title: 'Protecting the Energetic Reserve', duration: '25 mins', desc: 'Establish clear boundaries and limits to prevent burn-out during recovery stages.' }
      ],
      tasks: [
        { id: 9, title: 'The Arrogance Boundary Audit', desc: 'Reflect on entitlement or arrogance encountered in relationships (themed after Thank You) and define firm personal boundaries.' },
        { id: 10, title: 'Reframing Betrayal & Betrayal Recovery', desc: 'Journaling process to transform the sting of betrayal into fuel for self-empowerment and creative expression (themed after Will You Even Listen).' }
      ]
    }
  });

  const handleSimulateDelivery = (moduleKey, title) => {
    toast({
      title: "Simulation Triggered",
      description: `Simulated delivering activity "${title}" under the Resilience Mentoring brand.`,
    });
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
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Resilience Mentoring Program Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Design modules, activities, and therapeutic tasks under the Resilience Mentoring brand.</p>
        </div>
      </div>

      {/* Program Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(modules).map(([key, mod]) => {
          const Icon = mod.icon;
          return (
            <Card 
              key={key} 
              className={`hover:border-primary/40 cursor-pointer transition-all ${activeTab === key ? 'border-primary/60 bg-primary/5' : 'border-border'}`}
              onClick={() => setActiveTab(key)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={`p-2.5 rounded-full mb-3 ${activeTab === key ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-xs text-foreground line-clamp-1">{mod.title}</p>
                <Badge variant="outline" className="mt-2 text-[10px] scale-95 border-primary/20 text-primary">
                  {mod.badge}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden">
          {Object.keys(modules).map(key => (
            <TabsTrigger key={key} value={key}>{key}</TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(modules).map(([key, mod]) => {
          const Icon = mod.icon;
          return (
            <TabsContent key={key} value={key} className="space-y-6">
              <Card className="border-border bg-card/60 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-display text-foreground">{mod.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1 max-w-2xl">{mod.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-border/30 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activities column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold flex items-center gap-2 text-foreground">
                          <BookOpen className="w-4 h-4 text-primary" /> Active Activities ({mod.activities.length})
                        </h3>
                        <Button size="xs" variant="outline" className="text-xs h-7 gap-1">
                          <Plus className="w-3.5 h-3.5" /> Add
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {mod.activities.map(act => (
                          <div key={act.id} className="bg-secondary/20 rounded-xl p-4 border border-border/30 hover:border-primary/20 transition-all flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold text-sm text-foreground">{act.title}</span>
                                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-[10px] px-1.5 py-0.5">{act.duration}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{act.desc}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/20">
                              <Button 
                                size="xs" 
                                variant="ghost" 
                                className="text-[10px] text-muted-foreground hover:text-foreground h-6 gap-1"
                                onClick={() => handleSimulateDelivery(key, act.title)}
                              >
                                <Play className="w-2.5 h-2.5" /> Client Staging Test
                              </Button>
                              <Button size="xs" variant="ghost" className="text-[10px] h-6 text-muted-foreground hover:text-foreground"><Edit className="w-2.5 h-2.5" /></Button>
                              <Button size="xs" variant="ghost" className="text-[10px] h-6 text-destructive hover:bg-destructive/10"><Trash2 className="w-2.5 h-2.5" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Therapeutic Tasks Column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold flex items-center gap-2 text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> Therapeutic Tasks & Prompts ({mod.tasks.length})
                        </h3>
                        <Button size="xs" variant="outline" className="text-xs h-7 gap-1">
                          <Plus className="w-3.5 h-3.5" /> Add
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {mod.tasks.map(task => (
                          <div key={task.id} className="bg-secondary/20 rounded-xl p-4 border border-border/30 hover:border-primary/20 transition-all flex flex-col justify-between">
                            <div>
                              <span className="font-semibold text-sm text-foreground block mb-1.5">{task.title}</span>
                              <p className="text-xs text-muted-foreground leading-relaxed">{task.desc}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/20">
                              <Button 
                                size="xs" 
                                variant="ghost" 
                                className="text-[10px] text-muted-foreground hover:text-foreground h-6 gap-1"
                                onClick={() => handleSimulateDelivery(key, task.title)}
                              >
                                <Play className="w-2.5 h-2.5" /> Client Staging Test
                              </Button>
                              <Button size="xs" variant="ghost" className="text-[10px] h-6 text-muted-foreground hover:text-foreground"><Edit className="w-2.5 h-2.5" /></Button>
                              <Button size="xs" variant="ghost" className="text-[10px] h-6 text-destructive hover:bg-destructive/10"><Trash2 className="w-2.5 h-2.5" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Holistic Coach Positioning Statement */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h4 className="font-display text-base font-semibold text-primary mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4" /> Resilience Mentoring Legal Position & Scope of Practice
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All Resilience Mentoring frameworks—including **Resilience Mindset**, **Resilience Fitness**, and **Resilience Planning**—are structured for personal growth, accountability, habit-building, physical conditioning, and educational support. This mentoring service is not clinical therapy, psychotherapy, medical treatment, or professional financial advising. Ensure all clients sign the Liability Waiver and Service Agreement before beginning any program.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
