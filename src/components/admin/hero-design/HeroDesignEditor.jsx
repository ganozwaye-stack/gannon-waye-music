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

  const liveRecord = records[0] || null;
  const [values, setValues] = useState(null);

  useEffect(() => {
    if (!values) setValues({ ...HERO_DESIGN_DEFAULTS, ...(liveRecord || {}) });
  }, [liveRecord, values]);

  const save = useMutation({
    mutationFn: (vals) => liveRecord
      ? base44.entities.HeroDesignSettings.update(liveRecord.id, vals)
      : base44.entities.HeroDesignSettings.create(vals),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['heroDesignSettings'] });
      toast({ title: 'Hero design saved. These values are now locked in and live.' });
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
          onClick={() => save.mutate(values)}
          disabled={save.isPending}
          className="gradient-gold-button border-0 rounded-full px-6"
        >
          {save.isPending ? 'Saving...' : 'Save and make live'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setValues({ ...HERO_DESIGN_DEFAULTS })}
          className="rounded-full border-primary/40 text-primary"
        >
          Reset to defaults
        </Button>
        <span className="font-body text-xs text-muted-foreground">
          {liveRecord
            ? 'A saved design is live on the site right now.'
            : 'No saved design yet. The site is using the built-in defaults.'}
        </span>
      </div>
    </div>
  );
}