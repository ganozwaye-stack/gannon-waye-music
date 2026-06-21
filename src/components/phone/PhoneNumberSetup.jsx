import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Phone, Eye, EyeOff, CheckCircle, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PhoneNumberSetup({ primaryNumber }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const qc = useQueryClient();

  const update = useMutation({
    mutationFn: (data) => base44.entities.BusinessPhoneNumber.update(primaryNumber.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['businessPhoneNumbers'] }); setEditing(false); },
  });

  const startEdit = () => {
    setForm({ ...primaryNumber });
    setEditing(true);
  };

  if (!primaryNumber) {
    return <div className="text-center py-16 text-muted-foreground font-body text-sm">No phone number record found.</div>;
  }

  const n = editing ? form : primaryNumber;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const STATUS_COLOR = {
    provider_needed: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
    pending_setup: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    active: 'text-green-400 border-green-500/40 bg-green-500/10',
    suspended: 'text-red-400 border-red-500/40 bg-red-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Main number card */}
      <div className="bg-card/60 border border-border/50 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary/70" />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground">{primaryNumber.display_name}</h2>
              <p className="font-body text-xs text-muted-foreground">{primaryNumber.purpose}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-body text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border ${STATUS_COLOR[primaryNumber.status] || 'text-muted-foreground'}`}>
              {primaryNumber.status?.replace(/_/g, ' ')}
            </span>
            {!editing && (
              <Button size="sm" variant="outline" onClick={startEdit} className="h-7 text-xs gap-1">
                <Edit2 className="w-3 h-3" /> Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Phone Number', key: 'phone_number', placeholder: 'Not assigned yet — provider needed' },
            { label: 'Forwarding Destination', key: 'forwarding_destination', placeholder: 'Add your mobile number here' },
            { label: 'Business Hours', key: 'business_hours', placeholder: 'e.g. Mon–Fri 9am–5pm AEST' },
          ].map(field => (
            <div key={field.key}>
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{field.label}</p>
              {editing ? (
                <input
                  className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
                  value={n[field.key] || ''}
                  onChange={e => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              ) : (
                <p className="font-body text-sm text-foreground/70">{primaryNumber[field.key] || <span className="text-muted-foreground/50 italic">{field.placeholder}</span>}</p>
              )}
            </div>
          ))}

          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Public Visibility</p>
            {editing ? (
              <select
                className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none"
                value={n.public_visibility}
                onChange={e => set('public_visibility', e.target.value)}
              >
                <option value="hidden">Hidden — not shown on site</option>
                <option value="visible">Visible — shown on site</option>
              </select>
            ) : (
              <div className="flex items-center gap-2">
                {primaryNumber.public_visibility === 'hidden'
                  ? <><EyeOff className="w-3.5 h-3.5 text-yellow-400" /><span className="font-body text-sm text-yellow-400">Hidden — not shown on site</span></>
                  : <><Eye className="w-3.5 h-3.5 text-green-400" /><span className="font-body text-sm text-green-400">Visible on site</span></>
                }
              </div>
            )}
          </div>
        </div>

        {/* Voicemail script */}
        <div className="mt-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Voicemail Script (Draft)</p>
          {editing ? (
            <textarea
              className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40 min-h-[80px]"
              value={n.voicemail_script || ''}
              onChange={e => set('voicemail_script', e.target.value)}
            />
          ) : (
            <p className="font-body text-sm text-foreground/60 bg-secondary/30 rounded-lg p-3 leading-relaxed">{primaryNumber.voicemail_script}</p>
          )}
        </div>

        {/* Auto reply draft */}
        <div className="mt-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Auto Reply SMS (Draft — Not Active)</p>
          {editing ? (
            <textarea
              className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40 min-h-[60px]"
              value={n.auto_reply_draft || ''}
              onChange={e => set('auto_reply_draft', e.target.value)}
            />
          ) : (
            <p className="font-body text-sm text-foreground/60 bg-secondary/30 rounded-lg p-3 leading-relaxed">{primaryNumber.auto_reply_draft}</p>
          )}
        </div>

        {editing && (
          <div className="flex gap-2 mt-5">
            <Button size="sm" onClick={() => update.mutate(form)} disabled={update.isPending} className="gap-1.5 text-xs">
              <Save className="w-3 h-3" /> {update.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="gap-1.5 text-xs">
              <X className="w-3 h-3" /> Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Approval status */}
      <div className="bg-card/40 border border-border/30 rounded-xl p-5">
        <p className="font-body text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400" /> Approval Status
        </p>
        <div className="space-y-2">
          {[
            { label: 'Provider selected', done: primaryNumber.provider !== 'not_selected' },
            { label: 'Forwarding number added', done: !!primaryNumber.forwarding_destination && !primaryNumber.forwarding_destination.startsWith('To be') },
            { label: 'Business hours confirmed', done: !!primaryNumber.business_hours && !primaryNumber.business_hours.startsWith('To be') },
            { label: 'Voicemail script finalised', done: primaryNumber.voicemail_script && !primaryNumber.voicemail_script.startsWith('DRAFT') },
            { label: 'Gannon approved go-live', done: primaryNumber.approved },
            { label: 'Number made public', done: primaryNumber.public_visibility === 'visible' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              {item.done
                ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                : <AlertCircle className="w-3.5 h-3.5 text-yellow-500/60 shrink-0" />
              }
              <span className={`font-body text-xs ${item.done ? 'text-foreground/70' : 'text-muted-foreground'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}