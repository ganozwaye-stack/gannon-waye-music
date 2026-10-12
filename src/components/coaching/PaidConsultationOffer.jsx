import {Link} from 'react-router-dom';
import {PAID_INITIAL_CONSULTATION as offer} from '@/lib/coachingOffer';
export default function PaidConsultationOffer(){
 return <section aria-labelledby="paid-consultation-title" data-testid="paid-consultation-offer" className="font-body rounded-2xl border border-primary/30 bg-card/50 p-6 md:p-8 mb-7">
  <p className="text-sm uppercase tracking-wide text-primary mb-2">One-on-one coaching</p>
  <h3 id="paid-consultation-title" className="text-2xl font-medium mb-3">{offer.title}</h3>
  <p className="text-3xl gradient-gold-text font-medium mb-3">A$99 <span className="text-lg text-foreground">/ 45 minutes</span></p>
  <p className="text-base leading-relaxed mb-4">A two-way conversation about your goals, what you would like support with and whether working together feels right. Life coaching and mindset mentoring focus on strengths and practical steps; coaching does not diagnose or treat mental health conditions.</p>
  <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/80 mb-5">
   <li>Ask Gannon about availability.</li>
   <li>Agree the time, session format and payment and cancellation details.</li>
   <li>Pay only after your appointment details are confirmed. Gannon confirms how you will attend the session.</li>
  </ol>
  <Link to={offer.contactPath} data-testid="coaching-request-availability" className="inline-flex items-center rounded-full min-h-12 px-6 gradient-gold-button text-primary-foreground font-semibold">Request availability</Link>
  <p className="text-sm text-muted-foreground mt-3">An enquiry is not a confirmed booking. Online booking and payment are being prepared.</p>
 </section>;
}
