import { CheckCircle2, Circle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const statusConfig = {
  active: { icon: <Circle className="w-5 h-5 text-primary" />, border: 'border-primary/40', bg: 'bg-primary/5' },
  done: { icon: <CheckCircle2 className="w-5 h-5 text-green-400" />, border: 'border-green-500/30', bg: 'bg-green-500/5' },
  error: { icon: <XCircle className="w-5 h-5 text-red-400" />, border: 'border-red-500/30', bg: 'bg-red-500/5' },
  waiting: { icon: <Clock className="w-5 h-5 text-amber-400" />, border: 'border-amber-500/30', bg: 'bg-amber-500/5' },
  skipped: { icon: <AlertTriangle className="w-5 h-5 text-muted-foreground" />, border: 'border-border', bg: 'bg-muted/20' },
};

export default function StepBlock({ number, title, status = 'active', why, children }) {
  const cfg = statusConfig[status] || statusConfig.active;
  return (
    <div className={`rounded-xl border p-4 ${cfg.border} ${cfg.bg}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary text-xs font-bold text-foreground shrink-0 mt-0.5">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            {cfg.icon}
          </div>
          {why && <p className="text-xs text-muted-foreground mt-0.5 italic">Why: {why}</p>}
        </div>
      </div>
      <div className="ml-10">{children}</div>
    </div>
  );
}