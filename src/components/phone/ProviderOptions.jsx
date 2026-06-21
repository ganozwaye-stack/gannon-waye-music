import { ExternalLink, Star } from 'lucide-react';

const PROVIDERS = [
  {
    name: 'OpenPhone',
    slug: 'openphone',
    tagline: 'Best for solo operators and small teams',
    recommended: true,
    best_for: 'One-person business, coaching sales, easy phone app on iPhone/Mac',
    pros: ['Dead simple — works like a normal phone app', 'Buy AU/US numbers', 'Team inbox ready if you hire staff', 'Call notes, contacts, CRM-lite built in', 'No code required'],
    cons: ['Monthly subscription ($15–25 USD/user)', 'No API webhooks on basic plan', 'Less programmable than Twilio'],
    setup_needed: ['Sign up at openphone.com', 'Buy a number (AU or US)', 'Forward to your mobile', 'Add number to this system manually'],
    cost: 'From ~$15 USD/month per user',
    connection_status: 'not_connected',
    url: 'https://www.openphone.com',
  },
  {
    name: 'Twilio',
    slug: 'twilio',
    tagline: 'Best for full automation and webhook integration',
    recommended: false,
    best_for: 'Automating SMS, call routing, connecting directly into this app via API',
    pros: ['Full API — can auto-SMS coaching leads from this app', 'Webhooks on every call/SMS event', 'Programmable call routing', 'Pay per use — no monthly subscription', 'AU phone numbers available'],
    cons: ['Requires API setup (TWILIO_AUTH_TOKEN + TWILIO_ACCOUNT_SID + TWILIO_PHONE_NUMBER)', 'More technical to configure', 'Costs per message/minute'],
    setup_needed: ['Create account at twilio.com', 'Buy an AU number (~$1.50/month)', 'Add API keys to Base44 secrets', 'Connect webhooks to this app'],
    cost: '~$1.50/month per number + $0.08/min calls + $0.07/SMS',
    connection_status: 'not_connected',
    url: 'https://www.twilio.com',
  },
  {
    name: 'Telnyx',
    slug: 'telnyx',
    tagline: 'Best value programmable option',
    recommended: false,
    best_for: 'Same as Twilio but cheaper — good if you want API power at lower cost',
    pros: ['Cheaper than Twilio (~30% less)', 'Full REST API', 'AU numbers available', 'Webhooks and SIP support', 'Good documentation'],
    cons: ['Less mainstream than Twilio', 'Slightly less developer community support', 'Also requires API setup'],
    setup_needed: ['Create account at telnyx.com', 'Buy an AU number (~$1/month)', 'Add API keys to Base44 secrets', 'Connect webhooks to this app'],
    cost: '~$1/month per number + ~$0.05/min + ~$0.005/SMS',
    connection_status: 'not_connected',
    url: 'https://www.telnyx.com',
  },
];

export default function ProviderOptions() {
  return (
    <div className="space-y-5">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="font-body text-xs text-blue-300 font-semibold mb-1">⚡ My Recommendation for You</p>
        <p className="font-body text-xs text-blue-200/70">
          Start with <strong>OpenPhone</strong>. It requires zero code, works like a normal phone app on your iPhone, and is perfect for one-person coaching + business sales. 
          When you're ready to automate SMS or connect leads directly into this CRM, we upgrade to Twilio. You can keep both.
        </p>
      </div>

      <div className="space-y-4">
        {PROVIDERS.map(p => (
          <div key={p.slug} className={`bg-card/60 border rounded-2xl p-6 ${p.recommended ? 'border-primary/40' : 'border-border/40'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-xl text-foreground">{p.name}</h3>
                  {p.recommended && (
                    <span className="flex items-center gap-1 bg-primary/15 text-primary border border-primary/30 rounded-full px-2 py-0.5 font-body text-[9px] uppercase tracking-wider">
                      <Star className="w-2.5 h-2.5" /> Recommended
                    </span>
                  )}
                </div>
                <p className="font-body text-xs text-muted-foreground">{p.tagline}</p>
              </div>
              <span className="font-body text-[10px] uppercase tracking-wider text-muted-foreground/50 border border-border/30 rounded-full px-2.5 py-1">
                Not Connected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Pros</p>
                <ul className="space-y-1">
                  {p.pros.map((pro, i) => (
                    <li key={i} className="font-body text-xs text-foreground/70 flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Cons</p>
                <ul className="space-y-1">
                  {p.cons.map((con, i) => (
                    <li key={i} className="font-body text-xs text-foreground/60 flex items-start gap-1.5">
                      <span className="text-yellow-500 mt-0.5 shrink-0">−</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Setup Required</p>
                <ol className="space-y-1">
                  {p.setup_needed.map((step, i) => (
                    <li key={i} className="font-body text-xs text-foreground/60 flex items-start gap-1.5">
                      <span className="text-primary/50 shrink-0">{i + 1}.</span> {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Estimated Cost</p>
                <p className="font-body text-sm text-foreground/80">{p.cost}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-2.5 py-1 uppercase tracking-wider">
                  Human Action Required
                </span>
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-body text-xs text-primary/70 hover:text-primary border border-primary/20 rounded-lg px-3 py-1.5 transition-colors">
                  Visit Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}