import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PUBLIC_JOURNALS, JOURNAL_PURCHASES_ENABLED } from '@/lib/publicJournalCatalogue';

export default function JournalShelf() {
  const [params, setParams] = useSearchParams();
  const selected = PUBLIC_JOURNALS.find(book => book.id === params.get('journal')) || null;
  const selectBook = id => setParams(previous => {
    const next = new URLSearchParams(previous);
    if (id) next.set('journal', id); else next.delete('journal');
    return next;
  }, { replace: !id });
  const ready = PUBLIC_JOURNALS.length === 6 && PUBLIC_JOURNALS.every(book =>
    book.title && book.description && book.sampleQuestion && book.samplePageReference);
  if (!ready) return <p className="font-body text-sm text-muted-foreground">Journal previews are being prepared.</p>;
  return (
    <>
      <p className="font-body text-sm text-muted-foreground">
        Choose a journal to explore its purpose and one question. Full interiors are reserved for purchasers.
        Online purchasing is being prepared.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" data-testid="journal-shelf">
        {PUBLIC_JOURNALS.map(book => (
          <button key={book.id} type="button" onClick={() => selectBook(book.id)}
            data-testid={'journal-cover-' + book.id}
            className="text-left rounded-2xl border border-border/40 bg-background/40 p-5 hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title + ' cover'}
              loading="lazy" className="w-full aspect-[2/3] object-contain mb-5" /> :
              <p className="font-body text-xs text-muted-foreground mb-4">Cover display being prepared</p>}
            <h3 className="font-display text-2xl mb-2">{book.title}</h3>
            <p className="font-body text-sm text-primary mb-3">A$9.90</p>
            <p className="font-body text-sm text-foreground/80 leading-relaxed">{book.description}</p>
            <span className="inline-block mt-4 font-body text-sm text-primary">Explore this journal</span>
          </button>
        ))}
      </div>
      <Dialog open={!!selected} onOpenChange={open => { if (!open) selectBook(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-testid="journal-preview-modal">
          {selected && <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl">{selected.title}</DialogTitle>
              <DialogDescription>Journal preview · A$9.90 · One question from the journal</DialogDescription>
            </DialogHeader>
            {selected.coverImageUrl && <img src={selected.coverImageUrl} alt={selected.title + ' cover'}
              className="w-full max-w-xs mx-auto aspect-[2/3] object-contain" />}
            <p className="font-body text-base leading-relaxed">{selected.description}</p>
            <blockquote className="border border-primary/30 bg-primary/5 rounded-xl p-5">
              <p className="font-body text-base leading-relaxed" data-testid="journal-sample-question">{selected.sampleQuestion}</p>
            </blockquote>
            <p className="font-body text-sm text-muted-foreground">You do not need a coaching call or coaching registration to purchase.
              Full journal access follows verified payment. Online purchasing is being prepared.</p>
            <div className="flex gap-3">
              <Button data-testid="journal-close" variant="outline" onClick={() => selectBook(null)}>Close</Button>
              <Button disabled={!JOURNAL_PURCHASES_ENABLED || !selected.releaseApproved}>Purchase</Button>
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}

