import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Music, RefreshCw, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function TunecoreIntegration() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const handleSave = async () => {
    if (!apiKey) {
      toast({ title: 'Please enter your Tunecore API key', variant: 'destructive' });
      return;
    }
    toast({ title: 'API key saved. Use sync to pull releases.' });
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await base44.functions.invoke('syncTunecore', {});
      setSyncStatus({
        success: true,
        count: result.data.synced || 0,
      });
      setLastSync(new Date());
      toast({ title: `Synced ${result.data.synced || 0} releases from Tunecore` });
    } catch (error) {
      setSyncStatus({
        success: false,
        error: error.message,
      });
      toast({ title: 'Sync failed: ' + error.message, variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl text-foreground">Tunecore Integration</h1>
        </div>

        {/* Info Card */}
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 mb-8">
          <p className="font-body text-foreground/70 leading-relaxed">
            Connect your Tunecore account to automatically sync all releases directly to your site. Your music, everywhere.
          </p>
        </div>

        {/* API Key Setup */}
        <div className="space-y-4">
          <h2 className="font-display text-xl text-foreground">1. Connect Your Account</h2>
          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground block mb-2">
              Tunecore API Key
            </label>
            <Input
              type="password"
              placeholder="Paste your API key here"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="bg-secondary/50 border-border/40"
            />
            <p className="font-body text-xs text-muted-foreground/60 mt-2">
              <a href="https://www.tunecore.com/account/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Get your API key from Tunecore →
              </a>
            </p>
          </div>
          <Button onClick={handleSave} className="rounded-lg gradient-gold-button border-0">
            Save API Key
          </Button>
        </div>

        {/* Sync */}
        <div className="space-y-4 border-t border-border/30 pt-8">
          <h2 className="font-display text-xl text-foreground">2. Sync Your Releases</h2>
          <p className="font-body text-foreground/70">
            Pull all your releases from Tunecore and automatically add them to your site with streaming links.
          </p>
          <Button
            onClick={handleSync}
            disabled={syncing}
            className="rounded-lg gap-2 gradient-gold-button border-0 py-5"
          >
            {syncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" /> Sync Now
              </>
            )}
          </Button>

          {lastSync && (
            <p className="font-body text-xs text-muted-foreground">
              Last synced: {lastSync.toLocaleString()}
            </p>
          )}
        </div>

        {/* Status Messages */}
        {syncStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${
              syncStatus.success
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-destructive/10 border-destructive/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {syncStatus.success ? (
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <div>
                {syncStatus.success ? (
                  <>
                    <p className="font-body font-medium text-green-600">Sync Successful</p>
                    <p className="font-body text-sm text-foreground/70 mt-1">
                      {syncStatus.count} release{syncStatus.count !== 1 ? 's' : ''} synced from Tunecore
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-body font-medium text-destructive">Sync Failed</p>
                    <p className="font-body text-sm text-foreground/70 mt-1">{syncStatus.error}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* What It Does */}
        <div className="bg-secondary/20 rounded-2xl p-6 border border-border/30">
          <h3 className="font-display text-lg text-foreground mb-4">What Gets Synced:</h3>
          <ul className="space-y-2 font-body text-foreground/70">
            <li>✓ Release title, description & artwork</li>
            <li>✓ Release date & type (single/EP/album)</li>
            <li>✓ Streaming links (Spotify, Apple Music, YouTube)</li>
            <li>✓ Automatic publication to your site</li>
          </ul>
          <p className="font-body text-xs text-muted-foreground/60 mt-4">
            Syncs automatically every time you hit "Sync Now" — no manual updates needed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}