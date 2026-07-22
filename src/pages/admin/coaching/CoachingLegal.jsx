import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, AlertTriangle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DOCUMENTS = [
  {
    name: 'Coaching Service Agreement',
    status: 'Draft',
    review: 'Professional Review Recommended',
    desc: 'Core agreement between coach and client defining the scope, terms, and responsibilities of the coaching relationship.',
    sections: ['Scope of services', 'Session format and frequency', 'Payment terms', 'Cancellation policy', 'Liability limitations'],
  },
  {
    name: 'Client Consent Form',
    status: 'Draft',
    review: 'Professional Review Recommended',
    desc: 'Informed consent acknowledging the nature of coaching vs therapy.',
    sections: ['Nature of coaching', 'Voluntary participation', 'Confidentiality', 'Data use consent'],
  },
  {
    name: 'Client Waiver',
    status: 'Draft',
    review: 'Professional Review Recommended',
    desc: 'Liability waiver for coaching services.',
    sections: ['Risk acknowledgement', 'Liability release', 'Emergency disclaimer'],
  },
  { name: 'Privacy Notice', status: 'Draft', review: 'Needs Review', desc: 'How client data is collected, stored, and used.', sections: ['Data collected', 'Storage & security', 'Client rights', 'Third-party sharing'] },
  { name: 'Cancellation Policy', status: 'Draft', review: 'Needs Review', desc: 'Cancellation and rescheduling terms.', sections: ['Notice period', 'Refund conditions', 'Late arrival policy'] },
  { name: 'Payment Policy', status: 'Draft', review: 'Needs Review', desc: 'Payment schedules, methods, and late fees.', sections: ['Payment timing', 'Accepted methods', 'Late payment', 'Refunds'] },
  { name: 'Scope of Practice', status: 'Draft', review: 'Professional Review Recommended', desc: 'Defines what coaching is and is not.', sections: ['What coaching covers', 'What coaching does NOT cover', 'When to seek professional help'] },
  { name: 'Emergency / Crisis Disclaimer', status: 'Draft', review: 'Professional Review Recommended', desc: 'Crisis resources and limits of coaching in emergencies.', sections: ['Crisis resources', 'Coaching limitations', 'Emergency contacts'] },
  { name: 'Meditation Disclaimer', status: 'Draft', review: 'Needs Review', desc: 'Safety notes for guided meditation content.', sections: ['Not medical advice', 'Contraindications', 'Usage guidelines'] },
  { name: 'Subscription Terms', status: 'Draft', review: 'Needs Review', desc: 'Ongoing program subscription terms.', sections: ['Billing cycle', 'Cancellation rights', 'Auto-renewal'] },
  { name: 'Testimonial Consent', status: 'Draft', review: 'Needs Review', desc: 'Permission to use client testimonials publicly.', sections: ['Consent scope', 'Right to withdraw', 'Anonymity options'] },
  { name: 'Client Data Handling Notice', status: 'Draft', review: 'Professional Review Recommended', desc: 'GDPR/Australian Privacy Act compliance notice.', sections: ['Data handling practices', 'Retention periods', 'Client access rights'] },
];

const reviewColor = (review) =>
  review === 'Professional Review Recommended' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
  review === 'Needs Review' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
  'bg-green-500/20 text-green-300 border-green-500/30';

export default function CoachingLegal() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Legal Documents</h1>
          <p className="text-sm text-muted-foreground">{DOCUMENTS.length} draft documents — none published</p>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Professional legal review is required</strong> before any of these documents are shown to clients or used in a live coaching business. These are draft templates only — not legal advice.
        </p>
      </div>

      <div className="space-y-2">
        {DOCUMENTS.map((doc, i) => (
          <Card key={doc.name} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setExpanded(expanded === i ? null : i)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{doc.name}</p>
                      <Badge className="bg-secondary text-muted-foreground text-[10px]">{doc.status}</Badge>
                      <Badge className={`text-[10px] border ${reviewColor(doc.review)}`}>{doc.review}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{doc.desc}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${expanded === i ? 'rotate-90' : ''}`} />
              </div>

              {expanded === i && (
                <div className="mt-4 pl-7 border-t border-border/30 pt-4">
                  <p className="text-xs font-semibold text-foreground/70 mb-2">Sections to Include</p>
                  <ul className="space-y-1 mb-4">
                    {doc.sections.map(s => (
                      <li key={s} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />{s}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Edit Draft</Button>
                    <Button size="sm" variant="outline" className="text-xs">Mark Reviewed</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}