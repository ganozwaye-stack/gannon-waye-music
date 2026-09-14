import { motion } from 'framer-motion';
import { Lock, Music } from 'lucide-react';

export default function TunecoreIntegration() {
  return (
    <div className="max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl text-foreground">Distributor Importer</h1>
        </div>

        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-body text-sm font-semibold text-foreground">Importer held for release safety</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-foreground/70">
                This page cannot collect credentials, connect a distributor account, retrieve release data, or create or change Release records.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border/30 bg-secondary/20 p-6">
          <h2 className="font-display text-lg text-foreground">What remains protected</h2>
          <ul className="mt-4 space-y-2 font-body text-sm text-foreground/70">
            <li>• New releases begin as private drafts.</li>
            <li>• No distributor data can make a release public.</li>
            <li>• Public release, fan email, and social activity each require their own owner-approved workflow.</li>
          </ul>
          <p className="mt-4 font-body text-xs text-muted-foreground">
            No credentials are requested or stored in this browser. Any future importer must be separately designed, reviewed, and approved before it is enabled.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
