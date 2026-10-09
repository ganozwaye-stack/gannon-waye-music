import { PUBLIC_JOURNALS } from '@/lib/publicJournalCatalogue';

export default function JournalShelf() {
  // Do not publish partial, placeholder or unverified substitutes for the six books.
  const ready = PUBLIC_JOURNALS.length === 6 && new Set(PUBLIC_JOURNALS.map(book => book.id)).size === 6 &&
    PUBLIC_JOURNALS.every(book => book.title && book.approvedVersion && book.origin && book.purpose &&
      book.sampleQuestion && book.samplePageReference && Array.isArray(book.readerBenefits) &&
      book.readerBenefits.length > 0 && /^https:\/\//.test(book.coverImageUrl || ''));
  if (!ready) return (
    <p className="font-body text-sm text-muted-foreground leading-relaxed">
      The cover display and a question from each journal are being prepared.
      Full interiors are reserved for purchasers. Online purchasing is being prepared.
    </p>
  );
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-8" data-testid="journal-shelf">
      {PUBLIC_JOURNALS.map(book => (
        <article key={book.id} className="rounded-2xl border border-border/40 bg-background/40 p-5">
          <img src={book.coverImageUrl} alt={book.title + ' cover'} loading="lazy"
            className="w-full aspect-[2/3] object-contain mb-5" />
          <h3 className="font-display text-2xl mb-2">{book.title}</h3>
          <p className="font-body text-sm text-primary mb-4">A$9.90</p>
          <h4 className="font-body text-sm font-semibold mb-2">The heart behind this journal</h4>
          <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">{book.origin}</p>
          <p className="font-body text-sm text-foreground/80 leading-relaxed mb-4">{book.purpose}</p>
          <ul className="space-y-2 mb-5 font-body text-sm text-foreground/80">
            {book.readerBenefits.map(benefit => <li key={benefit}>{benefit}</li>)}
          </ul>
          <blockquote className="rounded-xl border border-primary/25 bg-primary/5 p-4 font-body">
            <p className="text-xs text-muted-foreground mb-2">One question to explore</p>
            <p className="text-base leading-relaxed">{book.sampleQuestion}</p>
          </blockquote>
          <p className="font-body text-xs text-muted-foreground mt-4">Full journal available after purchase.
            Online purchasing is being prepared.</p>
        </article>
      ))}
    </div>
  );
}
