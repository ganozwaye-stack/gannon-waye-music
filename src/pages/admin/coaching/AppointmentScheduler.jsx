import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Lock, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppointmentScheduler() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Session Scheduler</h1>
          <p className="text-sm text-muted-foreground">Draft booking system — not live</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-xs text-red-300/80">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        Booking system is in draft. No clients can book sessions until coaching launches officially.
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Upcoming Sessions</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <Calendar className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No sessions scheduled</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Sessions will appear here once coaching is live</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Availability Settings', desc: 'Set your coaching hours', status: 'Not configured' },
          { label: 'Session Types', desc: 'Define session durations and formats', status: 'Draft' },
          { label: 'Buffer Time Rules', desc: 'Time between sessions', status: 'Not configured' },
          { label: 'Booking Link', desc: 'Public booking URL — locked until launch', status: 'Locked' },
          { label: 'Cancellation Rules', desc: 'Linked to Cancellation Policy document', status: 'Draft' },
          { label: 'Reminder Emails', desc: 'Automated session reminders', status: 'Not configured' },
        ].map(item => (
          <Card key={item.label} className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <Badge className="bg-secondary text-muted-foreground text-[10px] shrink-0">{item.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}