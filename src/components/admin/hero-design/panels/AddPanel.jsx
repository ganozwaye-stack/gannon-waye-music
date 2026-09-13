import { Circle, MousePointerClick, Sparkles, Sun } from 'lucide-react';
import { makeElement } from '@/lib/heroElements';

const ADDS = [
  { label: 'Orbit ring', icon: Circle, make: () => makeElement('ring') },
  { label: 'Gold embers', icon: Sparkles, make: () => makeElement('atmosphere', { kind: 'embers' }) },
  { label: 'Light rays', icon: Sun, make: () => makeElement('atmosphere', { kind: 'rays' }) },
  { label: 'Gold button', icon: MousePointerClick, make: () => makeElement('button') },
  {
    label: 'Outline button', icon: MousePointerClick,
    make: () => makeElement('button', { kind: 'outline', content: 'Hear the Music', link: '/music' }),
  },
];

export default function AddPanel({ onAdd }) {
  return (
    <div className="space-y-2">
      <p className="font-body text-xs text-muted-foreground">
        Add more layers. Everything can be dragged, resized, rotated, recoloured and deleted right on the canvas.
      </p>
      {ADDS.map((a) => (
        <button
          key={a.label}
          type="button"
          onClick={() => onAdd(a.make())}
          className="w-full flex items-center gap-2 rounded-lg border border-border bg-card hover:border-primary/50 px-3 py-2.5 transition-colors"
        >
          <a.icon className="w-4 h-4 text-primary" />
          <span className="font-body text-xs text-foreground">{a.label}</span>
        </button>
      ))}
    </div>
  );
}