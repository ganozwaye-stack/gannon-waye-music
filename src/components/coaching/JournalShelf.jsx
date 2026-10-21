import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PUBLIC_JOURNALS } from '@/lib/publicJournalCatalogue';
import JournalPurchasePanel from './JournalPurchasePanel';

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch gap-6 mt-8" data-testid="journal-shelf">
        {PUBLIC_JOURNALS.map(book => (
          <button key={book.id} type="button" onClick={() => selectBook(book.id)}
            data-testid={'journal-cover-' + book.id}
            className="flex h-full min-w-0 flex-col text-left rounded-2xl border-2 border-[#F5D06E] bg-background/40 p-5 shadow-[0_0_16px_rgba(245,208,110,0.12)] transition-shadow hover:shadow-[0_0_22px_rgba(245,208,110,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5D06E]">
            {book.coverImageUrl ? <div className="w-full max-w-[17rem] mx-auto aspect-[1042/1474] shrink-0 mb-5 border-2 border-[#F5D06E] bg-[#141419] p-1 shadow-[0_0_12px_rgba(245,208,110,0.18)]">
              <img src={book.coverImageUrl} alt={book.title + ' cover'}
                loading="lazy" className="w-full h-full object-contain" />
            </div> :
              <p className="font-body text-xs text-muted-foreground mb-4">Cover display being prepared</p>}
            <h3 className="font-display text-2xl leading-tight min-h-[3.75rem] mb-2">{book.title}</h3>
            <p className="font-body text-sm text-primary mb-3">A$9.90</p>
            <p className="flex-1 font-body text-sm text-foreground/80 leading-relaxed">{book.description}</p>
            <span className="block mt-5 font-body text-sm text-[#F5D06E]">Explore this journal</span>
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
              className="w-full max-w-xs mx-auto aspect-[1042/1474] object-contain border-2 border-[#F5D06E] bg-[#141419] p-1" />}
            <p className="font-body text-base leading-relaxed">{selected.description}</p>
            <blockquote className="border border-primary/30 bg-primary/5 rounded-xl p-5">
              <p className="font-body text-base leading-relaxed" data-testid="journal-sample-question">{selected.sampleQuestion}</p>
            </blockquote>
            <p className="font-body text-sm text-muted-foreground">You do not need a coaching call or coaching registration to purchase.
              Full journal access follows verified payment. Online purchasing is being prepared.</p>
            <div className="flex gap-3">
              <Button data-testid="journal-close" variant="outline" onClick={() => selectBook(null)}>Close</Button>
            </div>
            <JournalPurchasePanel key={selected.id} book={selected} />

          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}

