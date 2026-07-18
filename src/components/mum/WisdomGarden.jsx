import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Heart, Leaf, MessageCircle, Shield, Smile, Sparkles } from 'lucide-react';
import HeartOfGold from './HeartOfGold';
import { base44 } from '@/api/base44Client';

const WISDOM = {
  comfort: {
    label: 'I need comfort',
    Icon: Heart,
    response: 'Take a breath, my love. You do not have to solve your whole life tonight. Just get through this moment gently. That is enough. You are doing enough.',
    accent: 'rgba(212,175,55,0.08)',
  },
  strength: {
    label: 'I need strength',
    Icon: Shield,
    response: 'You have survived things that tried to bury you. You are still here. That means something. That means everything.',
    accent: 'rgba(212,175,55,0.08)',
  },
  alone: {
    label: 'I feel alone',
    Icon: Leaf,
    response: 'You may feel alone, but you are not unloved. Love does not disappear just because someone is no longer standing in the room. It stays. It stays in the people who carry you.',
    accent: 'rgba(20,55,20,0.14)',
  },
  mum_moment: {
    label: 'I need a mum moment',
    Icon: Coffee,
    response: 'Eat something. Have a coffee. Put your feet up. Then try again when your heart has caught up with your body. You are allowed to rest.',
    accent: 'rgba(100,35,20,0.12)',
  },
  keep_going: {
    label: 'I need to keep going',
    Icon: Sparkles,
    response: "Boy, you're not finished yet. Not even close. The fact that you're still standing, still asking, still trying - that's not nothing. That's everything.",
    accent: 'rgba(212,175,55,0.08)',
  },
  loved: {
    label: 'I need to feel loved',
    Icon: Heart,
    response: 'You were loved before you knew how to explain yourself, and you are still worthy of love now. Exactly as you are. Right now. No conditions.',
    accent: 'rgba(100,20,35,0.12)',
  },
  cheeky: {
    label: 'I need a cheeky laugh',
    Icon: Smile,
    response: "Have a cry, have a coffee, swear if you need to, then get yourself together, boy. You have things to do. And yes - you still look ridiculous when you're being dramatic.",
    accent: 'rgba(20,55,20,0.12)',
  },
};

export default function WisdomGarden() {
  const [selected, setSelected] = useState(null);
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const card = selected ? WISDOM[selected] : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const updatedMessages = [...chatMessages, { role: 'user', content: userText }];

    setChatMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await base44.functions.invoke('soniaChat', { messages: updatedMessages });
      if (res.data?.reply) {
        setChatMessages([...updatedMessages, { role: 'assistant', content: res.data.reply }]);
      } else if (res.data?.error) {
        setChatMessages([...updatedMessages, { role: 'assistant', content: `Oh, my love, I am having a bit of trouble connecting right now: ${res.data.error}` }]);
      } else {
        setChatMessages([...updatedMessages, { role: 'assistant', content: "My love, I am finding it a bit hard to speak right now. Make yourself a cup of coffee and try again in a moment." }]);
      }
    } catch {
      setChatMessages([...updatedMessages, { role: 'assistant', content: "I am sorry, darling, I could not reach the garden line just now. Grab a warm drink, and let's try again in a bit." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="sonias-garden" className="mx-auto max-w-4xl px-4 py-20 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <div className="mb-4 flex justify-center">
          <HeartOfGold size="sm" />
        </div>

        <h2 className="font-display mb-3 text-3xl text-foreground md:text-4xl">
          Sonia's Garden of Wisdom
        </h2>

        <p className="mx-auto max-w-lg font-body text-sm leading-relaxed text-muted-foreground/60">
          Sometimes the people we lose still leave behind a way of loving us.
        </p>
        <p className="mx-auto mt-3 max-w-md font-body text-xs leading-relaxed text-muted-foreground/40">
          This space is inspired by Sonia's heart, humour, strength, and the memories Gannon has shared. It does not replace her. Nothing could.
        </p>
      </motion.div>

      <div className="mb-8 flex justify-center gap-4">
        <button
          onClick={() => { setIsChatMode(false); setSelected(null); }}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-xs uppercase tracking-wider transition-all duration-300 ${
            !isChatMode
              ? 'border-primary/45 bg-primary/15 font-semibold text-primary'
              : 'border-border/30 bg-white/5 text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Wisdom Cards
        </button>
        <button
          onClick={() => { setIsChatMode(true); setSelected(null); }}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-xs uppercase tracking-wider transition-all duration-300 ${
            isChatMode
              ? 'border-primary/45 bg-primary/15 font-semibold text-primary'
              : 'border-border/30 bg-white/5 text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Memory Chat
        </button>
      </div>

      {!isChatMode ? (
        <>
          <div className="mb-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {Object.entries(WISDOM).map(([key, item], i) => {
              const Icon = item.Icon;
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelected(selected === key ? null : key)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-start gap-2.5 rounded-2xl px-4 py-3.5 text-left font-body text-xs tracking-wide transition-all duration-300"
                  style={{
                    background: selected === key ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                    border: selected === key ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: selected === key ? '0 0 20px rgba(212,175,55,0.08)' : '0 2px 12px rgba(0,0,0,0.25)',
                    color: selected === key ? 'rgba(212,175,55,0.95)' : 'rgba(200,190,175,0.65)',
                  }}
                >
                  <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/62" />
                  <span className="leading-snug">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {card && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-3xl p-8 text-center md:p-10"
                style={{
                  background: 'linear-gradient(145deg, rgba(14,10,8,0.7), rgba(10,14,8,0.65))',
                  border: '1px solid rgba(212,175,55,0.2)',
                  boxShadow: '0 0 50px rgba(212,175,55,0.07), 0 12px 40px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: card.accent }} />
                <div className="relative z-10 mb-5 flex justify-center">
                  <HeartOfGold size="sm" />
                </div>
                <p className="relative z-10 mb-4 font-display text-xl italic leading-relaxed text-foreground/88 md:text-2xl">
                  "{card.response}"
                </p>
                <p className="relative z-10 font-body text-[9px] uppercase tracking-[0.5em] text-primary/35">
                  Inspired by Sonia
                </p>
                <button
                  onClick={() => {
                    const keys = Object.keys(WISDOM);
                    const next = keys[(keys.indexOf(selected) + 1) % keys.length];
                    setSelected(next);
                  }}
                  className="relative z-10 mt-6 inline-flex items-center gap-2 rounded-full border border-border/15 px-5 py-2 font-body text-xs uppercase tracking-wider text-muted-foreground/45 transition-colors hover:text-primary/65"
                >
                  <Heart className="h-3.5 w-3.5 text-primary/55" />
                  Another mum moment
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 text-center">
              <p className="font-display text-lg italic text-foreground/25">"Boy, you're not finished yet."</p>
              <p className="mt-2 font-body text-[10px] uppercase tracking-widest text-muted-foreground/20">Choose a moment above</p>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative space-y-6 overflow-hidden rounded-3xl p-6 md:p-8"
          style={{
            background: 'linear-gradient(145deg, rgba(14,10,8,0.7), rgba(10,14,8,0.65))',
            border: '1px solid rgba(212,175,55,0.2)',
            boxShadow: '0 0 50px rgba(212,175,55,0.07), 0 12px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="max-h-[350px] space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent" style={{ minHeight: '220px' }}>
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
                <HeartOfGold size="sm" />
                <p className="max-w-md font-display text-lg italic leading-relaxed text-foreground/80">
                  "Hello, my love. Sit down, pull up a chair, and let's have a cup of coffee. What's on your heart today?"
                </p>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground/45">
                  Type a message below to start a memory-inspired conversation
                </p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl border px-4 py-3 font-body text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'border-primary/25 bg-primary/5 text-right text-foreground'
                        : 'border-white/5 bg-black/45 text-left italic text-foreground/90'
                    }`}
                    style={msg.role === 'assistant' ? { background: 'linear-gradient(135deg, rgba(20,15,12,0.6), rgba(12,16,12,0.55))' } : {}}
                  >
                    {msg.role === 'assistant' && (
                      <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-primary/60">
                        Sonia's memory
                      </span>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-white/5 bg-black/45 px-4 py-3">
                  <span className="mr-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-primary/40">
                    Writing
                  </span>
                  <span className="flex gap-1">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: '0ms' }} />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: '150ms' }} />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tell Sonia's memory what you are feeling..."
              className="flex-1 rounded-full border border-primary/20 bg-black/50 px-5 py-3 text-xs text-foreground placeholder-muted-foreground/35 focus:border-primary/45 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="gradient-gold-button rounded-full border-0 px-6 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 disabled:pointer-events-none disabled:opacity-50"
            >
              Send
            </button>
          </form>

          {chatMessages.length > 0 && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setChatMessages([])}
                className="font-body text-[10px] uppercase tracking-wider text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
              >
                Clear Conversation
              </button>
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-8 rounded-2xl border border-border/10 px-5 py-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="font-body text-[10px] italic leading-relaxed text-muted-foreground/40">
          Inspired by Sonia's love and Gannon's memories. Not a replacement for Sonia. Not medical, legal, crisis, or therapy advice.
        </p>
        <p className="mt-2 font-body text-[10px] leading-relaxed text-muted-foreground/30">
          If you are in immediate danger or need urgent support, contact emergency services,{' '}
          <strong className="text-muted-foreground/45">Lifeline 13 11 14</strong>, or{' '}
          <strong className="text-muted-foreground/45">Beyond Blue 1300 22 4636</strong>.
        </p>
      </div>
    </section>
  );
}
