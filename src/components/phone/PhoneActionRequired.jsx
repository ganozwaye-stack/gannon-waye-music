import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

const ACTIONS = [
  {
    priority: 1,
    title: 'Choose a phone provider',
    description: 'Go to the Providers tab and decide between OpenPhone (easiest), Twilio (most powerful), or Telnyx (best value). Recommended: OpenPhone to start.',
    done_when: 'You have an account and a number purchased.',
    link: null,
  },
  {
    priority: 2,
    title: 'Add your forwarding mobile number',
    description: 'Once you have a provider, add your personal mobile as the forwarding destination so calls reach your phone.',
    done_when: 'Forwarding destination field is filled in Number Setup.',
    link: null,
  },
  {
    priority: 3,
    title: 'Confirm business hours',
    description: 'Set the hours you\'re available to take business calls. This will be used in voicemail and auto-reply messaging.',
    done_when: 'Business hours field is filled in Number Setup.',
    link: null,
  },
  {
    priority: 4,
    title: 'Finalise voicemail script',
    description: 'Review and edit the draft voicemail script. Remove the "DRAFT —" prefix when you\'re happy with it.',
    done_when: 'Voicemail script is finalised and no longer says DRAFT.',
    link: null,
  },
  {
    priority: 5,
    title: 'Approve SMS draft templates',
    description: 'Review the 5 SMS draft templates in the SMS Drafts tab. Edit to match your voice. These won\'t send automatically — they\'re for manual use.',
    done_when: 'All 5 templates reviewed and status changed to approved.',
    link: null,
  },
  {
    priority: 6,
    title: 'Approve the number going public',
    description: 'When you\'re ready to show the number on your website (coaching page, contact page, etc.), come back here and approve each lead source in the Lead Sources tab.',
    done_when: 'Lead sources toggled to Live.',
    link: null,
  },
  {
    priority: 7,
    title: 'Connect Twilio or provider API (optional — for automation)',
    description: 'If you want missed call notifications, auto-SMS drafts, and CRM sync to happen automatically when calls come in, we need to connect a provider API. This is optional and requires your explicit approval.',
    done_when: 'Provider API keys added to Base44 secrets and automation approved.',
    link: null,
  },
  {
    priority: 8,
    title: 'Review coaching CRM connection',
    description: 'Phone leads can automatically become Coaching CRM leads. Review the Inbound Leads tab and manually promote any coaching enquiry leads to the coaching pipeline at /admin/coaching-clients.',
    done_when: 'You\'ve reviewed and linked at least one phone lead to a coaching lead.',
    link: '/admin/coaching-clients',
  },
];

const FINAL_REPORT = [
  { item: 'Phone system built', status: true },
  { item: 'One number strategy applied', status: true },
  { item: 'Provider active', status: false },
  { item: 'Public number hidden', status: true },
  { item: 'SMS draft only (no auto-send)', status: true },
  { item: 'BusinessPhoneNumber record created', status: true },
  { item: 'Phone leads connected to Coaching CRM', status: true, note: 'Manual promotion — no auto-sync until provider + approval' },
  { item: 'No money spent', status: true },
  { item: 'No provider connected', status: true },
  { item: 'No SMS sent', status: true },
];

export default function PhoneActionRequired({ primaryNumber }) {
  return (
    <div className="space-y-6">
      {/* Final Report */}
      <div className="bg-card/60 border border-border/50 rounded-2xl p-6">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-4">Final Build Report</p>
        <div className="space-y-2">
          {FINAL_REPORT.map(item => (
            <div key={item.item} className="flex items-start gap-2.5">
              {item.status
                ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                : <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
              }
              <div>
                <span className={`font-body text-xs ${item.status ? 'text-foreground/70' : 'text-yellow-300'}`}>
                  {item.item}
                  {item.status
                    ? <span className="text-green-400 ml-1">✓</span>
                    : <span className="text-yellow-400 ml-1">— Pending</span>
                  }
                </span>
                {item.note && <p className="font-body text-[10px] text-muted-foreground/50 mt-0.5">{item.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended provider */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-5">
        <p className="font-body text-xs font-semibold text-primary mb-2">⚡ Recommended Next Action</p>
        <p className="font-body text-sm text-foreground">
          Sign up for <strong>OpenPhone</strong> at openphone.com. Buy one Australian (or US) number. 
          Forward it to your mobile. Add the number and forwarding details in the Number Setup tab. 
          That's it. Zero code required. You'll be live within 30 minutes.
        </p>
        <a href="https://www.openphone.com" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 font-body text-xs text-primary/70 hover:text-primary transition-colors">
          openphone.com <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Action checklist */}
      <div>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">What Gannon Must Choose Next</p>
        <div className="space-y-3">
          {ACTIONS.map(action => (
            <div key={action.priority} className="bg-card/50 border border-border/40 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="font-display text-sm text-primary/40 shrink-0 w-5">{action.priority}.</span>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold text-foreground">{action.title}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{action.description}</p>
                  <p className="font-body text-[10px] text-green-400/70 mt-2">✓ Done when: {action.done_when}</p>
                  {action.link && (
                    <a href={action.link} className="inline-flex items-center gap-1 mt-2 font-body text-xs text-primary/60 hover:text-primary transition-colors">
                      Go to page <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}