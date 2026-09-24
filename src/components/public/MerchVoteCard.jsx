import { Heart, Check } from 'lucide-react';

export default function MerchVoteCard({ item, isVoted, isPending, onVote }) {
  return (
    <div className="rounded-2xl border border-border/30 hover:border-primary/30 bg-card/40 backdrop-blur-sm overflow-hidden transition-colors flex flex-col">
      <div className="aspect-[4/5] bg-secondary/30 overflow-hidden">
        <img src={item.image} alt={`${item.name} concept`} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="p-4 text-center flex flex-col flex-1">
        <h3 className="font-display text-base text-foreground leading-snug">{item.name}</h3>
        <p className="font-body text-xs text-muted-foreground mt-1.5 leading-relaxed flex-1">{item.blurb}</p>
        {isVoted ? (
          <div className="mt-4 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 border border-primary/40 text-primary bg-primary/10">
            <Check className="w-3.5 h-3.5" /> Thanks, your vote is in
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onVote(item)}
            disabled={isPending}
            className="mt-4 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 gradient-gold-button hover:opacity-90 disabled:opacity-60"
          >
            <Heart className="w-3.5 h-3.5" /> {isPending ? 'Counting...' : "I'd buy this"}
          </button>
        )}
      </div>
    </div>
  );
}