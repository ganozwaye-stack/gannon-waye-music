import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeartOfGold from './HeartOfGold';
import { base44 } from '@/api/base44Client';

const WISDOM = {
  comfort: {
    label: 'I need comfort',
    icon: '🤍',
    response: 'Take a breath, my love. You do not have to solve your whole life tonight. Just get through this moment gently. That is enough. You are doing enough.',
    accent: 'rgba(212,175,55,0.08)',
  },
  strength: {
    label: 'I need strength',
    icon: '💛',
    response: 'You have survived things that tried to bury you. You are still here. That means something. That means everything.',
    accent: 'rgba(212,175,55,0.08)',
  },
  alone: {
    label: 'I feel alone',
    icon: '🌿',
    response: 'You may feel alone, but you are not unloved. Love does not disappear just because someone is no longer standing in the room. It stays. It stays in the people who carry you.',
    accent: 'rgba(20,55,20,0.14)',
  },
  mum_moment: {
    label: 'I need a mum moment',
    icon: '☕',
    response: 'Eat something. Have a coffee. Put your feet up. Then try again when your heart has caught up with your body. You are allowed to rest.',
    accent: 'rgba(100,35,20,0.12)',
  },
  keep_going: {
    label: 'I need to keep going',
    icon: '✨',
    response: 'Boy, you\'re not finished yet. Not even close. The fact that you\'re still standing, still asking, still trying — that\'s not nothing. That\'s everything.',
    accent: 'rgba(212,175,55,0.08)',
  },
  loved: {
    label: 'I need to feel loved',
    icon: '♥',
    response: 'You were loved before you knew how to explain yourself, and you are still worthy of love now. Exactly as you are. Right now. No conditions.',
    accent: 'rgba(100,20,35,0.12)',
  },
  cheeky: {
    label: 'I need a cheeky laugh',
    icon: '😄',
    response: 'Have a cry, have a coffee, swear if you need to, then get yourself together, boy. You have things to do. And yes — you still look ridiculous when you\'re being dramatic.',
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
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
        setChatMessages([...updatedMessages, { role: 'assistant', content: `Oh, my love, I'm having a bit of trouble connecting right now: ${res.data.error}` }]);
      } else {
        setChatMessages([...updatedMessages, { role: 'assistant', content: "My love, I'm finding it a bit hard to speak right now. Make yourself a cup of coffee and try again in a moment." }]);
      }
    } catch (err) {
      setChatMessages([...updatedMessages, { role: 'assistant', content: "I'm sorry, darling, I couldn't reach the garden line just now. Grab a warm drink, and let's try again in a bit." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="sonias-garden" className="px-4 md:px-8 max-w-3xl mx-auto py-20">

      {/* Section intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        {/* Small heart divider */}
        <div className="flex justify-center mb-4">
          <HeartOfGold size="sm" />
        </div>

        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
          Sonia's Garden of Wisdom
        </h2>

        <p className="font-body text-sm text-muted-foreground/60 leading-relaxed max-w-lg mx-auto">
          Sometimes the people we lose still leave behind a way of loving us.
        </p>
        <p className="font-body text-xs text-muted-foreground/40 mt-3 leading-relaxed max-w-md mx-auto">
          This space is inspired by Sonia's heart, humour, strength, and the memories Gannon has shared. It does not replace her. Nothing could. It honours the way she made people feel seen, held, and reminded they were not finished yet.
        </p>
        <p className="font-body text-[9px] text-muted-foreground/25 mt-3 italic">
          Responses inspired by Sonia's love, humour, strength, and the memories Gannon has shared.
        </p>
      </motion.div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { setIsChatMode(false); setSelected(null); }}
          className={`px-5 py-2.5 rounded-full font-body text-xs uppercase tracking-wider transition-all duration-300 border ${
            !isChatMode 
              ? 'bg-primary/15 border-primary/45 text-primary font-semibold' 
              : 'border-border/30 text-muted-foreground hover:text-foreground bg-white/5'
          }`}
        >
          🌸 Wisdom Cards
        </button>
        <button
          onClick={() => { setIsChatMode(true); setSelected(null); }}
          className={`px-5 py-2.5 rounded-full font-body text-xs uppercase tracking-wider transition-all duration-300 border ${
            isChatMode 
              ? 'bg-primary/15 border-primary/45 text-primary font-semibold' 
              : 'border-border/30 text-muted-foreground hover:text-foreground bg-white/5'
          }`}
        >
          💬 Talk with Sonia
        </button>
      </div>

      {!isChatMode ? (
        <>
          {/* Garden nook buttons — styled as note cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
            {Object.entries(WISDOM).map(([key, item], i) => (
              <motion.button
                key={key}
                onClick={() => setSelected(selected === key ? null : key)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="text-left flex items-start gap-2.5 px-4 py-3.5 rounded-2xl font-body text-xs tracking-wide transition-all duration-300"
                style={{
                  background: selected === key
                    ? 'rgba(212,175,55,0.12)'
                    : 'rgba(255,255,255,0.03)',
                  border: selected === key
                    ? '1px solid rgba(212,175,55,0.4)'
                    : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: selected === key
                    ? '0 0 20px rgba(212,175,55,0.08)'
                    : '0 2px 12px rgba(0,0,0,0.25)',
                  color: selected === key
                    ? 'rgba(212,175,55,0.95)'
                    : 'rgba(200,190,175,0.65)',
                }}
              >
                <span className="text-base mt-0.5 flex-shrink-0">{item.icon}</span>
                <span className="leading-snug">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Response — garden note card */}
          <AnimatePresence mode="wait">
            {card && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl p-8 md:p-10 text-center overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, rgba(14,10,8,0.7), rgba(10,14,8,0.65))`,
                  border: '1px solid rgba(212,175,55,0.2)',
                  boxShadow: '0 0 50px rgba(212,175,55,0.07), 0 12px 40px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Accent background layer */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
                  background: card.accent,
                }} />

                {/* Corner gold ornament */}
                <div className="absolute top-4 left-4 w-8 h-8 opacity-20 pointer-events-none">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M2 30 L2 2 L30 2" stroke="rgba(212,175,55,1)" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <div className="absolute bottom-4 right-4 w-8 h-8 opacity-20 pointer-events-none" style={{ transform: 'rotate(180deg)' }}>
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M2 30 L2 2 L30 2" stroke="rgba(212,175,55,1)" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>

                {/* Glowing heart when open */}
                <div className="flex justify-center mb-5 relative z-10">
                  <HeartOfGold size="sm" />
                </div>

                <p className="font-display text-xl md:text-2xl italic text-foreground/88 leading-relaxed relative z-10 mb-4">
                  "{card.response}"
                </p>

                <p className="font-body text-[9px] tracking-[0.5em] uppercase text-primary/35 relative z-10">
                  Inspired by Sonia
                </p>

                <button
                  onClick={() => {
                    const keys = Object.keys(WISDOM);
                    const next = keys[(keys.indexOf(selected) + 1) % keys.length];
                    setSelected(next);
                  }}
                  className="relative z-10 mt-6 inline-flex items-center gap-2 font-body text-xs tracking-wider uppercase text-muted-foreground/45 hover:text-primary/65 transition-colors border border-border/15 rounded-full px-5 py-2"
                >
                  <span style={{ color: 'rgba(212,175,55,0.5)' }}>♥</span> Another mum moment
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Default / no selection */}
          {!selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <p className="font-display text-lg italic text-foreground/25">"Boy, you're not finished yet."</p>
              <p className="font-body text-[10px] text-muted-foreground/20 mt-2 tracking-widest uppercase">Choose a moment above</p>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-6 md:p-8 overflow-hidden space-y-6"
          style={{
            background: `linear-gradient(145deg, rgba(14,10,8,0.7), rgba(10,14,8,0.65))`,
            border: '1px solid rgba(212,175,55,0.2)',
            boxShadow: '0 0 50px rgba(212,175,55,0.07), 0 12px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Scrollable chat messages container */}
          <div 
            className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
            style={{ minHeight: '220px' }}
          >
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <HeartOfGold size="sm" />
                <p className="font-display text-lg italic text-foreground/80 leading-relaxed max-w-md">
                  "Hello, my love. Sit down, pull up a chair, and let's have a cup of coffee. What's on your heart today?"
                </p>
                <p className="font-body text-[10px] text-muted-foreground/45 tracking-widest uppercase">
                  Type a message below to start a conversation
                </p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs font-body leading-relaxed border ${
                      msg.role === 'user'
                        ? 'bg-primary/5 border-primary/25 text-foreground text-right'
                        : 'bg-black/45 border-white/5 italic text-foreground/90 text-left'
                    }`}
                    style={msg.role === 'assistant' ? {
                      background: 'linear-gradient(135deg, rgba(20, 15, 12, 0.6), rgba(12, 16, 12, 0.55))',
                    } : {}}
                  >
                    {msg.role === 'assistant' && (
                      <span className="block text-[8px] font-bold tracking-[0.2em] uppercase text-primary/60 mb-1">
                        Sonia
                      </span>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div 
                  className="bg-black/45 border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20, 15, 12, 0.6), rgba(12, 16, 12, 0.55))',
                  }}
                >
                  <span className="block text-[8px] font-bold tracking-[0.2em] uppercase text-primary/40 mr-1">
                    Sonia is writing
                  </span>
                  <span className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tell Sonia's memory what you are feeling..."
              className="flex-1 rounded-full bg-black/50 border border-primary/20 px-5 py-3 text-xs text-foreground placeholder-muted-foreground/35 focus:outline-none focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="gradient-gold-button rounded-full px-6 py-3 text-[10px] font-bold uppercase tracking-wider border-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
            >
              Send
            </button>
          </form>

          {chatMessages.length > 0 && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setChatMessages([])}
                className="text-[10px] font-body tracking-wider uppercase text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
              >
                Clear Conversation
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Disclaimer — clearly visible */}
      <div className="mt-8 rounded-2xl border border-border/10 px-5 py-4 text-center"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <p className="font-body text-[10px] text-muted-foreground/40 leading-relaxed italic">
          Inspired by Sonia's love and Gannon's memories. Not a replacement for Sonia.
          Not medical, legal, crisis, or therapy advice.
        </p>
        <p className="font-body text-[10px] text-muted-foreground/30 mt-2 leading-relaxed">
          If you are in immediate danger or need urgent support, contact emergency services,{' '}
          <strong className="text-muted-foreground/45">Lifeline 13 11 14</strong>, or{' '}
          <strong className="text-muted-foreground/45">Beyond Blue 1300 22 4636</strong>.
        </p>
      </div>
    </section>
  );
}