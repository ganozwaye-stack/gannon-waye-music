// @ts-nocheck
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, Database, Code, Puzzle, Key, ExternalLink } from 'lucide-react';

const REGISTRIES = [
  { name: 'Route Registry', path: '/admin/route-registry', icon: GitBranch, desc: 'All app routes and navigation', status: 'pending' },
  { name: 'Component Registry', path: '/admin/component-registry', icon: Puzzle, desc: 'Reusable UI components', status: 'pending' },
  { name: 'Function Registry', path: '/admin/function-registry', icon: Code, desc: 'Backend functions inventory', status: 'pending' },
  { name: 'Entity Registry', path: '/admin/entity-registry', icon: Database, desc: 'Database entities and schemas', status: 'pending' },
  { name: 'Security & Secret Registry', path: '/admin/security-secret-registry', icon: Key, desc: 'API keys, tokens, credentials', status: 'pending' },
];

export default function OperationRegistry() {
  const { data: functions = [] } = useQuery({
    queryKey: ['backend-functions'],
    queryFn: () => base44.functions.list(),
  });

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Operation Registry</h1>
        <p className="text-muted-foreground text-sm mt-1">Central registry of all system operations, routes, components, functions, entities, and secrets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REGISTRIES.map(reg => (
          <Card key={reg.name}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg"><reg.icon className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="font-semibold text-sm">{reg.name}</p>
                    <p className="text-xs text-muted-foreground">{reg.desc}</p>
                  </div>
                </div>
                <Badge variant={reg.status === 'pending' ? 'outline' : 'default'}>{reg.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Code className="w-4 h-4 text-primary" /> Backend Functions ({functions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {functions.map(fn => (
            <div key={fn} className="flex items-center justify-between border border-border rounded-lg p-2">
              <code className="text-sm font-mono">{fn}</code>
              <Button size="sm" variant="ghost" className="text-xs h-6">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}