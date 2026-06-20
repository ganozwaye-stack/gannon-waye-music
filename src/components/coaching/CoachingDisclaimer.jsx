export default function CoachingDisclaimer({ minimal = false }) {
  if (minimal) {
    return (
      <p className="font-body text-[10px] text-muted-foreground/50 text-center leading-relaxed max-w-xl mx-auto">
        Gannon Waye Coaching is life coaching and mindset mentoring — not therapy, counselling, crisis support, medical, legal, or financial advice.
        If you are in immediate danger, please contact emergency services (000) or <a href="https://www.lifeline.org.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary/60">Lifeline 13 11 14</a>.
      </p>
    );
  }

  return (
    <div className="bg-secondary/40 border border-border/40 rounded-xl p-5 text-left max-w-2xl mx-auto">
      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Important Note</p>
      <p className="font-body text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground/70">Gannon Waye Coaching is life coaching and mindset mentoring.</strong> It is not therapy, counselling, crisis support, medical advice, legal advice, or financial advice. Coaching supports personal growth, clarity, and practical action — it does not diagnose, treat, or substitute for professional mental health care.
      </p>
      <p className="font-body text-xs text-muted-foreground leading-relaxed mt-2">
        If you are in immediate danger or mental health crisis, please contact emergency services (000), <a href="https://www.lifeline.org.au" target="_blank" rel="noopener noreferrer" className="text-primary/70 underline">Lifeline 13 11 14</a>, or <a href="https://www.beyondblue.org.au" target="_blank" rel="noopener noreferrer" className="text-primary/70 underline">Beyond Blue 1300 22 4636</a>.
      </p>
    </div>
  );
}