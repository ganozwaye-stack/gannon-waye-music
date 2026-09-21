import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send, Loader2, ArrowUpRight, Sparkles } from 'lucide-react';

// Public fan chat widget — a floating launcher (bottom-right) that resolves
// owner-approved keywords through the public resolveFanKeyword function.
// No auth, no writes; purely a friendly front door to Gannon's links.

const GREETING =
  "Hey — I'm Gannon's assistant. Drop a keyword (LISTEN, MERCH, BREATH, LYRICS, PRESS) or just say hi.";

const EXAMPLE_CHIPS = ['LISTEN', 'MERCH', 'LYRICS', 'PRESS', 'BREATH', 'MUM'];

const LINK_LABELS = {
  music: 'Hear the music',
  subscribe: 'Subscribe',
  lyrics: 'Read the lyrics',
  store: 'Shop the store',
  press: 'Press kit',
};

export default function FanChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = async (raw) => {
    const text = String(raw || '').trim();
    if (!text || busy) return;
    setMessages((m) => [...m, { role: 'fan', text }]);
    setInput('');
    setBusy(true);
    try {
      const res = await base44.functions.invoke('resolveFanKeyword', {
        keyword: text,
        network: 'site',
      });
      const d = res?.data || {};
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: d.response_message || "I couldn't fetch that just now — try again in a moment.",
          links: d.links || {},
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: "Something went wrong on my end — please try again in a moment." },
      ]);
    }
    setBusy(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close fan chat' : 'Open fan chat'}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-12 h-12 rounded-full gradient-gold-button border-0 flex items-center justify-center shadow-lg"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-36 md:bottom-24 right-4 md:right-6 z-40 w-[calc(100%-2rem)] max-w-[340px] rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="gradient-gold-button px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <p className="font-body text-sm font-semibold text-primary-foreground">Gannon's Assistant</p>
            </div>
            <p className="font-body text-[10px] text-primary-foreground/80 mt-0.5">
              Keywords &amp; hellos — replies come from Gannon's approved responses
            </p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[300px] min-h-[160px]">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'fan' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={m.role === 'fan'
                  ? 'rounded-2xl rounded-br-sm bg-primary/15 border border-primary/25 px-3 py-2 max-w-[85%]'
                  : 'rounded-2xl rounded-bl-sm bg-secondary/40 border border-border/40 px-3 py-2 max-w-[85%]'}>
                  <p className="font-body text-xs text-foreground whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {m.links && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries(m.links).filter(([, url]) => url).map(([key, url]) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-primary/35 text-primary px-2.5 py-1 font-body text-[10px] hover:bg-primary/10 transition-colors"
                        >
                          {LINK_LABELS[key] || key} <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-secondary/40 border border-border/40 px-3 py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Example chips */}
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
            {EXAMPLE_CHIPS.map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => send(k)}
                disabled={busy}
                className="font-body text-[10px] px-2 py-1 rounded-full border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border/40 p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Say hi or drop a keyword…"
              className="flex-1 bg-secondary/40 border border-border/40 rounded-full px-3.5 py-2 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="w-8 h-8 rounded-full gradient-gold-button border-0 flex items-center justify-center disabled:opacity-40 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}