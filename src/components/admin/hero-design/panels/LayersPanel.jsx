import { Copy, Eye, EyeOff, Lock, Trash2, Unlock } from 'lucide-react';

const typeLabel = (el) => {
  if (el.content) return el.content.slice(0, 24);
  if (el.type === 'background') return 'Galaxy background';
  if (el.type === 'ring') return 'Orbit ring';
  if (el.type === 'atmosphere') return el.kind === 'rays' ? 'Light rays' : 'Gold embers';
  if (el.type === 'image') return 'Artwork';
  return el.type;
};

// Layer list for the design: front of the site is top of the list. Each
// row selects, hides, locks, duplicates or deletes its element.
export default function LayersPanel({ elements, selectedId, onSelect, onPatch, onDelete, onDuplicate }) {
  const sorted = [...(elements || [])].sort((a, b) => (b.z || 0) - (a.z || 0));
  const mini = 'w-6 h-6 rounded p-0.5 hover:bg-secondary shrink-0';

  return (
    <div className="space-y-1.5">
      <p className="font-body text-xs text-muted-foreground">
        Top of the list sits in front. Tap a layer to select it on the canvas.
      </p>
      {sorted.map((el) => (
        <div
          key={el.id}
          onClick={() => onSelect(el.id)}
          className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 cursor-pointer ${
            selectedId === el.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
          }`}
        >
          <span className={`flex-1 truncate font-body text-xs ${el.hidden ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {typeLabel(el)}
          </span>
          <button type="button" title={el.hidden ? 'Show' : 'Hide'} onClick={(e) => { e.stopPropagation(); onPatch(el.id, { hidden: !el.hidden }); }} className={mini}>
            {el.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
          <button type="button" title={el.locked ? 'Unlock' : 'Lock in place'} onClick={(e) => { e.stopPropagation(); onPatch(el.id, { locked: !el.locked }); }} className={mini}>
            {el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>
          <button type="button" title="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate(el.id); }} className={mini}>
            <Copy className="w-3 h-3" />
          </button>
          <button type="button" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(el.id); }} className={`${mini} text-destructive`}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}