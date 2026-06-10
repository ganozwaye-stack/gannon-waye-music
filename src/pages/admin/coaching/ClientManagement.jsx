import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Lock, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientManagement() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Client Management</h1>
          <p className="text-sm text-muted-foreground">Draft client dashboard and CRM — not live</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-xs text-red-300/80">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        No clients can register until coaching launch is approved. This is a staging dashboard only.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active Clients', value: 0, color: 'text-green-400' },
          { label: 'Enquiries', value: 0, color: 'text-yellow-400' },
          { label: 'Completed Programs', value: 0, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4" />Client List</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <Users className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No clients yet — coaching not launched</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Clients will appear here once coaching goes live</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Client Intake Form', desc: 'Draft — not active', icon: UserPlus },
          { label: 'Session Notes Template', desc: 'Draft — not active', icon: Users },
          { label: 'Progress Tracker', desc: 'Draft — not active', icon: Users },
          { label: 'Client Portal Preview', desc: 'Admin preview only', icon: Users },
        ].map(item => (
          <Card key={item.label} className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <item.icon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Badge className="ml-auto bg-secondary text-muted-foreground text-[10px]">Draft</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}