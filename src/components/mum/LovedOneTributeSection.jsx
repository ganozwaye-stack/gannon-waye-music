import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Flame, CheckCircle2, Loader2 } from 'lucide-react';

// A quiet corner of the memorial page where visitors light a candle in words
// for a loved one of their own. Tributes are stored as moderated posts and
// only appear on the wall after Gannon approves them, exactly like memories
// of Sonia. House style: no em dashes.
const GOLD = 'rgba(255,210,160,';

export default function LovedOneTributeSection() {
  const [name, setName] = useState('');
  const [lovedOne, setLovedOne] = useState('');
  const [tribute, setTribute] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [tributes, setTributes] = useState([]);

  useEffect(() => {
    base44.entities.FanPost.filter({ type: 'tribute', status: 'approved' }, '-created_date', 30)
      .then(setTributes)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !tribute) return;
    setLoading(true);
    try {
      await base44.entities.FanPost.create({
        author_name: name,
        content: `${lovedOne ? `For ${lovedOne} — ` : ''}${tribute}`,
        type: 'tribute',
        status: 'pending',
      });
      setDone(true);
      setName('');
      setLovedOne('');
      setTribute('');
    } catch (err) {
      // error bubbles up
    }
    setLoading(false);
  };

  return (
    <div className="mt-20">
      <div className="text-center mb-8">
        <Flame className="w-4 h-4 mx-auto mb-3" style={{ color: `${GOLD}0.5)` }} />
        <h2 className="font-display text-2xl md:text-3xl mb-3" style={{ color: `${GOLD}0.9)` }}>
          For Someone You Love
        </h2>
        <p className="font-body text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
          If you are carrying someone in your heart, this page is for them too.
          Leave a few words in their memory, and they will be kept here beside Sonia's light.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-8" style={{ background: `${GOLD}0.02)`, border: `1px solid ${GOLD}0.1)` }}>
        {done ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ background: `${GOLD}0.06)`, border: `1px solid ${GOLD}0.2)` }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: `${GOLD}0.8)` }} />
            </div>
            <p className="font-display text-xl mb-3" style={{ color: `${GOLD}0.9)` }}>Your tribute has been received</p>
            <p className="font-body text-sm leading-relaxed mb-6 max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Thank you for honouring them here. Gannon will personally read each tribute before it appears on the wall.
            </p>
            <Button type="button" onClick={() => setDone(false)}
              variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase"
              style={{ borderColor: `${GOLD}0.2)`, color: `${GOLD}0.7)` }}>
              Leave Another Tribute
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Name *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required
                className="bg-transparent font-body text-sm" style={{ borderColor: `${GOLD}0.15)`, color: 'rgba(255,255,255,0.9)' }}
                placeholder="Your name" />
            </div>
            <div>
              <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Who Is This Tribute For?</Label>
              <Input value={lovedOne} onChange={e => setLovedOne(e.target.value)}
                className="bg-transparent font-body text-sm" style={{ borderColor: `${GOLD}0.15)`, color: 'rgba(255,255,255,0.9)' }}
                placeholder="e.g. My Dad, Aunty Rose, my best friend Jay..." />
            </div>
            <div>
              <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Tribute *</Label>
              <Textarea value={tribute} onChange={e => setTribute(e.target.value)} required rows={4}
                className="bg-transparent font-body text-sm resize-none" style={{ borderColor: `${GOLD}0.15)`, color: 'rgba(255,255,255,0.9)' }}
                placeholder="A few heartfelt words about them, something they taught you, or simply that you miss them..." />
            </div>
            <Button type="submit" disabled={loading || !name || !tribute}
              className="w-full rounded-full py-6 font-body text-sm tracking-wider uppercase border-0"
              style={{ background: 'linear-gradient(90deg, #c9a84c 0%, #f5d06e 50%, #c9a84c 100%)', color: '#1a1208' }}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : <><Flame className="w-4 h-4 mr-2" />Light Their Candle</>}
            </Button>
            <p className="font-body text-[10px] text-center leading-relaxed pt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Every tribute is read by Gannon first, so please allow a little time before it appears.
            </p>
          </form>
        )}
      </motion.div>

      {tributes.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Flame className="w-4 h-4" style={{ color: `${GOLD}0.4)` }} />
            <h2 className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: `${GOLD}0.4)` }}>
              Tributes for Loved Ones
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {tributes.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="rounded-xl p-5" style={{ background: `${GOLD}0.02)`, border: `1px solid ${GOLD}0.08)` }}>
                <Flame className="w-3.5 h-3.5 mb-3" style={{ color: `${GOLD}0.55)`, filter: 'drop-shadow(0 0 6px rgba(245,200,66,0.4))' }} />
                <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.content}</p>
                <p className="font-body text-xs" style={{ color: `${GOLD}0.4)` }}>— {t.author_name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}