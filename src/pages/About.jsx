import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">About</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-4">Thanking You Kindly</h1>
          <p className="font-body text-sm tracking-[0.35em] uppercase gradient-gold-text">Carry the Message</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-3xl border border-primary/20 bg-card/50 p-8 md:p-10 space-y-6"
        >
          <p className="font-body text-base md:text-lg text-foreground/85 leading-relaxed">
            Thanking You Kindly is inspired by Sonia Waye's warmth, humour, generosity, and the business dream she carried. Rebuilt by Gannon Waye as a care-led product and gifting brand in her honour.
          </p>

          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Every product carries meaning. Every gift carries a message. This is not just merch, it is a way to carry kindness forward, the way Sonia carried it for everyone she met.
          </p>

          <div className="border-l-2 border-primary pl-4 py-2">
            <p className="font-display text-base gradient-gold-glow italic leading-7">
              "She was still loving everyone else first."
            </p>
            <p className="font-body text-xs text-muted-foreground mt-2 tracking-widest uppercase">For Sonia</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/store">
              <Button className="rounded-full px-7 py-4 font-body text-sm tracking-wider uppercase gradient-gold-button border-0 w-full sm:w-auto">
                Visit the Store <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/remember-mum">
              <Button variant="outline" className="rounded-full px-7 py-4 font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto">
                <Heart className="w-4 h-4 mr-2" /> Remember Mum
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            The music, the lyrics, the stories, and the gifts all live under one roof now. Made by Gannon Waye, in Melbourne, for anyone carrying something heavy and choosing to keep going.
          </p>
        </motion.div>
      </div>
    </div>
  );
}