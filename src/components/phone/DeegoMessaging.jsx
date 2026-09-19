import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Bot,
  CheckCircle2,
  LockKeyhole,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react';

function makeRequestId(prefix = 'message-send') {
  if (globalThis.crypto?.randomUUID) return prefix + ':' + globalThis.crypto.randomUUID();
  return prefix + ':' + Date.now().toString(36) + ':' + Math.random().toString(36).slice(2, 12);
}

const CHANNEL_LABEL = {
  telegram_owner: 'Deego Telegram',
  sms_fan: 'Fan SMS',
};

function readiness(config) {
  return Boolean(
    config
    && config.status === 'ready'
    && config.send_enabled === true
    && config.credentials_configured === true
    && config.destination_configured === true,
  );
}

export default function DeegoMessaging() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [busyId, setBusyId] = useState('');
  const [previewById, setPreviewById] = useState({});

  const { data: configs = [], isLoading: configsLoading } = useQuery({
    queryKey: ['messagingChannelConfigs'],
    queryFn: () => base44.entities.MessagingChannelConfig.list('-created_date'),
  });

  const { data: drafts = [], isLoading: draftsLoading } = useQuery({
    queryKey: ['outboundMessageDrafts'],
    queryFn: () => base44.entities.OutboundMessageDraft.list('-created_date'),
  });

  const { data: consents = [] } = useQuery({
    queryKey: ['fanMessagingConsents'],
    queryFn: () => base44.entities.FanMessagingConsent.list('-created_date'),
  });

  const latestConfig = useMemo(() => {
    const map = {};
    for (const config of configs) {
      if (!map[config.channel_key]) map[config.channel_key] = config;
    }
    return map;
  }, [configs]);

  const optedInCount = useMemo(() => {
    const unique = new Set();
    for (const consent of consents) {
      if (consent.channel === 'sms' && consent.consent_status === 'opted_in' && consent.phone_number) {
        unique.add(consent.phone_number);
      }
    }
    return unique.size;
  }, [consents]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['messagingChannelConfigs'] });
    qc.invalidateQueries({ queryKey: ['outboundMessageDrafts'] });
    qc.invalidateQueries({ queryKey: ['fanMessagingConsents'] });
  };

  const preview = async (draft) => {
    setBusyId(draft.id + ':preview');
    try {
      const res = await base44.functions.invoke('previewOutboundMessageApproval', { draft_id: draft.id });
      const data = res?.data || res || {};
      setPreviewById(current => ({ ...current, [draft.id]: data }));
      toast({
        title: 'Approval preview ready',
        description: 'No communication was distributed.',
      });
    } catch (error) {
      toast({
        title: 'Could not preview',
        description: error?.response?.data?.error || error.message,
        variant: 'destructive',
      });
    } finally {
      setBusyId('');
    }
  };

  const approve = async (draft) => {
    let p = previewById[draft.id];
    if (!p) {
      try {
        const res = await base44.functions.invoke('previewOutboundMessageApproval', { draft_id: draft.id });
        p = res?.data || res || {};
        setPreviewById(current => ({ ...current, [draft.id]: p }));
      } catch (error) {
        toast({
          title: 'Could not prepare approval',
          description: error?.response?.data?.error || error.message,
          variant: 'destructive',
        });
        return;
      }
    }

    if (p.compliance_errors?.length) {
      toast({
        title: 'Approval blocked',
        description: p.compliance_errors.join(' '),
        variant: 'destructive',
      });
      return;
    }

    const phrase = window.prompt(
      'Review the exact communication below before approving distribution. Type exactly:\n\n'
      + p.required_approval_phrase
      + '\n\nMESSAGE\n'
      + String(p.body || '')
      + '\n\nAUDIENCE\n'
      + String(p.audience_description || p.recipient_ref || p.recipient_scope || ''),
    );

    if (phrase !== p.required_approval_phrase) {
      if (phrase !== null) {
        toast({
          title: 'Nothing approved',
          description: 'The approval phrase did not match.',
          variant: 'destructive',
        });
      }
      return;
    }

    setBusyId(draft.id + ':approve');
    try {
      await base44.functions.invoke('approveOutboundMessage', {
        draft_id: draft.id,
        confirm_content_fingerprint: p.content_fingerprint,
        confirm_approval_phrase: phrase,
      });
      toast({
        title: 'Exact communication approved',
        description: 'Approval was recorded. Approval alone did not distribute the message.',
      });
      setPreviewById(current => {
        const next = { ...current };
        delete next[draft.id];
        return next;
      });
      refresh();
    } catch (error) {
      toast({
        title: 'Approval not recorded',
        description: error?.response?.data?.error || error.message,
        variant: 'destructive',
      });
    } finally {
      setBusyId('');
    }
  };

  const distribute = async (draft) => {
    const config = latestConfig[draft.channel];
    if (!readiness(config)) {
      toast({
        title: 'Channel not connected',
        description: draft.channel === 'telegram_owner'
          ? 'The Deego Telegram bot and owner chat still need secure credentials and a verified connection.'
          : 'The SMS provider and business number still need secure credentials and a verified connection.',
        variant: 'destructive',
      });
      return;
    }

    const phrase = 'DISTRIBUTE ' + draft.id;
    const typed = window.prompt(
      'This will use the external provider for an already approved communication. Type exactly: ' + phrase,
    );
    if (typed !== phrase) {
      if (typed !== null) toast({ title: 'Nothing distributed', description: 'Confirmation did not match.' });
      return;
    }

    setBusyId(draft.id + ':send');
    try {
      const fn = draft.channel === 'telegram_owner' ? 'deegoTelegram' : 'sendApprovedFanSms';
      const res = await base44.functions.invoke(fn, {
        draft_id: draft.id,
        send_request_id: makeRequestId(draft.channel),
      });
      const data = res?.data || res || {};
      toast({
        title: data.sent ? 'Provider request completed' : 'No distribution',
        description: data.provider_message_id
          ? 'Provider message ID: ' + data.provider_message_id
          : data.accepted_count !== undefined
            ? String(data.accepted_count) + ' SMS accepted, ' + String(data.failed_count || 0) + ' failed.'
            : data.reason || 'Check delivery receipts for the verified result.',
      });
      refresh();
    } catch (error) {
      toast({
        title: 'Distribution did not complete',
        description: error?.response?.data?.error || error.message,
        variant: 'destructive',
      });
      refresh();
    } finally {
      setBusyId('');
    }
  };

  const channelCards = [
    {
      key: 'telegram_owner',
      icon: Bot,
      name: 'Deego Telegram',
      detail: 'Private owner channel for Deego briefs and approved owner messages.',
    },
    {
      key: 'sms_fan',
      icon: MessageSquare,
      name: 'Fan SMS',
      detail: 'Only explicit SMS opt-ins. STOP suppression is enforced separately from email consent.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-body text-xs font-semibold text-primary">Owner approval controls distribution</p>
            <p className="font-body text-xs text-primary/70 mt-1 leading-relaxed">
              Deego may prepare communication. No Telegram or fan SMS distribution is allowed until you approve the exact content,
              channel and recipient or audience. Fan SMS also requires explicit active SMS consent.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {channelCards.map(item => {
          const config = latestConfig[item.key];
          const ready = readiness(config);
          const Icon = item.icon;
          return (
            <div key={item.key} className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-lg text-foreground">{item.name}</h3>
                </div>
                <span className={'text-[9px] uppercase tracking-widest rounded-full border px-2.5 py-1 '
                  + (ready
                    ? 'border-emerald-500/40 text-emerald-400'
                    : 'border-amber-500/40 text-amber-300')}>
                  {ready ? 'Ready' : (config?.status || 'Not configured')}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-2">{item.detail}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-body">
                <div className="rounded-lg bg-secondary/40 p-2">
                  <p className="text-muted-foreground">Credentials</p>
                  <p className="text-foreground mt-0.5">{config?.credentials_configured ? 'Configured' : 'Needed'}</p>
                </div>
                <div className="rounded-lg bg-secondary/40 p-2">
                  <p className="text-muted-foreground">Destination</p>
                  <p className="text-foreground mt-0.5">{config?.destination_configured ? 'Configured' : 'Needed'}</p>
                </div>
              </div>
              {item.key === 'sms_fan' && (
                <p className="font-body text-xs text-foreground/70 mt-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  {optedInCount} explicit SMS opt-in{optedInCount === 1 ? '' : 's'}
                </p>
              )}
              {!ready && (
                <p className="font-body text-[10px] text-muted-foreground mt-3 flex items-center gap-1.5">
                  <LockKeyhole className="w-3.5 h-3.5" />
                  Sending remains technically disabled.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-foreground">Communication approval queue</h3>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Exact drafts only. Changing content or audience after approval requires a new approval.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {(configsLoading || draftsLoading) && (
        <p className="font-body text-sm text-muted-foreground">Loading messaging state...</p>
      )}

      {!draftsLoading && drafts.length === 0 && (
        <div className="rounded-xl border border-border/40 bg-card/30 p-6 text-center">
          <p className="font-body text-sm text-foreground">No communication drafts are waiting.</p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Deego can prepare Telegram and SMS drafts here for your review.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {drafts.map(draft => {
          const p = previewById[draft.id];
          const config = latestConfig[draft.channel];
          const providerReady = readiness(config);
          const canApprove = ['draft', 'pending'].includes(draft.approval_status);
          const canSend = draft.approval_status === 'approved';
          return (
            <div key={draft.id} className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest border border-primary/30 text-primary rounded-full px-2.5 py-1">
                      {CHANNEL_LABEL[draft.channel] || draft.channel}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest border border-border/50 text-muted-foreground rounded-full px-2.5 py-1">
                      {draft.approval_status}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest border border-border/50 text-muted-foreground rounded-full px-2.5 py-1">
                      {draft.provider_status || 'not configured'}
                    </span>
                  </div>
                  <h4 className="font-body text-base font-semibold text-foreground mt-3">
                    {draft.title || String(draft.message_type || 'Communication').replace(/_/g, ' ')}
                  </h4>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Audience: {draft.audience_description || draft.recipient_ref || draft.recipient_scope}
                  </p>
                  <div className="mt-3 rounded-lg bg-secondary/30 p-3">
                    <p className="font-body text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{draft.body}</p>
                  </div>

                  {p && (
                    <div className="mt-3 rounded-lg border border-border/40 p-3 text-xs font-body space-y-1">
                      <p><span className="text-muted-foreground">Eligible recipients:</span> {p.eligible_recipient_count}</p>
                      <p><span className="text-muted-foreground">Fingerprint:</span> <span className="break-all">{p.content_fingerprint}</span></p>
                      <p><span className="text-muted-foreground">Approval phrase:</span> {p.required_approval_phrase}</p>
                      {p.compliance_errors?.length > 0 && (
                        <p className="text-destructive">{p.compliance_errors.join(' ')}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap lg:flex-col gap-2 lg:w-44">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => preview(draft)}
                    disabled={busyId === draft.id + ':preview'}
                    className="gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Review exact
                  </Button>
                  {canApprove && (
                    <Button
                      size="sm"
                      onClick={() => approve(draft)}
                      disabled={busyId === draft.id + ':approve'}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                  )}
                  {canSend && (
                    <Button
                      size="sm"
                      onClick={() => distribute(draft)}
                      disabled={!providerReady || busyId === draft.id + ':send'}
                      className="gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Distribute approved
                    </Button>
                  )}
                  {draft.approval_status === 'blocked' && (
                    <p className="font-body text-[10px] text-destructive flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Manual reconciliation required
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
