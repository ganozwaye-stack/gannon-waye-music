import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { HERO_DESIGN_DEFAULTS } from '@/lib/heroDesignDefaults';
import HeroDesignPreview from './HeroDesignPreview';
import HeroDesignForm from './HeroDesignForm';

// Loads the live hero design record, edits a draft and saves it. One record
// holds the live values. The public hero reads it, so saving here locks the
// galaxy, ring, sparks, heart and labels in place with no code changes.
export default function HeroDesignEditor() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: records = [] } = useQuery({
    queryKey: ['heroDesignSettings'],
    queryFn: () => base44.entities.HeroDesignSettings.list(),
    initialData: [],
  });
  const { data: releases = [] } = useQuery({
    queryKey: ['hero-design-releases'],
    queryFn: () => base44.entities.Release.list('-release_date', 50),
    initialData: [],
  });

  // The public hero only ever reads the live record. Draft records are the
  // owner's private work. Records without the flag are the original saved
  // design from before drafts existed, and stay live.
  const liveRecord = records.find((r) => r.is_live === true)
    || records.find((r) => r.is_live === undefined)
    || null;
  const draftRecord = records.find((r) => r.is_live === false) || null;
  const [values, setValues] = useState(null);

  useEffect(() => {
    if (!values) setValues({ ...HERO_DESIGN_DEFAULTS, ...(draftRecord || liveRecord || {}) });
  }, [draftRecord, liveRecord, values]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['heroDesignSettings'] });

  // Save keeps the design private. Nothing changes on the site until the
  // owner presses Go Live.
  const saveDraft = useMutation({
    mutationFn: (vals) => draftRecord
      ? base44.entities.HeroDesignSettings.update(draftRecord.id, vals)
      : base44.entities.HeroDesignSettings.create({ ...vals, is_live: false }),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Draft saved. Nothing changes on the site until you press Go Live.' });
    },
  });

  const goLive = useMutation({
    mutationFn: (vals) => liveRecord
      ? base44.entities.HeroDesignSettings.update(liveRecord.id, { ...vals, is_live: true })
      : base44.entities.HeroDesignSettings.create({ ...vals, is_live: true }),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Live. The site now uses this hero design.' });
    },
  });

  if (!values) {
    return <div className="text-center py-12 font-body text-sm text-muted-foreground">Loading hero design...</div>;
  }

  const heroRelease = (values.hero_release_id && releases.find((r) => r.id === values.hero_release_id))
    || releases.find((r) => r.is_current_single === true)
    || null;

  return (
    <div className="space-y-5">
      <HeroDesignPreview settings={values} title={heroRelease?.title || 'Set Free'} />
      <HeroDesignForm
        values={values}
        releases={releases}
        onChange={(key, v) => setValues((prev) => ({ ...prev, [key]: v }))}
      />
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          type="button"
          onClick={() => saveDraft.mutate(values)}
          disabled={saveDraft.isPending}
          className="gradient-gold-button border-0 rounded-full px-6"
        >
          {saveDraft.isPending ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button
          type="button"
          onClick={() => goLive.mutate(values)}
          disabled={goLive.isPending}
          className="rounded-full px-6 bg-green-600 hover:bg-green-700 text-white border-0"
        >
          {goLive.isPending ? 'Going live...' : 'Go Live'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setValues({ ...HERO_DESIGN_DEFAULTS })}
          className="rounded-full border-primary/40 text-primary"
        >
          Reset to defaults
        </Button>
      </div>
      <p className="font-body text-xs text-muted-foreground">
        Save Draft keeps your changes private. The site keeps showing the live design, whatever you change
        here, until you press Go Live.
      </p>
    </div>
  );
}