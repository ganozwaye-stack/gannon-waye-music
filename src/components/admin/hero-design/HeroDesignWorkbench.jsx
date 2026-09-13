import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Layers, Shapes, Type as TypeIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import HeroCanvas from './canvas/HeroCanvas';
import UploadsPanel from './panels/UploadsPanel';
import TextPanel from './panels/TextPanel';
import AddPanel from './panels/AddPanel';
import LayersPanel from './panels/LayersPanel';
import PropertiesPanel from './panels/PropertiesPanel';
import { buildStandardHero, makeElement, uid } from '@/lib/heroElements';
import { HERO_HEART_ART } from '@/lib/heroDesignDefaults';

const TOOLS = [
  { id: 'uploads', label: 'Uploads', icon: ImagePlus },
  { id: 'text', label: 'Text', icon: TypeIcon },
  { id: 'add', label: 'Add', icon: Shapes },
  { id: 'layers', label: 'Layers', icon: Layers },
];

// CapCut-style hero canvas: tools as small thumbnails down the left side,
// the design surface in the middle, properties on the right. Everything is
// drag, resize, rotate, restyle, duplicate and delete right on the canvas.
// Save Draft keeps it private, Go Live publishes it, same rules as the
// Fine Sliders tab.
export default function HeroDesignWorkbench() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { isLoading, data: records = [] } = useQuery({
    queryKey: ['heroDesignSettings'],
    queryFn: () => base44.entities.HeroDesignSettings.list(),
    initialData: [],
  });
  const liveRecord = records.find((r) => r.is_live === true)
    || records.find((r) => r.is_live === undefined)
    || null;
  const draftRecord = records.find((r) => r.is_live === false) || null;

  const [elements, setElements] = useState(undefined);
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState('uploads');

  useEffect(() => {
    if (elements !== undefined || isLoading) return;
    const source = draftRecord?.elements?.length ? draftRecord : liveRecord?.elements?.length ? liveRecord : null;
    setElements(source ? source.elements.map((el) => ({ ...el })) : []);
  }, [isLoading, draftRecord, liveRecord, elements]);

  const patchElement = (id, patch) => setElements((els) => els.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const addElement = (el) => {
    const zTop = (elements || []).reduce((m, e) => Math.max(m, e.z || 0), 0) + 1;
    const next = { ...el, z: el.type === 'background' ? 0 : zTop };
    setElements((els) => [...(els || []), next]);
    setSelectedId(next.id);
  };

  const removeElement = (id) => {
    setElements((els) => els.filter((e) => e.id !== id));
    setSelectedId((s) => (s === id ? null : s));
  };

  const duplicateElement = (id) => {
    const src = (elements || []).find((e) => e.id === id);
    if (!src) return;
    const zTop = (elements || []).reduce((m, e) => Math.max(m, e.z || 0), 0) + 1;
    const copy = { ...src, id: uid(), z: zTop, x_pct: (src.x_pct || 50) + 3, y_pct: (src.y_pct || 50) + 3 };
    setElements((els) => [...els, copy]);
    setSelectedId(copy.id);
  };

  const moveZ = (id, delta) => setElements((els) => els.map((e) => (
    e.id === id ? { ...e, z: Math.max(0, (e.z || 0) + delta) } : e
  )));

  const setBackground = (url) => {
    const bg = (elements || []).find((e) => e.type === 'background');
    if (bg) patchElement(bg.id, { image_url: url });
    else addElement(makeElement('background', { image_url: url, z: 0 }));
    toast({ title: 'Background set. It is full-bleed with over-scan, so no edge can ever show.' });
  };

  const insertStandard = () => {
    setElements(buildStandardHero(HERO_HEART_ART));
    setSelectedId(null);
  };

  const invalidate = () => qc.invalidateQueries({ queryKey: ['heroDesignSettings'] });

  const saveDraft = useMutation({
    mutationFn: (els) => draftRecord
      ? base44.entities.HeroDesignSettings.update(draftRecord.id, { elements: els })
      : base44.entities.HeroDesignSettings.create({ elements: els, is_live: false }),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Draft saved. Nothing changes on the site until you press Go Live.' });
    },
  });

  const goLive = useMutation({
    mutationFn: (els) => liveRecord
      ? base44.entities.HeroDesignSettings.update(liveRecord.id, { elements: els, is_live: true })
      : base44.entities.HeroDesignSettings.create({ elements: els, is_live: true }),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Live. The site now uses this hero design.' });
    },
  });

  // Delete key removes the selected element unless typing in a field.
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        removeElement(selectedId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, elements]);

  const selected = (elements || []).find((e) => e.id === selectedId) || null;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden h-[80vh] min-h-[560px]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border flex-wrap">
        <div>
          <h2 className="font-body text-sm font-semibold text-foreground">Canvas Studio</h2>
          <p className="font-body text-[11px] text-muted-foreground">
            Drag, resize and rotate anything right on the design. Save Draft keeps it private until you press Go Live.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(elements || []).length === 0 && (
            <Button type="button" variant="outline" onClick={insertStandard} className="rounded-full border-primary/40 text-primary">
              Insert standard hero layout
            </Button>
          )}
          <Button
            type="button"
            onClick={() => saveDraft.mutate(elements)}
            disabled={saveDraft.isPending || elements === undefined}
            className="gradient-gold-button border-0 rounded-full"
          >
            {saveDraft.isPending ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            type="button"
            onClick={() => goLive.mutate(elements)}
            disabled={goLive.isPending || elements === undefined}
            className="rounded-full bg-green-600 hover:bg-green-700 text-white border-0"
          >
            {goLive.isPending ? 'Going live...' : 'Go Live'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-14 shrink-0 border-r border-border flex flex-col items-center py-2 gap-1.5">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(tool === t.id ? null : t.id)}
              title={t.label}
              className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center gap-0.5 border transition-colors ${
                tool === t.id
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="font-body text-[8px] uppercase tracking-wide">{t.label}</span>
            </button>
          ))}
        </div>

        {tool && (
          <div className="w-60 shrink-0 border-r border-border overflow-y-auto p-3">
            {tool === 'uploads' && <UploadsPanel onAdd={addElement} onSetBackground={setBackground} />}
            {tool === 'text' && <TextPanel onAdd={addElement} />}
            {tool === 'add' && <AddPanel onAdd={addElement} />}
            {tool === 'layers' && (
              <LayersPanel
                elements={elements || []}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onPatch={patchElement}
                onDelete={removeElement}
                onDuplicate={duplicateElement}
              />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0 overflow-auto p-4 bg-black/40">
          {elements === undefined ? (
            <p className="text-center py-12 font-body text-xs text-muted-foreground">Loading your design...</p>
          ) : (
            <HeroCanvas elements={elements} selectedId={selectedId} onSelect={setSelectedId} onChange={patchElement} />
          )}
        </div>

        <div className="w-72 shrink-0 border-l border-border overflow-y-auto p-3">
          <PropertiesPanel el={selected} onChange={patchElement} onDelete={removeElement} onDuplicate={duplicateElement} onZ={moveZ} />
        </div>
      </div>
    </div>
  );
}